import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import './HomePage.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  
  useEffect(() => {
    // Fetch the list of registered restaurants from your backend
    fetch('http://localhost:100/restaurants')
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching restaurants:', error));
  }, []);

  return (
    <div className="home">
      <Navbar />
      <div className="home-content">
        {restaurants.length === 0 ? (
          <p>No registered restaurants available at the moment.</p>
        ) : (
          <p>{restaurants.length} restaurants available.</p>
          // You can also list the restaurant names here
        )}
      </div>
    </div>
  );
};

export default Home;
