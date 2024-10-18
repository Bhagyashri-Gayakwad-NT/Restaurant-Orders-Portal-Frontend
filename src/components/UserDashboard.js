import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

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

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowProfile(!showProfile);
  };
  const handleContactUsClick = () => navigate('/contact');

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <h1>User Dashboard</h1>
        <div className="navbar-buttons">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={handleContactUsClick}>Contact Us</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="sidebar">
          <button onClick={handleProfileClick}>Profile</button>
          <button onClick={() => navigate(`/order-history/${userId}`)}>Order History</button>
        </div>

        <div className="main-content">
          {showProfile && profileData && (
            <div className="profile-details">
              <h2>Profile Information</h2>
              <p><strong>Name:</strong> {profileData.firstName} {profileData.lastName}</p>
              <p><strong>Email:</strong> {profileData.email}</p>
              <p><strong>Phone Number:</strong> {profileData.phoneNo}</p>
              <p><strong>Wallet Balance:</strong> {profileData.walletBalance}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;