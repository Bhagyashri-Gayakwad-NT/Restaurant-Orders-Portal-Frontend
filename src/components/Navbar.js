import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './context/UserContext'; 
import './Navbar.css';

const Navbar = () => {
  const { user, logoutUser } = useContext(UserContext); 
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {

    console.log("user", user);
    

    if (user.role === 'USER') {
      navigate('/UserDashboard');
    } else if (user.role === 'RESTAURANT_OWNER') {
      navigate('/RestaurantOwnerDashboard');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>Restaurant Orders Portal</h1>
      </div>
      <div className="navbar-right">
        <Link to="/contact" className='btn'>Contact Us</Link>

        {user ? (
          <>
            <button onClick={handleDashboardRedirect} className="user-icon"> Dashboard
            </button>
            <button onClick={handleLogout} className="btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
