import React from 'react';
import PortfolioItem from '../../components/portfolio/PortfolioItem.jsx';
const PortfolioPage = () => {
  const userId = 1; 

  return (
    <div>
      <PortfolioItem userId={userId}/>
    </div>
  );
};

export default PortfolioPage;
