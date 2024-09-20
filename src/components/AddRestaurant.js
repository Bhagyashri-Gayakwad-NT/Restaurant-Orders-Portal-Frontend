import React, { useState } from 'react';
import axios from 'axios';
import './AddRestaurant.css'; // Optional: You can add styles in this file

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

    // Validate restaurant name (only alphabets and spaces)
    if (!restaurantName.match(/^[A-Za-z]+(?:\s[A-Za-z]+)*$/)) {
      errors.restaurantName = 'Restaurant name must contain only alphabets';
    }

    // Validate address (no leading or trailing spaces)
    if (!restaurantAddress.match(/^(?!\s)(?!.*\s$).+/)) {
      errors.restaurantAddress = 'Address cannot contain leading or trailing spaces';
    }

    // Validate contact number (starts with 9, 8, 7, or 6 and is 10 digits long)
    if (!contactNumber.match(/^[9876]\d{9}$/)) {
      errors.contactNumber = 'Phone number must start with 9, 8, 7, or 6 and contain 10 digits';
    }

    // Validate description (max 255 characters, no leading or trailing spaces)
    if (!description.match(/^(?!\s)(?!.*\s$).+/)) {
      errors.description = 'Description cannot contain leading or trailing spaces';
    }
    if (description.length > 255) {
      errors.description = 'Description cannot exceed 255 characters';
    }

    // Validate restaurant image (must be selected)
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
    formData.append('restaurantName', restaurantName);
    formData.append('restaurantAddress', restaurantAddress);
    formData.append('contactNumber', contactNumber);
    formData.append('description', description);
    formData.append('isOpen', isOpen);
    formData.append('restaurantImage', restaurantImage);

    axios.post('http://localhost:3000/restaurant/addRestaurant', formData)
      .then(response => {
        console.log('Restaurant added successfully', response.data);
        // Handle success (e.g., navigate to a different page or show a success message)
      })
      .catch(error => {
        console.error('There was an error adding the restaurant!', error);
      });
  };

  return (
    <div className="add-restaurant-container">
      <h2>Add Restaurant</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="restaurantName">Restaurant Name:</label>
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
          <label htmlFor="restaurantAddress">Restaurant Address:</label>
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
          <label htmlFor="contactNumber">Contact Number:</label>
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
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="isOpen">Is Open:</label>
          <input
            type="checkbox"
            id="isOpen"
            checked={isOpen}
            onChange={(e) => setIsOpen(e.target.checked)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="restaurantImage">Restaurant Image:</label>
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
    </div>
  );
};

export default AddRestaurant;
