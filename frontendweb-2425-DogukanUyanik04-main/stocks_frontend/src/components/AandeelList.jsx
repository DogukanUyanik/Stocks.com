import React, { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { getAllAandelen } from '../api/aandelen';
import AsyncData from './AsyncData';
import '../styles/AandeelLijst.css';
import { ThemeContext } from '../contexts/Theme.context';
import { AuthContext } from '../contexts/Auth.context'; 

const logoMapping = {
  GOOG: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/330px-Google_2015_logo.svg.png", // Google logo
  TSLA: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/135px-Tesla_Motors.svg.png", // Tesla logo
  AAPL: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/135px-Apple_logo_black.svg.png", // Apple logo
  AMZN: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", // Amazon logo
  MSFT: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" // Microsoft logo
};

const AandeelLijst = () => {
  const { data: stocks, error } = useSWR('stocks', getAllAandelen, {
    refreshInterval: 5000,
  });

  const { theme } = useContext(ThemeContext); 
  const { isAuthed } = useContext(AuthContext); 
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredStocks = useMemo(
    () =>
      stocks?.items?.filter((stock) =>
        stock.naam.toLowerCase().includes(search.toLowerCase())
      ),
    [search, stocks]
  );

  const handleBuyClick = (stockId) => {
    if (isAuthed) {
      navigate(`/buy/${stockId}`); 
    } else {
      navigate('/login'); 
    }
  };

  return (
    <>
      <h4>Search for your favourite stock</h4>

      <div className='input-group mb-3 w-50'>
        <input
          type='search'
          id='search'
          className='form-control rounded'
          placeholder='Search by stock name'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type='button'
          className='btn btn-outline-primary'
          onClick={() => setSearch(text)}
          data-cy='stocks_search_btn'
        >
          Search
        </button>
      </div>

      <div className='mt-4'>
        {error && (
          <div className="alert alert-danger" data-cy="axios_error_message">
            {error.message || 'Failed to load stocks'}
          </div>
        )}

        <AsyncData loading={!stocks} error={error}>
          {filteredStocks?.length ? (
            <div className={`list-group theme-${theme}`}>
              {filteredStocks.map((stock) => {
                const logoUrl = logoMapping[stock.afkorting] || 'https://via.placeholder.com/50';

                return (
                  <div className={`list-group-item d-flex justify-content-between align-items-center mb-3 shadow-sm stock-item theme-${theme}`} key={stock.id}>
                    <img
                      src={logoUrl}
                      alt={stock.naam}
                      className="me-3"
                      style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                    />

                    <div className="d-flex flex-grow-1 justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <span><strong>{stock.naam}</strong></span>
                        <span className="text-muted ms-2">{stock.afkorting}</span>
                      </div>
                      <span className="me-3">{stock.prijs} $</span>
                    </div>

                    <div className="d-flex">
                      <button
                        className="btn btn-success me-2"
                        onClick={() => handleBuyClick(stock.id)} 
                        data-cy='stocks_buy_btn'
                      >
                        Buy
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          if (isAuthed) {
                            navigate(`/sell/${stock.id}`); 
                          } else {
                            navigate('/login'); 
                          }
                        }}
                      >
                        Sell
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </AsyncData>
      </div>
    </>
  );
};

export default AandeelLijst;
