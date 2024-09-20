import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [showProfile, setShowProfile] = useState(false); // State to control profile visibility
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Fetch profile data once on component mount
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:100/users/profile/${userId}`)
        .then(response => {
          setProfileData(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the profile!", error);
        });
    }
  }, [userId]);

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  // Toggle profile visibility
  const handleProfileClick = () => {
    setShowProfile(!showProfile); // Toggle the profile section on button click
  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <div className="navbar">
        <h1>User Dashboard</h1>
        <div className="navbar-buttons">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/contact')}>Contact Us</button> {/* Contact Us button */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="dashboard-content">
        <div className="sidebar">
          <button onClick={handleProfileClick}>Profile</button>
          <button onClick={() => navigate('/order')}>Order</button>
          <button onClick={() => navigate('/cart')}>Cart</button>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {showProfile && profileData && ( // Only show the profile when 'showProfile' is true
            <div className="profile-details">
              <h2>Profile Information</h2>
              <p><strong>Name:</strong> {profileData.firstName} {profileData.lastName}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Phone Number:</strong> {profileData.phoneNo}</p>
              <p><strong>Role:</strong> {profileData.role}</p>
              <p><strong>Wallet Balance:</strong> {profileData.walletBalance}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
