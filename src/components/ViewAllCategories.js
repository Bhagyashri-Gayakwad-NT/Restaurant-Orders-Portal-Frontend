import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAllCategories.css';
import { toast, ToastContainer } from 'react-toastify';

const ViewAllCategories = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [updatedCategoryName, setUpdatedCategoryName] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
        if (userId) {
            fetchRestaurants(userId);
        }
    }, []);

    useEffect(() => {
        if (selectedRestaurantId) {
            fetchCategories(selectedRestaurantId);
        }
    }, [selectedRestaurantId]);

    const fetchRestaurants = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:300/restaurant/restaurants/${userId}`);
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };
    
    const fetchCategories = async (restaurantId) => {
        try {
            const response = await axios.get(`http://localhost:300/categories/foodCategory/${restaurantId}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async () => {
        try {
            const response = await axios.post('http://localhost:300/categories/addFoodCategory', {
                restaurantId: selectedRestaurantId,
                foodCategoryName: newCategory
            });
            setCategories([...categories, response.data]);
            setNewCategory(''); // Clear the input field
            toast.success(response.data.message);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                // Loop through the errors object and display each error in Toastify
                Object.keys(errors).forEach((field) => {
                    toast.error(errors[field]);
                });
            } else {
                toast.error(error.response.data.message || 'Error adding category');
            }
            console.error('Error adding category:', error);
        }
    };
    
    const handleUpdateCategory = async (id, updatedCategory) => {
        try {
            const response = await axios.put(`http://localhost:300/categories/updateFoodCategory/${id}`, {
                restaurantId: selectedRestaurantId,
                foodCategoryName: updatedCategory.foodCategoryName,
            });
    
            // Update the categories array with the updated category data
            const updatedCategories = categories.map((category) =>
                category.foodCategoryId === id ? response.data : category
            );
            setCategories(updatedCategories);
    
            // Exit edit mode after updating
            setEditingCategoryId(null);
            toast.success("Category updated successfully!");
        } catch (error) {
            // Handle validation errors from the backend
            if (error.response && error.response.data && error.response.data.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach((field) => {
                    toast.error(errors[field]); // Display each validation error
                });
            } else {
                toast.error(error.response.data.message || 'Error updating category');
            }
            console.error('Error updating category:', error);
        }
    };
    

    const startEditing = (categoryId, categoryName) => {
        setEditingCategoryId(categoryId);
        setUpdatedCategoryName(categoryName);
    };

    const cancelEditing = () => {
        setEditingCategoryId(null);
        setUpdatedCategoryName('');
    };

    return (
        <div className="view-all-categories-container">
            <h2>Food Categories</h2>

            <div className="restaurant-dropdown">
                <label>Select Restaurant: </label>
                <select
                    value={selectedRestaurantId || ''}
                    onChange={(e) => setSelectedRestaurantId(e.target.value)}
                >
                    <option value="" disabled>Select a restaurant</option>
                    {restaurants.map((restaurant) => (
                        <option key={restaurant.restaurantId} value={restaurant.restaurantId}>
                            {restaurant.restaurantName}
                        </option>
                    ))}
                </select>
            </div>

            {selectedRestaurantId && (
                <>
                    <div className="add-category">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Add New Category"
                        />
                        <button onClick={handleAddCategory}>Add Category</button>
                    </div>
                    <div className="categories-list">
                        {categories.map((category) => (
                            <div key={category.foodCategoryId} className="category-card">
                                {editingCategoryId === category.foodCategoryId ? (
                                    <>
                                        <input
                                            type="text"
                                            value={updatedCategoryName}
                                            onChange={(e) => setUpdatedCategoryName(e.target.value)}
                                        />
                                        <button onClick={() => handleUpdateCategory(category.foodCategoryId, { foodCategoryName: updatedCategoryName })}>
                                            Save
                                        </button>
                                        <button onClick={cancelEditing}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <span>{category.foodCategoryName}</span>
                                        <button onClick={() => startEditing(category.foodCategoryId, category.foodCategoryName)}>Edit</button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
            <ToastContainer />
        </div>
    );
};

export default ViewAllCategories;
