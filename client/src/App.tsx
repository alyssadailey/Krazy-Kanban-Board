import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import AuthService from "./utils/auth";

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    // Auto-logout user when token expires
    AuthService.autoLogoutOnTokenExpiration();

    // Redirect to login if user is not logged in
    if (!AuthService.loggedIn()) {
      navigate("/login"); // Send user to login page
    }
  }, [navigate]);

  return (
    <div className='container'>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
