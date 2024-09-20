import React, { useState } from 'react';
import axios from 'axios';

const PlaceOrder = () => {
  // State to hold form data
  const [orderData, setOrderData] = useState({
    userId: '',
    restaurantId: '',
    addressId: '',
    cartItems: [{ foodItemId: '', quantity: '', price: '' }],
  });

  // State for managing success or error response
  const [message, setMessage] = useState('');

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({ ...orderData, [name]: value });
  };

  // Handle Cart Item input changes
  const handleCartItemChange = (index, e) => {
    const { name, value } = e.target;
    const cartItems = [...orderData.cartItems];
    cartItems[index] = { ...cartItems[index], [name]: value };
    setOrderData({ ...orderData, cartItems });
  };

  // Add new cart item
  const addCartItem = () => {
    setOrderData({
      ...orderData,
      cartItems: [...orderData.cartItems, { foodItemId: '', quantity: '', price: '' }],
    });
  };

  // Remove cart item
  const removeCartItem = (index) => {
    const cartItems = [...orderData.cartItems];
    cartItems.splice(index, 1);
    setOrderData({ ...orderData, cartItems });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/orders/place', orderData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage(response.data.message); // Assuming response contains a 'message' field
    } catch (error) {
      setMessage('Error placing the order. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Place Order</h2>
      <form onSubmit={handleSubmit}>
        <label>
          User ID:
          <input
            type="number"
            name="userId"
            value={orderData.userId}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Restaurant ID:
          <input
            type="number"
            name="restaurantId"
            value={orderData.restaurantId}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Address ID:
          <input
            type="number"
            name="addressId"
            value={orderData.addressId}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <h3>Cart Items</h3>
        {orderData.cartItems.map((item, index) => (
          <div key={index}>
            <label>
              Food Item ID:
              <input
                type="number"
                name="foodItemId"
                value={item.foodItemId}
                onChange={(e) => handleCartItemChange(index, e)}
                required
              />
            </label>
            <br />
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={item.quantity}
                onChange={(e) => handleCartItemChange(index, e)}
                required
              />
            </label>
            <br />
            <label>
              Price:
              <input
                type="number"
                name="price"
                step="0.01"
                value={item.price}
                onChange={(e) => handleCartItemChange(index, e)}
                required
              />
            </label>
            <br />
            <button type="button" onClick={() => removeCartItem(index)}>
              Remove Item
            </button>
            <hr />
          </div>
        ))}
        <button type="button" onClick={addCartItem}>
          Add Another Item
        </button>
        <br />
        <button type="submit">Place Order</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PlaceOrder;
