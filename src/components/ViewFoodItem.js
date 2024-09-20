import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewFoodItem.css';

const ViewFoodItem = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [newFoodItem, setNewFoodItem] = useState({
    foodItemName: '',
    description: '',
    price: '',
    isAvailable: false,
    foodItemImage: null,
  });

  const userId = localStorage.getItem('userId');

  // Fetch restaurants based on user ID
  useEffect(() => {
    if (userId) {
      setLoading(true);
      axios
        .get(`http://localhost:300/restaurant/restaurants/${userId}`)
        .then((response) => {
          setRestaurants(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching restaurants!", error);
          setError("Failed to load restaurants.");
          setLoading(false);
        });
    }
  }, [userId]);

  // Fetch categories based on selected restaurant ID
  useEffect(() => {
    if (selectedRestaurantId) {
      setLoading(true);
      axios
        .get(`http://localhost:300/categories/foodCategory/${selectedRestaurantId}`)
        .then((response) => {
          setCategories(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching categories!", error);
          setError("Failed to load categories.");
          setLoading(false);
        });
    }
  }, [selectedRestaurantId]);

  // Fetch food items based on selected category ID
  useEffect(() => {
    if (selectedCategoryId) {
      setLoading(true);
      axios
        .get(`http://localhost:300/foodItems/getFoodItem/${selectedCategoryId}`)
        .then((response) => {
          setFoodItems(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching food items!", error);
          setError("Failed to load food items.");
          setLoading(false);
        });
    }
  }, [selectedCategoryId]);

  // Fetch all food items based on restaurant ID
  const fetchAllFoodItemsByRestaurant = () => {
    if (selectedRestaurantId) {
      setLoading(true);
      axios
        .get(`http://localhost:501/foodItems/getFoodItems/${selectedRestaurantId}`)
        .then((response) => {
          setAllFoodItems(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching all food items!", error);
          setError("Failed to load all food items.");
          setLoading(false);
        });
    }
  };

  // Handle food item changes
  const handleFoodItemChange = (e) => {
    const { name, value } = e.target;
    setNewFoodItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setNewFoodItem((prev) => ({
      ...prev,
      foodItemImage: e.target.files[0],
    }));
  };

  const handleAddFoodItem = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('foodItemName', newFoodItem.foodItemName);
    formData.append('description', newFoodItem.description);
    formData.append('price', newFoodItem.price);
    formData.append('isAvailable', newFoodItem.isAvailable);
    formData.append('foodCategoryId', selectedCategoryId);
    formData.append('restaurantId', selectedRestaurantId);
    formData.append('foodItemImage', newFoodItem.foodItemImage);

    axios
      .post('http://localhost:300/foodItems/addFoodItem', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setFoodItems([...foodItems, response.data]);
        setNewFoodItem({
          foodItemName: '',
          description: '',
          price: '',
          isAvailable: false,
          foodItemImage: null,
        });
        setError(null);
      })
      .catch((error) => {
        console.error("Error adding food item!", error);
        setError("Failed to add food item.");
      });
  };

  const fetchFoodItemImage = (id) => {
    return `http://localhost:300/foodItems/${id}/image`;  // Image URL for food items
  };

  return (
    <div className="view-food-item-container">
      <h2>View and Add Food Items</h2>

      {loading && <p>Loading...</p>}
      {error && <div className="error-message">{error}</div>}

      {/* Restaurant Dropdown */}
      <div className="dropdown">
        <label htmlFor="restaurant">Select Restaurant:</label>
        <select
          id="restaurant"
          value={selectedRestaurantId}
          onChange={(e) => {
            setSelectedRestaurantId(e.target.value);
            setSelectedCategoryId('');
            setCategories([]);
            setFoodItems([]);
            setAllFoodItems([]);
          }}
        >
          <option value="">-- Select Restaurant --</option>
          {restaurants.map((restaurant) => (
            <option key={restaurant.restaurantId} value={restaurant.restaurantId}>
              {restaurant.restaurantName}
            </option>
          ))}
        </select>
      </div>

      {/* Category Dropdown */}
      {selectedRestaurantId && categories.length > 0 && (
        <div className="dropdown">
          <label htmlFor="category">Select Category:</label>
          <select
            id="category"
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setFoodItems([]);
            }}
          >
            <option value="">-- Select Category --</option>
            {categories.map((category) => (
              <option key={category.foodCategoryId} value={category.foodCategoryId}>
                {category.foodCategoryName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Fetch All Food Items Button */}
      {selectedRestaurantId && (
        <div className="fetch-food-items">
          <button onClick={fetchAllFoodItemsByRestaurant}>View All Food Items by Restaurant</button>
        </div>
      )}

      {/* Display All Food Items for Restaurant */}
      {allFoodItems.length > 0 && (
        <div className="all-food-items-list">
          <h3>All Food Items for Selected Restaurant</h3>
          <ul>
            {allFoodItems.map((item) => (
              <li key={item.foodItemId}>
                <img
                  src={fetchFoodItemImage(item.foodItemId)}
                  alt={item.foodItemName}
                  className="food-item-image"
                />
                <strong>{item.foodItemName}</strong> - {item.description} - Rs{item.price}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Food Items List for Selected Category */}
      {selectedCategoryId && (
        <div className="food-items-list">
          <h3>Food Items for Selected Category</h3>
          {foodItems.length > 0 ? (
            <ul>
              {foodItems.map((item) => (
                <li key={item.foodItemId}>
                  <img
                    src={fetchFoodItemImage(item.foodItemId)}
                    alt={item.foodItemName}
                    className="food-item-image"
                  />
                  <strong>{item.foodItemName}</strong> - {item.description} - Rs{item.price}
                </li>
              ))}
            </ul>
          ) : (
            <p>No food items available for this category.</p>
          )}
        </div>
      )}

      {/* Add Food Item Form */}
      {selectedCategoryId && (
        <div className="add-food-item">
          <h3>Add New Food Item</h3>
          <form onSubmit={handleAddFoodItem}>
            <div>
              <label>Food Item Name:</label>
              <input
                type="text"
                name="foodItemName"
                value={newFoodItem.foodItemName}
                onChange={handleFoodItemChange}
                required
              />
            </div>
            <div>
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newFoodItem.description}
                onChange={handleFoodItemChange}
                required
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={newFoodItem.price}
                onChange={handleFoodItemChange}
                required
              />
            </div>
            <div>
              <label>Available:</label>
              <input
                type="checkbox"
                name="isAvailable"
                checked={newFoodItem.isAvailable}
                onChange={(e) =>
                  setNewFoodItem((prev) => ({ ...prev, isAvailable: e.target.checked }))
                }
              />
            </div>
            <div>
              <label>Food Item Image:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} required />
            </div>
            <button type="submit">Add Food Item</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewFoodItem;
