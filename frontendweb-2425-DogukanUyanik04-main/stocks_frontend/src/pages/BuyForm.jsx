import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { jwtDecode } from 'jwt-decode';
import { buyTransaction } from '../api/transacties'; 
import { getAllAandelen } from '../api/aandelen'; 
import { getBalanceById } from '../api/gebruikers'; 

const BuyForm = () => {
  const { stockId } = useParams(); 
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [balanceError, setBalanceError] = useState(null);
  const [balance, setBalance] = useState(0); 
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
      const fetchBalance = async () => {
        try {
          const userBalance = await getBalanceById(userId); 
          setBalance(userBalance || 0); 
        } catch (error) {
          setBalanceError('Failed to fetch balance');
        }
      };
      fetchBalance();
    }
  }, [userId]);

  if (stocksLoading) {
    return <div className="alert alert-info" data-cy="loading-message">Loading...</div>;
  }

  if (fetchError) {
    return <div className="alert alert-danger" data-cy="fetch-error">Failed to load stock data. Please try again.</div>;
  }

  const stock = stocks?.items?.find((item) => item.id === parseInt(stockId));

  if (!stock) {
    return <div className="alert alert-info" data-cy="stock-not-found">Stock not found or still loading...</div>;
  }

  const handleBuy = async (e) => {
    e.preventDefault();
    if (balance < stock.prijs * quantity) {
      setError('Insufficient balance to make this purchase');
      return;
    }
    try {
      const transactionData = {
        aandeelId: stock.id,
        hoeveelheid: quantity,
        gebruikerId: userId,
      };
      const response = await buyTransaction(transactionData);
      if (response && response.gebruiker) {
        setSuccess(`Successfully bought ${quantity} shares of ${stock.naam}.`);
        setBalance(response.gebruiker.balans);
      } else {
        setError('Failed to complete the transaction. Please try again.');
      }
    } catch (err) {
      setError('Failed to complete the transaction. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Buy {stock.naam}</h2>

      <div className="mb-3">
        <strong>Your Balance: </strong>
        <span>{balance} $</span>
      </div>

      <form onSubmit={handleBuy}>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price (per share):</label>
          <input
            type="text"
            id="price"
            className="form-control"
            value={`${stock.prijs} $`}
            readOnly
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
          />
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-success" data-cy="buy-button">
            Buy
          </button>
        </div>
      </form>

      {success && <div className="alert alert-success mt-3" data-cy="success-message">{success}</div>}
      {error && <div className="alert alert-danger mt-3" data-cy="error-message">{error}</div>}
      {balanceError && <div className="alert alert-danger mt-3" data-cy="balance-error">{balanceError}</div>}
    </div>
  );
};

export default BuyForm;
