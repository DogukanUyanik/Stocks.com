// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="footer mt-auto py-3" style={{ backgroundColor: '#1B2A49', color: 'white' }}>
      <div className="container text-center">
        <p>© 2024 Stocks.com | All rights reserved</p>
        <p>
          <a href="/terms" style={{ color: 'white', textDecoration: 'none' }}>Terms of Service</a> | 
          <a href="/privacy" style={{ color: 'white', textDecoration: 'none' }}>Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
}
