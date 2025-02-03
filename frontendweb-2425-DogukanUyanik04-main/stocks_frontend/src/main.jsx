// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { ThemeProvider } from './contexts/Theme.context.jsx';


import NotFound from './pages/NotFound';
import { Navigate } from 'react-router-dom';
import Layout from './pages/Layout.jsx';
import HomePage from './pages/home/HomePage.jsx';
import Login from './pages/Login.jsx';
import RegisterPage from './pages/register/RegisterPage.jsx';
import AandeelPagina  from './pages/aandelen/AandeelPage.jsx';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage.jsx';
import PortfolioPage from './pages/portfolio/PortfolioPage.jsx';
import Logout from './pages/Logout.jsx';
import BuyForm from './pages/BuyForm.jsx';
import Privacy from './pages/Privacy.jsx';
import SellForm from './pages/SellForm.jsx';
import DeleteUsers from './pages/DeleteUsers.jsx';
import TransactieAdmin from './pages/transacties/TransactieAdmin.jsx';


import { AuthProvider } from './contexts/Auth.context.jsx';

import PrivateRoute from './components/PrivateRoute.jsx';
import Terms from './pages/Terms.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />, 

    children: [
      {
        path: '/',
        element: <HomePage/>,
      },


      {
        path: '/register',
        element: <RegisterPage/>,
      },

      {
        path: '/login',
        element: <Login/>

      },

      {
        path: '/logout',
        element: <Logout/>

      },

      {
        path: '/aandeelpagina',
        element: <AandeelPagina/>,
      },

      {
        path: '/leaderboardpagina',
        element: <LeaderboardPage/>,
      },

      {
        path: '/portfolio',
        element: <PortfolioPage/>,
      },

      {
        path: '/buy/:stockId',
        element: <BuyForm />
      },

      {
        path: '/sell/:stockId',
        element: <SellForm/>
      },

      {
        path: '/privacy',
        element: <Privacy/>
      },

      {
        path: '/terms',
        element: <Terms/>
      },

      {
        path: '/delete',
        element: <DeleteUsers/>
      },

      {
        path: '/transacties',
        element: <TransactieAdmin/>
      },



     
      
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider>
    <RouterProvider router={router} />
    </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
