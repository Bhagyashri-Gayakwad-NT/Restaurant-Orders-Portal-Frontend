import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './RestaurantDetails.css';
import { UserContext } from './context/UserContext'; // Import UserContext to check login status
import { toast, ToastContainer } from 'react-toastify';

const RestaurantDetails = () => {
  const { restaurantId } = useParams(); // Get restaurantId from the URL params
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const { user } = useContext(UserContext); // Access the logged-in user from context
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch restaurant details by restaurantId
    fetch(`http://localhost:300/restaurant/getRestaurant/${restaurantId}`)
      .then((response) => response.json())
      .then((data) => setRestaurant(data))
      .catch((error) => console.error('Error fetching restaurant details:', error));

    // Fetch food categories by restaurantId
    fetch(`http://localhost:300/categories/foodCategory/${restaurantId}`)
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
    if (!user) {
      // If the user is not logged in, redirect to login page
     // alert('Please log in to add items to your cart.'); 
     toast.error("Please log in to add items to your cart."); 
     setTimeout(()=> {
       navigate('/login');
     },2000)
      return;
    }

    fetch('http://localhost:200/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id, // Use the logged-in user's ID from context
        restaurantId,
        foodItemId,
        quantity: 1,
        price,
      }),
    })
    .then((response) => {
      if (!response.ok) {
        // If the HTTP response status is not 200-299, throw an error
        return response.json().then((errData) => {
          throw new Error(errData.message || "Something went wrong");
        });
      }
      return response.json();
    })
      .then((data) => {
        toast.success(data.message);
        console.log('Item added to cart:', data);
      })
      .catch((error) => toast.error(error.message));
  };

  const handleViewCart = () => {
    if (!user) {
     // alert('Please log in to view your cart.');
     // navigate('/login');
     toast.error("Please log in to view your cart."); 
     setTimeout(()=> {
       navigate('/login');
     },2000)
    } else {
      navigate(`/cart/user/${user.id}/restaurant/${restaurantId}`);
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
      {categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <div>
              <li key={category.foodCategoryId}>{category.foodCategoryName}</li>
              <ul>
                {foodItems.map((item) => (
              category.foodCategoryId === item.categoryId ? 
              <>
              <h3>Food Items</h3>
                  <li key={item.foodItemId}>
                    <img
                      src={`http://localhost:300/foodItems/${item.foodItemId}/image`}
                      alt={item.foodItemName}
                      className="food-item-image"
                    />
                    {item.foodItemName} - Rs. {item.price}
                    <button onClick={() => handleAddToCart(item.foodItemId, item.price)}>
                      Add to Cart
                    </button>
                  </li> 
                  </>
                  : ""
                ))}
              </ul>
            </div>
          ))}
        </ul>
      ) : (
        <p>No categories available</p>
      )}

      <button onClick={handleViewCart}>View Cart</button>
      <ToastContainer />
    </div>
  );
};

export default RestaurantDetails;
