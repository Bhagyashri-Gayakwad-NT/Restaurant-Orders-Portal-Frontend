import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './ViewCart.css';

const ViewCart = () => {
  const { userId, restaurantId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addresses, setAddresses] = useState([]); // Add state for addresses
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Track selected address

  useEffect(() => {
    // Fetch cart items by userId and restaurantId
    fetch(`http://localhost:200/cart/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data);
        // Fetch images for each food item
        data.forEach(item => {
          fetch(`http://localhost:300/foodItems/${item.foodItemId}/image`)
            .then((response) => response.blob())
            .then((blob) => {
              const imageUrl = URL.createObjectURL(blob);
              setCartItems(prevItems =>
                prevItems.map((prevItem) =>
                  prevItem.cartId === item.cartId ? { ...prevItem, imageUrl } : prevItem
                )
              );
            });
        });
      })
      .catch((error) => console.error('Error fetching cart items:', error));

    // Fetch user addresses
    fetch(`http://localhost:100/address/user/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId(data[0].id); // Set default address as the first one
        }
      })
      .catch((error) => console.error('Error fetching addresses:', error));
  }, [userId, restaurantId]);

  const handleQuantityChange = (cartId, quantityChange) => {
    fetch(`http://localhost:200/cart/update/${cartId}?quantityChange=${quantityChange}`, {
      method: 'PUT',
    })
      .then((response) => response.json())
      .then((data) => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cartId === cartId ? { ...item, quantity: item.quantity + quantityChange } : item
          )
        );
      })
      .catch((error) => console.error('Error updating cart quantity:', error));
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    const orderData = {
      userId,
      restaurantId,
      addressId: selectedAddressId, // Include addressId
      cartItems: cartItems.map((item) => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    fetch(`http://localhost:200/orders/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Order placed:', data);
        setOrderPlaced(true);
      })
      .catch((error) => console.error('Error placing order:', error));
  };

  return (
    <div className="view-cart">
      <Navbar />
      <h2>Your Cart</h2>
      {orderPlaced ? (
        <p>Order placed successfully!</p>
      ) : (
        <>
          <div className="cart-container">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.cartId} className="cart-card">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.foodItemName} className="food-image" />}
                  <div className="cart-details">
                    <h4>{item.foodItemName}</h4>
                    <p>Price: Rs. {item.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleQuantityChange(item.cartId, -1)} disabled={item.quantity <= 1}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.cartId, 1)}>+</button>
                    </div>
                    <p>Total: Rs. {item.price * item.quantity}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>

          {cartItems.length > 0 && (
            <>
              {/* Select Address Section */}
              <div className="address-section">
                <h3>Select Delivery Address:</h3>
                <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
                  {addresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.street}, {address.city}, {address.pinCode}
                    </option>
                  ))}
                </select>
              </div>

              {/* Place Order Button */}
              <div className="place-order-section">
                <button onClick={handlePlaceOrder} className="place-order-button">
                  Place Order
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ViewCart;
