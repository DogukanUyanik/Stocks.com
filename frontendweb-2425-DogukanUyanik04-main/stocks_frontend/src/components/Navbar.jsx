import { Link, useNavigate } from 'react-router-dom';
import NavButton from './NavButton';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext, themes } from '../contexts/Theme.context';
import { IoMoonSharp, IoSunny } from 'react-icons/io5';
import { useAuth } from '../contexts/auth';
import { jwtDecode } from 'jwt-decode'; 

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext); 
  const { isAuthed, Logout } = useAuth(); 
  const navigate = useNavigate(); 

  const [isAdmin, setIsAdmin] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (isAuthed && token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        if (decodedToken && decodedToken.roles && decodedToken.roles.includes('admin')) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false); 
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAdmin(false); 
      }
    } else {
      setIsAdmin(false); 
    }
  }, [isAuthed]);

  const handlePortfolioClick = () => {
    if (isAuthed) {
      navigate('/portfolio'); 
    } else {
      navigate('/login'); 
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark sticky-top mb-4 p-0"
      style={{ backgroundColor: '#1B2A49' }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link to="/" className="navbar-brand text-decoration-none text-white fs-4 ps-3">
          Stocks.com
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mx-auto"> 
  <li className="nav-item">
    <Link
      to="/aandeelpagina"
      className="nav-link text-white fs-6 text-decoration-underline pe-4"
      style={{ marginRight: '40px' }} 
    >
      Live Stocks
    </Link>
  </li>
  <li className="nav-item">
    <Link
      to="/leaderboardpagina"
      className="nav-link text-white fs-6 text-decoration-underline pe-4"
      style={{ marginRight: '40px' }} 
    >
      Leaderboard
    </Link>
  </li>

  <li className="nav-item">
    <button
      onClick={handlePortfolioClick}
      className="nav-link text-white fs-6 text-decoration-underline pe-4"
      style={{ background: 'none', border: 'none', marginRight: '40px' }} 
    >
      Portfolio
    </button>
  </li>

  {isAdmin && (
    <>
      <li className="nav-item">
        <Link
          to="/delete"
          className="nav-link text-danger fs-6 text-decoration-underline pe-4"
          style={{ marginRight: '40px' }} 
        >
          Delete users
        </Link>
      </li>
      <li className="nav-item">
        <Link
          to="/transacties"
          className="nav-link text-danger fs-6 text-decoration-underline pe-4"
          style={{ marginRight: '40px' }} 
        >
          Transactions
        </Link>
      </li>
    </>
  )}
</ul>



          <ul className="navbar-nav ms-auto"> 
            <li className="nav-item d-flex align-items-center">
              {isAuthed ? (
                <NavButton label="Logout" to="/logout" />
              ) : (
                <>
                  <NavButton label="Login" to="/login" />
                  <NavButton label="Register" to="/register" />
                </>
              )}
            </li>

            <li className="nav-item">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={toggleTheme}
                style={{ border: 'none', background: 'transparent' }}
              >
                {theme === themes.dark ? <IoMoonSharp /> : <IoSunny />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
