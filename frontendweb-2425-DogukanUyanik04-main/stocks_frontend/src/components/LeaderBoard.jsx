import React, { useState } from 'react';
import useSWR from 'swr';  
import { fetchLeaderboardData } from '../api/gebruikers'; 

const Leaderboard = () => {
  const [filter, setFilter] = useState('all-time');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users, error, isLoading } = useSWR('leaderboard', fetchLeaderboardData);

  const calculatePortfolioValue = (user) => {
    if (!user.portfolio || !Array.isArray(user.portfolio)) {
      return 0;
    }

    return user.portfolio.reduce((total, stock) => {
      return total + stock.quantity * stock.price;
    }, 0);
  };

  const sortedUsers = Array.isArray(users)
    ? users.sort((a, b) => {
        const aPortfolioValue = calculatePortfolioValue(a);
        const bPortfolioValue = calculatePortfolioValue(b);
        const aTotalValue = a.balans + aPortfolioValue;
        const bTotalValue = b.balans + bPortfolioValue;
        return bTotalValue - aTotalValue;
      })
    : [];

  const filteredUsers = sortedUsers.filter(user =>
    user.naam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div>Loading leaderboard...</div>;
  if (error) return <div>{error.message || 'Failed to load users'}</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center my-4 text-primary">
        <i className="fas fa-trophy me-2"></i> Top Performers
      </h1>

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search users by name"
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="btn-group mb-4" role="group" aria-label="Time Period Filter">
        <button className="btn btn-primary" onClick={() => setFilter('daily')}>Daily</button>
        <button className="btn btn-secondary" onClick={() => setFilter('weekly')}>Weekly</button>
        <button className="btn btn-success" onClick={() => setFilter('all-time')}>All-Time</button>
      </div>

      <div className="row">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={user.id} className="col-md-4 mb-3">
              <div className="card shadow-lg p-3 mb-5 bg-white rounded hover-shadow">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="d-flex align-items-center">
                      <span className="badge bg-warning me-2">
                        {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}
                      </span>
                      <span>{user.naam}</span>
                    </span>
                    <span>{(user.balans + calculatePortfolioValue(user)).toFixed(2)} €</span>
                  </div>
                  <div className="progress mt-3">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${((user.balans + calculatePortfolioValue(user)) / 10000) * 100}%` }}
                      aria-valuenow={((user.balans + calculatePortfolioValue(user)) / 10000) * 100}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No users found</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
