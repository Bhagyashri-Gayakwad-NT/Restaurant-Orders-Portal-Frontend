import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import Navbar from './Navbar';
import './HomePage.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch('http://localhost:300/restaurant') // Ensure the URL matches your backend
      .then((response) => response.json())
      .then((data) => setRestaurants(data))
      .catch((error) => console.error('Error fetching restaurants:', error));
  }, []);

  return (
    <div className="home">
      <Navbar />
      <div className="home-content">
        {restaurants.length === 0 ? (
          <p>No registered restaurants available at the moment.</p>
        ) : (
          <div>
            <p>{restaurants.length} restaurants available.</p>
            <div className="restaurant-list">
              {restaurants.map((restaurant) => (
                <div key={restaurant.restaurantId} className="restaurant-item">
                  <h3>{restaurant.restaurantName}</h3>
                  <img
                    src={`data:image/jpeg;base64,${restaurant.restaurantImage}`} 
                    alt={restaurant.restaurantName}
                    className="restaurant-image"
                  />
                  <p>Location: {restaurant.restaurantAddress}</p>
                  <p>Contact: {restaurant.contactNumber}</p>
                  <p>Description: {restaurant.description}</p>
                  <Link to={`/restaurant/${restaurant.restaurantId}`}>
                    View Details
                  </Link> {/* Link to the restaurant details page */}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
