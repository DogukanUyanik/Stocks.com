import React from 'react';
import { Link } from 'react-router-dom';

export default function NavButton({ label, to }) {
  const buttonClass =
    label.toLowerCase() === 'login'
      ? 'btn-outline-primary'  
      : 'btn-success';  

  return (
    <Link to={to}>
      <button
        className={`btn ${buttonClass} btn-sm me-2`}  
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          transition: 'background-color 0.3s, border-color 0.3s',  
        }}
        onMouseOver={(e) => {
          if (label.toLowerCase() === 'register') {
            e.target.style.backgroundColor = '#218838';  
            e.target.style.color = '#fff';
          }
        }}
        onMouseOut={(e) => {
          if (label.toLowerCase() === 'register') {
            e.target.style.backgroundColor = '';  
            e.target.style.color = '';  
          }
        }}
      >
        {label}
      </button>
    </Link>
  );
}
