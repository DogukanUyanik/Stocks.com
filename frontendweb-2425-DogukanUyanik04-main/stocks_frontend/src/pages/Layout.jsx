import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useContext } from 'react'; 
import { ThemeContext } from '../contexts/Theme.context';



export default function Layout() {
  const { theme, textTheme } = useContext(ThemeContext); 
  return (
    <div className={`d-flex flex-column min-vh-100 bg-${theme} text-${textTheme}`}>
      <Navbar />
      <div className="flex-grow-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
