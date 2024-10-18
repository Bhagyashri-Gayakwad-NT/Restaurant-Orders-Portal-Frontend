import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewFoodItem.css';
import { toast, ToastContainer } from 'react-toastify';

const ViewFoodItem = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [allFoodItems, setAllFoodItems] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddFoodItemForm, setShowAddFoodItemForm] = useState(false);
  const [showCategoryNotFound,setShowCategoryNotFound] = useState(true);
  const [editErrors, setEditErrors] = useState({});

  const [render, setRender] = useState(false);
  const toggleRender = () => setRender(prev => !prev);


  const [newFoodItem, setNewFoodItem] = useState({
    foodItemName: '',
    description: '',
    price: '',
    //isAvailable: false,
    foodItemImage: null,
  });
  const [editingFoodItem, setEditingFoodItem] = useState(null);
  const [updatedFoodItem, setUpdatedFoodItem] = useState({
    foodItemName: '',
    description: '',
    price: '',
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
          console.error('Error fetching restaurants!', error);
          setError('Failed to load restaurants.');
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
          console.error('Error fetching categories!', error);
          setError('Failed to load categories.');
          setLoading(false);
        });
    }
  }, [selectedRestaurantId]);

  // Fetch food items based on selected category ID
  useEffect(() => {
    setShowCategoryNotFound(true);
    if (selectedCategoryId) {
      if(allFoodItems.length>0){
        setAllFoodItems([]);
      }
      setLoading(true);
      axios
        .get(`http://localhost:300/foodItems/getFoodItem/${selectedCategoryId}`)
        .then((response) => {
          setFoodItems(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching food items!', error);
          setError('Failed to load food items.');
          setLoading(false);
        });
    }
  }, [selectedCategoryId]);

  const loadFoodItems = () => {
    setLoading(true);
    axios
      .get(`http://localhost:300/foodItems/getFoodItem/${selectedCategoryId}`)
      .then((response) => {
        setFoodItems(response.data);

        console.log(response.data);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching food items!', error);
        setError('Failed to load food items.');
        setLoading(false);
      });
  }

  // Fetch all food items based on restaurant ID
  const fetchAllFoodItemsByRestaurant = () => {
    console.log('Function called');
    setShowCategoryNotFound(false);
    if(foodItems.length>0){
      setFoodItems([]);
      setSelectedCategoryId("");
    }
    if (selectedRestaurantId) {
      setLoading(true);
      axios
        .get(`http://localhost:300/foodItems/getFoodItems/${selectedRestaurantId}`)
        .then((response) => {
          setAllFoodItems(response.data);
          //setFoodItems(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching all food items!', error);
          toast.error(error.response.data.message);
          //setError('Failed to load all food items.');
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

    if (!validateAddFoodItem)
      return;
    setNewFoodItem((prev) => ({
      ...prev,
      foodItemImage: e.target.files[0],
    }));
  };

  const validateEditFoodItem = () => {
    const newErrors = {};
    const { foodItemName, description, price, } = updatedFoodItem;
    const alphabetRegex = /^[A-Za-z\s]+$/;
    const trimmedFoodItemName = foodItemName.trim();
    const trimmedDescription = description.trim();


    // Validate foodItemName
    if (!trimmedFoodItemName) {
      newErrors.trimmedFoodItemName = "Food item name is required";
    } else if (!alphabetRegex.test(updatedFoodItem.trimmedFoodItemName)) {
      newErrors.trimmedFoodItemName = "Food item name should only contain alphabets";
    }

    // Validate description
    if (!trimmedDescription) {
      newErrors.trimmedDescription = "Description is required";
    }

    // Validate price
    if (!price) {
      newErrors.price = "Price is required";
    } else if (isNaN(updatedFoodItem.price) || updatedFoodItem.price <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    // if(!newFoodItem.isAvailable){
    //   newErrors.isAvailable = "Please tick the checkbox";
    // }

    // if (!updatedFoodItem.foodItemImage) {
    //   newErrors.foodItemImage = "Please upload image";
    // }
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const validateAddFoodItem = () => {
    const newErrors = {};
    const { foodItemName, description, price, } = newFoodItem;
    const alphabetRegex = /^[A-Za-z\s]+$/;
    const trimmedFoodItemName = foodItemName.trim();
    const trimmedDescription = description.trim();

    // Validate foodItemName
    if (!trimmedFoodItemName) {
      newErrors.trimmedFoodItemName = "Food item name is required";
    } else if (!alphabetRegex.test(trimmedFoodItemName)) {
      newErrors.trimmedFoodItemName = "Food item name must contain only alphabets and cannot include numbers";
  }

    // Validate description
    if (!trimmedDescription) {
      newErrors.trimmedDescription = "Description is required";
    }

    // Validate price
    if (!price) {
      newErrors.price = "Price is required";
    } else if (isNaN(newFoodItem.price) || newFoodItem.price <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    // if(!newFoodItem.isAvailable){
    //   newErrors.isAvailable = "Please tick the checkbox";
    // }

    if (!newFoodItem.foodItemImage) {
      newErrors.foodItemImage = "Please upload image";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If there are no errors, return true
  };

  const handleAddFoodItem = (e) => {
    e.preventDefault();

    // Run validation and if it fails, return early
    if (!validateAddFoodItem()) {
      return;
    }

    // Proceed with form submission only if validation passes
    const formData = new FormData();
    formData.append('foodItemName', newFoodItem.foodItemName.trim());
    formData.append('description', newFoodItem.description.trim());
    formData.append('price', newFoodItem.price);
    //formData.append('isAvailable', newFoodItem.isAvailable);
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
          //isAvailable: false,
          foodItemImage: null,
        });
        fetchAllFoodItemsByRestaurant();
        setError(null);
        setShowAddFoodItemForm(false); // Hide form after adding food item
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log(error)
        const errors = error.response.data.message;
        // Object.keys(errors).forEach((field) => {
        //   toast.error(errors[field]);
        // });
      toast.error(errors);
       // console.error('Error adding food item!', error);
        setError('Failed to add food item.');
      });
  };

  const handleEditFoodItem = (foodItem) => {
    console.log("edit modal opened");
    if (!validateAddFoodItem)
      return;
    setEditingFoodItem(foodItem);
    setUpdatedFoodItem({
      foodItemName: foodItem.foodItemName,
      description: foodItem.description,
      price: foodItem.price,
      foodItemImage: null,
    });
  };

  const handleUpdateFoodItemChange = (e) => {
    // if(!validateAddFoodItem)
    // return;
    setEditErrors({})
    const { name, value } = e.target;
    setUpdatedFoodItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateImageChange = (e) => {
    setUpdatedFoodItem((prev) => ({
      ...prev,
      foodItemImage: e.target.files[0],
    }));
  };

  const handleUpdateFoodItem = (e) => {

    e.preventDefault();

    if (!validateEditFoodItem()) {
      return;
    }

    const formData = new FormData();
    formData.append('foodItemName', updatedFoodItem.foodItemName.trim());
    formData.append('description', updatedFoodItem.description.trim());
    formData.append('price', updatedFoodItem.price);
    if (updatedFoodItem.foodItemImage) {
      formData.append('foodItemImage', updatedFoodItem.foodItemImage);
    }

    axios
      .put(`http://localhost:300/foodItems/updateFoodItem/${editingFoodItem.foodItemId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response);
        
        const updatedFoodItems = foodItems.map((item) =>
          item.foodItemId === editingFoodItem.foodItemId ? { ...item, ...updatedFoodItem } : item
        );
        setFoodItems(updatedFoodItems);
        
        setEditingFoodItem(null);
        setError(null);

        // loadFoodItems();

        
        toggleRender();
        //console.log('Before calling function');
        fetchAllFoodItemsByRestaurant();
       // console.log('After calling function');

        toast.success(response.data.message)
      })
     
      .catch((error) => {
        const errors = error.response?.data?.errors || 'Failed to update food item.';
        toast.error(errors);
    });
  };

  
  const fetchFoodItemImage = (id) => {
    console.log('image', id);
    
    return `http://localhost:300/foodItems/${id}/image`; // Image URL for food items
  };



  return (
    <div className="view-food-item-container">
      <h2>View and Add Food Items</h2>

      {loading && <p>Loading...</p>}

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

      {/* No Categories Message */}
      {selectedRestaurantId && categories.length === 0 && !loading && (
        <p>No categories available for the selected restaurant.</p>
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
        {showCategoryNotFound && <h3>Food Items for Selected Category</h3>}
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
                  <button onClick={() => handleEditFoodItem(item)}>Edit Food Item</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>
            {showCategoryNotFound && "No food items available for this category."}
            </p>
          )}
        </div>
      )}

      {/* Toggle Button for Add Food Item Form */}
      {selectedCategoryId && (
        <div className={`toggle-add-food-item`}>
          <button className={`${showAddFoodItemForm ? "red-bg" : ""}`} onClick={() => setShowAddFoodItemForm((prev) => !prev)}>
            {showAddFoodItemForm ? 'Cancel Adding Food Item' : 'Add Food Item'}
          </button>
        </div>
      )}

      {/* Add Food Item Form */}
      {showAddFoodItemForm && selectedCategoryId && (
        <div className="add-food-item">
          <h3>Add New Food Item</h3>
          <form onSubmit={handleAddFoodItem}>
            <div>
              <label>
                Food Item Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="foodItemName"
                value={newFoodItem.foodItemName}
                onChange={handleFoodItemChange}

              />
              {errors.trimmedFoodItemName && <p className="error">{errors.trimmedFoodItemName}</p>}
            </div>

            <div>
              <label>
                Description <span style={{ color: 'red' }}>*</span>
              </label>
              <textarea
                name="description"
                value={newFoodItem.description}
                onChange={handleFoodItemChange}

              ></textarea>
              {errors.trimmedDescription && <p className="error">{errors.trimmedDescription}</p>}
            </div>

            <div>
              <label>
                Price <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                name="price"
                value={newFoodItem.price}
                onChange={handleFoodItemChange}

              />
              {errors.price && <p className="error">{errors.price}</p>}
            </div>

            <div>
              <label>
                Upload Food Item Image <span style={{ color: 'red' }}>*</span>
              </label>
              <input type="file" name="foodItemImage" onChange={handleImageChange} />
              {errors.foodItemImage && <p className="error">{errors.foodItemImage}</p>}
            </div>

            <div>
              <button type="submit">Add Food Item</button>
            </div>
          </form>
        </div>
      )}
      {editingFoodItem && (
        <div className="edit-food-item">
          <h3>Edit Food Item</h3>
          <form onSubmit={handleUpdateFoodItem}>
            <div>
              <label>Food Item Name <span style={{ color: 'red' }}>*</span> </label>
              <input
                type="text"
                name="foodItemName"
                value={updatedFoodItem.foodItemName}
                onChange={handleUpdateFoodItemChange}
              />
              {editErrors.trimmedFoodItemName && <p className="error">{editErrors.trimmedFoodItemName}</p>}
            </div>
            <div>
              <label>Description <span style={{ color: 'red' }}>*</span> </label>
              <textarea
                name="description"
                value={updatedFoodItem.description}
                onChange={handleUpdateFoodItemChange}

              ></textarea>
              {editErrors.trimmedDescription && <p className="error">{editErrors.trimmedDescription}</p>}
            </div>
            <div>
              <label>Price <span style={{ color: 'red' }}>*</span> </label>
              <input
                type="number"
                name="price"
                value={updatedFoodItem.price}
                onChange={handleUpdateFoodItemChange}
              />
              {editErrors.price && <p className="error">{editErrors.price}</p>}
            </div>
            <div>
              <label>Upload New Food Item Image (optional):</label>
              <input type="file" name="foodItemImage" onChange={handleUpdateImageChange} />
            </div>
            <div>
              <button type="submit">Update Food Item</button>
              <button type="button" onClick={() => setEditingFoodItem(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewFoodItem;