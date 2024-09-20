import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
  const { restaurantId } = useParams(); // Get restaurantId from the URL params
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch restaurant details by restaurantId
    fetch(`http://localhost:300/restaurant/getRestaurant/${restaurantId}`)
      .then((response) => response.json())
      .then((data) => setRestaurant(data))
      .catch((error) => console.error('Error fetching restaurant details:', error));

    // Fetch food categories by restaurantId
    fetch(`http://localhost:300/categories/foodCategoryByRestaurantId/${restaurantId}`)
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));

    // Fetch food items by restaurantId
    fetch(`http://localhost:300/foodItems/getFoodItems/${restaurantId}`)
      .then((response) => response.json())
      .then((data) => setFoodItems(data))
      .catch((error) => console.error('Error fetching food items:', error));
  }, [restaurantId]);

  const handleAddToCart = (foodItemId, price) => {
    const userId = localStorage.getItem("userId") // Replace with actual user ID from authentication context or state

    fetch('http://localhost:200/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        restaurantId,
        foodItemId,
        quantity: 1,
        price,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Item added to cart:', data);
      })
      .catch((error) => console.error('Error adding item to cart:', error));
  };

  const handleViewCart = () => {
    // const userId = 1; // Replace with actual user ID from authentication context or state
    const userId = localStorage.getItem("userId");
    if(userId == null){
        alert("User need to log in");
    }else{
    navigate(`/cart/user/${userId}/restaurant/${restaurantId}`);
    }
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div className="restaurant-details">
      <Navbar />
      <h2>{restaurant.restaurantName}</h2>
      <img
        src={`data:image/jpeg;base64,${restaurant.restaurantImage}`} 
        alt={restaurant.restaurantName}
        className="restaurant-image"
      />
      <p>Location: {restaurant.restaurantAddress}</p>
      <p>Contact: {restaurant.contactNumber}</p>
      <p>Description: {restaurant.description}</p>

      <h3>Food Categories</h3>
      <ul>
        {categories.map((category) => (
          <li key={category.categoryId}>{category.categoryName}</li>
        ))}
      </ul>

      <h3>Food Items</h3>
      <ul>
        {foodItems.map((item) => (
          <li key={item.foodItemId}>
            <img 
              src={`http://localhost:300/foodItems/${item.foodItemId}/image`} 
              alt={item.foodItemName}
              className="food-item-image"
            />
            {item.foodItemName} - Rs. {item.price}
            <button onClick={() => handleAddToCart(item.foodItemId, item.price)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <button onClick={handleViewCart}>View Cart</button>
    </div>
  );
};

export default RestaurantDetails;
