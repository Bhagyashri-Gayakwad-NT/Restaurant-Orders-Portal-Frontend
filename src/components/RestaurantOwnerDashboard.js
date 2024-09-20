import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RestaurantOwnerDashboard.css';
import { useNavigate } from 'react-router-dom';

const RestaurantOwnerDashboard = () => {
  const [profileData, setProfileData] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const navigate = useNavigate();
  
  // Fetch the userId from localStorage (or you can pass it as a prop from a higher component)
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    // If the profile panel is visible, fetch the profile data
    if (showProfilePanel) {
      axios.get(`http://localhost:100/users/profile/${userId}`)
        .then(response => {
          setProfileData(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the profile!", error);
        });
    }
  }, [showProfilePanel, userId]); // Depend on `showProfilePanel` and `userId`

  const handleMyProfileClick = () => {
    setShowProfilePanel(!showProfilePanel);
  };

  const handleNavigation = (path) => {
    navigate(path, { state: { userId: userId } });
  };
  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="owner-dashboard-container">
      <nav className="navbar">
        <div className="navbar-left">Restaurant Owner Dashboard</div>
        <div className="navbar-right">
          <button onClick={() => handleNavigation('/')}>Home</button>
          <button onClick={() => handleLogout('/')}>Logout</button>
        </div>
      </nav>

      <aside className="sidebar">
        <h3>Actions</h3>
        <button onClick={handleMyProfileClick}>My Profile</button>
        <button onClick={() => handleNavigation('/addRestaurant')}>Add Restaurant</button>
        <button onClick={() => handleNavigation('/viewAllRestaurants')}>My Restaurants</button>
        <button onClick={() => handleNavigation('/ViewAllCategories')}>Food Category</button>
        <button onClick={() => handleNavigation('/viewFoodItem')}>Food Menu</button>
      </aside>

      <div className="content">
        {showProfilePanel && (
          <div className={`profile-panel ${showProfilePanel ? 'visible' : ''}`}>
            {profileData && (
              <div className="profile-details">
                <h2>Profile Information</h2>
                <p><strong>Name:</strong> {`${profileData.firstName} ${profileData.lastName}`}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Phone Number:</strong> {profileData.phoneNo}</p>
                <p><strong>Role:</strong> {profileData.role}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantOwnerDashboard;
