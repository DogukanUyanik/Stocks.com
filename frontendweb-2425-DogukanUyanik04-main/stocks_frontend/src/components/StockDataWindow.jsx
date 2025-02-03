import React from 'react';
import useSWR from 'swr';
import { AANDELEN } from '../api/mock_data';
import '../styles/StockDataWindow.css'




//Dit component kon natuurlijk ook met een api call naar backend, maar wou dit erinlaten om te tonen dat er is geimplementeerd met fakerjs tijdens de mockdata fase van het project.
const fetchStockData = () => {
  return AANDELEN.map((stock) => ({
    ...stock,
    huidigeprijs: parseFloat((stock.huidigeprijs + (Math.random() - 0.5) * 10).toFixed(2)),
    percentageChange: parseFloat(((Math.random() - 0.5) * 2).toFixed(2)),
  }));
};

export default function StockDataWindow() {
  const { data: stocks, error } = useSWR('stocks', fetchStockData, {
    refreshInterval: 1000, 
    revalidateOnFocus: true, 
    keepPreviousData: true, 
  });

  if (error) return <div>Error loading data...</div>;

  if (!Array.isArray(stocks)) return <div>Loading...</div>;

  return (
    <div
      className="stock-data-window p-3 custom-stock-data-window"
      style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        width: '100%',
        marginBottom: '30px',
      }}
    >
      <h3>Market Overview</h3>
      <div className="stock-list">
        {stocks.map((stock) => (
          <div
            key={stock.id}
            className="stock-item p-2 m-2"
            style={{
              backgroundColor: '#fff',
              borderRadius: '6px',
              marginBottom: '10px',
            }}
          >
            <div className="row">
              <div className="col-12">
                <strong>{stock.afkorting}</strong>
              </div>
              <div className="col-12">{stock.bedrijfsnaam}</div>
              <div className="col-12">${stock.huidigeprijs.toFixed(2)}</div>
              <div
                className="col-12"
                style={{ color: stock.percentageChange >= 0 ? 'green' : 'red' }}
              >
                {stock.percentageChange >= 0
                  ? `+${stock.percentageChange}%`
                  : `${stock.percentageChange}%`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
