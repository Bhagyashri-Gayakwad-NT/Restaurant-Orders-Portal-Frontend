import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAllRestaurants.css'; // Create a CSS file for styling

const ViewAllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

  useEffect(() => {
    axios.get(`http://localhost:300/restaurant/restaurants/${userId}`)
      .then(response => {
        setRestaurants(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the restaurants!", error);
      });
  }, [userId]);

  return (
    <div className="view-all-restaurants-container">
      <h2>My Restaurants</h2>
      <div className="restaurants-list">
        {restaurants.length > 0 ? (
          restaurants.map(restaurant => (
            <div key={restaurant.restaurantId} className="restaurant-card">
              <h3>{restaurant.restaurantName}</h3>
              <p><strong>Address:</strong> {restaurant.restaurantAddress}</p>
              <p><strong>Contact:</strong> {restaurant.contactNumber}</p>
              <p><strong>Description:</strong> {restaurant.description}</p>
              <img 
                src={`data:image/jpeg;base64,${restaurant.restaurantImage}`} 
                alt={restaurant.restaurantName} 
                className="restaurant-image"
              />
            </div>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAllRestaurants;
