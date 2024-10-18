import React, { useState } from 'react';
import axios from 'axios';
import './AddRestaurant.css'; 
import { toast, ToastContainer } from 'react-toastify';

const AddRestaurant = () => {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const userId = localStorage.getItem('userId');

  const handleFileChange = (event) => {
    setRestaurantImage(event.target.files[0]);
  };

  const validateForm = () => { 
    const errors = {};

    const trimmedRestaurantName = restaurantName.trim();
    const trimmedRestaurantAddress = restaurantAddress.trim();
    const trimmedContactNumber = contactNumber.trim();
    const trimmedDescription = description.trim();

    if (!trimmedRestaurantName.match(/^(?=.*[A-Za-z].*[A-Za-z])[A-Za-z0-9\s]+$/) || trimmedRestaurantName.length === 0) {
      errors.restaurantName = 'Restaurant name must contain at least two alphabets and can include numbers';
    }

    if (trimmedRestaurantAddress.length === 0) {
      errors.restaurantAddress = 'Address cannot be blank';
    }

    if (!trimmedContactNumber.match(/^[9876]\d{9}$/)) {
      errors.contactNumber = 'Phone number must start with 9, 8, 7, or 6 and contain 10 digits';
    }

    if (trimmedDescription.length === 0) {
      errors.description = 'Description cannot be blank';
    } else if (trimmedDescription.length > 255) {
      errors.description = 'Description cannot exceed 255 characters';
    }

    if (!restaurantImage) {
      errors.restaurantImage = 'Restaurant image is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('restaurantName', restaurantName.trim());
    formData.append('restaurantAddress', restaurantAddress.trim());
    formData.append('contactNumber', contactNumber.trim());
    formData.append('description', description.trim());
    formData.append('isOpen', isOpen);
    formData.append('restaurantImage', restaurantImage);

    axios.post('http://localhost:300/restaurant/addRestaurant', formData)
      .then(response => {
        console.log('Restaurant added successfully', response.data);
        toast.success(response.data.message);
      })
      .catch(error => {
        const errorMessage = error.response && error.response.data && error.response.data.message 
        ? error.response.data.message 
        : 'An unexpected error occurred!';
  
      toast.error(errorMessage);
  
      console.error('There was an error adding the restaurant!', error);      });
  };

  return (
    <div className="add-restaurant-container">
      <h2>Add Restaurant</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="restaurantName">Restaurant Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="restaurantName"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            required
          />
          {errors.restaurantName && <span className="error">{errors.restaurantName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="restaurantAddress">Restaurant Address <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="restaurantAddress"
            value={restaurantAddress}
            onChange={(e) => setRestaurantAddress(e.target.value)}
            required
          />
          {errors.restaurantAddress && <span className="error">{errors.restaurantAddress}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="contactNumber">Contact Number <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            id="contactNumber"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
          {errors.contactNumber && <span className="error">{errors.contactNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description <span style={{ color: 'red' }}>*</span></label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="restaurantImage">Restaurant Image <span style={{ color: 'red' }}>*</span></label>
          <input
            type="file"
            id="restaurantImage"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          {errors.restaurantImage && <span className="error">{errors.restaurantImage}</span>}
        </div>

        <button type="submit">Add Restaurant</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddRestaurant;
