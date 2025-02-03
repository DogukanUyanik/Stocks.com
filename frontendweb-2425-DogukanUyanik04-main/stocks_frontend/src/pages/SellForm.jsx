import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { jwtDecode } from 'jwt-decode'; 
import { sellTransaction } from '../api/transacties'; 
import { getAllAandelen } from '../api/aandelen'; 
import { getUserStocks, getBalanceById } from '../api/gebruikers'; 

const SellForm = () => {
  const { stockId } = useParams(); 
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [balance, setBalance] = useState(0); 
  const [ownedStocks, setOwnedStocks] = useState(0); 
  const [userId, setUserId] = useState(null); 

  const { data: stocks, error: fetchError, isLoading: stocksLoading } = useSWR('stocks', getAllAandelen);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        try {
          const userBalance = await getBalanceById(userId);
          setBalance(userBalance || 0); 

          const userStocks = await getUserStocks(userId);
          const stockQuantity = userStocks[stockId]?.hoeveelheid || 0; 
          setOwnedStocks(stockQuantity); 
        } catch (err) {
          setError('Failed to fetch user data');
        }
      };
      fetchUserData();
    }
  }, [userId, stockId]); 

  if (stocksLoading) {
    return <div className="alert alert-info">Loading...</div>;
  }

  if (fetchError) {
    return <div className="alert alert-danger">Failed to load stock data. Please try again.</div>;
  }

  const stock = stocks?.items?.find((item) => item.id === parseInt(stockId));

  if (!stock) {
    return <div className="alert alert-info">Stock not found or still loading...</div>;
  }

  const handleSell = async (e) => {
    e.preventDefault();
  
    if (ownedStocks < quantity) {
      setError('You do not have enough shares to sell');
      return;
    }
  
    try {
      setSuccess(`Successfully sold ${quantity} shares of ${stock.naam}`);
      
      const transactionData = {
        aandeelId: stock.id,
        hoeveelheid: quantity,
        gebruikerId: userId, 
      };
  
      const response = await sellTransaction(transactionData);
  
      console.log('Transaction response:', response);
  
      if (response && response.gebruiker) {
        setBalance(response.gebruiker.balans); 
        
        const updatedUserStocks = await getUserStocks(userId);
        const updatedStockQuantity = updatedUserStocks[stockId]?.hoeveelheid || 0; 
        setOwnedStocks(updatedStockQuantity); 
      } else {
        console.log('Response data is missing required fields');
        setError('Failed to complete the transaction. Please try again.');
      }
    } catch (err) {
      console.error('Error completing transaction:', err);
      setError('Failed to complete the transaction. Please try again.');
      setSuccess(null);
    }
  };
  

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sell {stock.naam}</h2>

      <div className="mb-3">
        <strong>Your Balance: </strong>
        <span>{balance} $</span> 
      </div>

      <div className="mb-3">
        <strong>Your Owned Stocks: </strong>
        <span>{ownedStocks}</span> 
      </div>

      <form onSubmit={handleSell}>
  <div className="mb-3">
    <label htmlFor="price" className="form-label">Price (per share):</label>
    <input
      type="text"
      id="price"
      className="form-control"
      value={`${stock.prijs} $`}
      readOnly
      data-cy="price-input" 
    />
  </div>

  <div className="mb-3">
    <label htmlFor="quantity" className="form-label">Quantity:</label>
    <input
      type="number"
      id="quantity"
      className="form-control"
      value={quantity}
      min={1}
      onChange={(e) => setQuantity(Number(e.target.value))}
      data-cy="quantity-input" 
    />
  </div>

  <div className="mb-3">
    <label htmlFor="total" className="form-label">Total Price:</label>
    <input
      type="text"
      id="total"
      className="form-control"
      value={`${(stock.prijs * quantity).toFixed(2)} $`}
      readOnly
      data-cy="total-price" 
    />
  </div>

  <div className="d-grid gap-2">
    <button
      type="submit"
      className="btn btn-danger"
      data-cy="sell-button" 
    >
      Sell
    </button>
  </div>
</form>

{success && <div className="alert alert-success mt-3" data-cy="success-message">{success}</div>}
{error && <div className="alert alert-danger mt-3" data-cy="error-message">{error}</div>}

    </div>
  );
};

export default SellForm;
