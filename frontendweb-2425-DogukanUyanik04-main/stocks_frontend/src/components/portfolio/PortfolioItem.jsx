import React from 'react';
import useSWR from 'swr';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom'; 
import { getUserStocks } from '../../api/gebruikers';
import { getAandeelById } from '../../api/aandelen'; 
import { getBalanceById } from '../../api/gebruikers'; 
import { ThemeContext } from '../../contexts/Theme.context'; // Import ThemeContext

const PortfolioItem = () => {
  const [userId, setUserId] = React.useState(null);
  const [isDarkMode, setIsDarkMode] = React.useState(false); 
  const navigate = useNavigate();
  const { theme } = React.useContext(ThemeContext); // Use ThemeContext to get the theme

  React.useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId); 
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }

    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  const { data: stocks, error: stocksError } = useSWR(userId ? 'userStocks' : null, async () => {
    if (!userId) throw new Error('User is not authenticated.');
    return getUserStocks(userId);
  });

  const { data: balance, error: balanceError } = useSWR(userId ? `balance-${userId}` : null, async () => {
    if (!userId) throw new Error('User is not authenticated.');
    return getBalanceById(userId);
  });

  const stockIds = stocks ? Object.keys(stocks) : [];

  const { data: stockDetails, error: stockDetailsError } = useSWR(
    stockIds.length > 0 ? stockIds : null,
    async (ids) => {
      const detailPromises = ids.map((id) => getAandeelById(id));
      return Promise.all(detailPromises);
    }
  );

  const darkModeClass = isDarkMode ? 'text-light' : 'text-dark';
  const bgClass = isDarkMode ? 'bg-dark' : 'bg-light';

  const renderLoadingOrError = (data, error, message) => {
    if (error) return <div className="alert alert-danger">{message}</div>;
    if (!data) return <div className="alert alert-info">{message}</div>;
  };

  if (!stocks && !stocksError) return renderLoadingOrError(stocks, stocksError, 'Loading your portfolio...');
  if (stocksError) return renderLoadingOrError(stocks, stocksError, 'Failed to fetch stocks. Please try again later.');
  
  if (!stockDetails && !stockDetailsError) return renderLoadingOrError(stockDetails, stockDetailsError, 'Loading stock details...');
  if (stockDetailsError) return renderLoadingOrError(stockDetails, stockDetailsError, 'Failed to fetch stock details. Please try again later.');

  const totalStockWorth = stocks
    ? Object.values(stocks).reduce((acc, stock, index) => {
        const details = stockDetails ? stockDetails[index] : null;
        const stockWorth = details ? details.prijs * stock.hoeveelheid : 0;
        return acc + stockWorth;
      }, 0)
    : 0;

  const totalNetWorth = balance + totalStockWorth;

  const handleBuyClick = (stockId) => {
    if (userId) {
      navigate(`/buy/${stockId}`);
    } else {
      navigate('/login');
    }
  };

  const handleSellClick = (stockId) => {
    if (userId) {
      navigate(`/sell/${stockId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className={`container mt-5 theme-${theme}`}>
      <h2 className={`mb-4 text-center`}>
        Your Portfolio
      </h2>
  
      <div className="row mb-5">
  {[ 
    { title: 'Balance', value: balance ? balance.toFixed(2) : 'Loading...' }, 
    { title: 'Total Net Worth', value: totalNetWorth.toFixed(2) }
  ].map((section, index) => (
    <div className="col-md-6" key={index}>
      <div className={`p-4 rounded shadow-sm ${bgClass}`} style={{ backgroundColor: isDarkMode ? '#343a40' : '#f8f9fa' }}>
        <h4 className="text-black">{section.title}</h4>
        {/* Ensure text remains black with inline styles */}
        <p className="fs-3" style={{ color: 'black' }}>
          ${section.value}
        </p>
      </div>
    </div>
  ))}
</div>



  
      <div className={`list-group theme-${theme}`}>
        {Object.values(stocks).map((stock, index) => {
          const details = stockDetails ? stockDetails[index] : null;
          const stockId = details ? details.id : stock.aandeelId; 
          const stockWorth = details ? (details.prijs * stock.hoeveelheid).toFixed(2) : 'Loading...';
  
          if (stock.hoeveelheid <= 0) return null;
  
          return (
            <div className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${bgClass}`} key={stockId}>
              <div>
                <h5>{details ? details.naam : 'Loading...'}</h5>
                <div className="text-muted">
                  <span><strong>Quantity:</strong> {stock.hoeveelheid}</span>
                  <span className="ms-3"><strong>Current Worth:</strong> ${stockWorth}</span>
                </div>
              </div>
              <div className="d-flex">
                <button className={`btn ${isDarkMode ? 'btn-success' : 'btn-success'} me-2`} onClick={() => handleBuyClick(stockId)}>
                  Buy
                </button>
                <button className={`btn ${isDarkMode ? 'btn-danger' : 'btn-danger'}`} onClick={() => handleSellClick(stockId)}>
                  Sell
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioItem;
