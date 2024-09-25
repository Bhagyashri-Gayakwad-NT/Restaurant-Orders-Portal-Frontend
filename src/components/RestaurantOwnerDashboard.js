import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RestaurantOwnerDashboard.css';
import { useNavigate } from 'react-router-dom';

const RestaurantOwnerDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    if (showProfilePanel) {
      axios.get(`http://localhost:100/users/profile/${userId}`)
        .then(response => setProfileData(response.data))
        .catch(error => console.error("Error fetching profile", error));
    }
  }, [showProfilePanel, userId]);

  const handleMyProfileClick = () => setShowProfilePanel(!showProfilePanel);
  const handleNavigation = (path) => navigate(path, { state: { userId } });
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleContactUsClick = () => navigate('/contact');

  return (
    <div className="owner-dashboard-container">
      <nav className="navbar">
        <div className="navbar-left">Restaurant Owner Dashboard</div>
        <div className="navbar-right">
          <button onClick={() => handleNavigation('/')}>Home</button>
          <button onClick={handleContactUsClick}>Contact Us</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <aside className="sidebar">
        <h3>Actions</h3>
        <button onClick={handleMyProfileClick}>My Profile</button>
        <button onClick={() => handleNavigation('/addRestaurant')}>Add Restaurant</button>
        <button onClick={() => handleNavigation('/viewAllRestaurants')}>My Restaurants</button>
        <button onClick={() => handleNavigation('/ViewAllCategories')}>Food Category</button>
        <button onClick={() => handleNavigation('/viewFoodItem')}>Food Menu</button>
        <button onClick={() => handleNavigation('/viewOrders')}>View Orders</button>
      </aside>
      <div className="content">
        {showProfilePanel && profileData && (
          <div className="profile-panel">
            <h2>Profile Information</h2>
            <p><strong>Name:</strong> {`${profileData.firstName} ${profileData.lastName}`}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Phone Number:</strong> {profileData.phoneNo}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOwnerDashboard;