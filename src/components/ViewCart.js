import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './context/UserContext'; 
import Navbar from './Navbar';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ViewCart.css';

const ViewCart = () => {
  const { user } = useContext(UserContext); 
  const { restaurantId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false); 
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: '',
    pinCode: ''
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return; 

    const fetchCartItems = async () => {
      try {
        const cartResponse = await fetch(`http://localhost:200/cart/user/${user.id}/restaurant/${restaurantId}`);
        const cartData = await cartResponse.json();

        const cartItemsWithImages = await Promise.all(
          cartData.map(async (item) => {
            const imageResponse = await fetch(`http://localhost:300/foodItems/${item.foodItemId}/image`);
            const imageBlob = await imageResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            return { ...item, imageUrl }; 
          })
        );

        setCartItems(cartItemsWithImages);
      } catch (error) {
        console.error('Error fetching cart items or images:', error);
      }
    };

    fetchCartItems();
    
    loadAddress();
  }, [user, restaurantId]);
  const loadAddress = () => {
    fetch(`http://localhost:100/addresses/user/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
      })
      .catch((error) => console.error('Error fetching addresses:', error));
  }
  const validateAddress = () => {
    const newErrors = {};
    const { street, city, state, country, pinCode } = newAddress;

    if (!street) {
      newErrors.street = "Street is required";
    } else if (street.length < 4 || street.length > 100) {
      newErrors.street = "Street must be between 4 and 100 characters";
    }

    if (!city) {
      newErrors.city = "City is required";
    } else if (city.length < 3 || city.length > 50) {
      newErrors.city = "City must be between 3 and 50 characters";
    } else if (!/^[a-zA-Z]+$/.test(city)) {
      newErrors.city = "City must contain only alphabetic characters";
    }

    if (!state) {
      newErrors.state = "State is required";
    } else if (state.length < 2 || state.length > 50) {
      newErrors.state = "State must be between 2 and 50 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(state)) {
      newErrors.state = "State must contain only alphabetic characters";
    }

    if (!country) {
      newErrors.country = "Country is required";
    } else if (country.length > 50) {
      newErrors.country = "Country cannot be longer than 50 characters";
    } else if (!/^[a-zA-Z]+$/.test(country)) {
      newErrors.country = "Country must contain only alphabetic characters";
    }

    if (!pinCode) {
      newErrors.pinCode = "Pin code is required";
    } else if (!/^[0-9]{6}$/.test(pinCode)) {
      newErrors.pinCode = "Pin code must be exactly 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

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
  const handleRemoveItem = (cartId) => {
    fetch(`http://localhost:200/cart/${cartId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to remove item');
        }
        setCartItems((prevItems) => prevItems.filter((item) => item.cartId !== cartId));
        toast.success('Item removed successfully');
      })
      .catch((error) => {
        console.error('Error removing item:', error);
        toast.error('Error removing item');
      });
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      toast.error("Please log in to view your cart."); 
     setTimeout(()=> {
     },2000)
      return;
    }

    const orderData = {
      userId: user.id, 
      restaurantId,
      addressId: selectedAddressId,
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
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errData) => {
            throw new Error(errData.message || "Something went wrong");
          });
        }
        return response.json();
      })
      .then((data) => {
        setOrderPlaced(true);
        toast.success(data.message);
        setTimeout(() => {
          navigate("/UserDashboard");
        }, 2000);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleAddAddress = () => {
    if (!validateAddress()) return; 

    const addressData = {
      ...newAddress,
      userId: user.id
    };
    const response = fetch(`http://localhost:100/addresses/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    })
      .then((response) => response.json())
      .then((data) => {
        setAddresses((prevAddresses) => Array.isArray(prevAddresses) ? [...prevAddresses, data] : [data]);
    
        setShowAddAddressForm(false); 
        loadAddress(); 
        toast.success(data.successMessage); 
      })
      .catch((error) => {
        console.error('Error adding address:', error);
        toast.error(error.message); 
      });
    
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
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveItem(item.cartId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Your cart is empty</p>
            )}
          </div>

          {cartItems.length > 0 && (
            <>
              <div className="address-section">
                <h3>Select Delivery Address:</h3>
                {addresses.length > 0 ? (
                  <>
                    <select value={selectedAddressId} onChange={(e) => setSelectedAddressId(e.target.value)}>
                      {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {`${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.pinCode}`}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <p>No addresses available. Please add an address.</p>
                )}
              </div>

              
    {/* Add this block to display the total price */}
    <div className="total-price">
      <h3>Total Price: Rs. {calculateTotalPrice()}</h3>
    </div>

    <button onClick={handlePlaceOrder} className="place-order-button">
      Place Order
    </button>

              <div className="add-address">
                {showAddAddressForm ? (
                  <div>
                    <h3>Add New Address:</h3>

                    <label>
                      Street <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Street"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    />
                    {errors.street && <p className="error">{errors.street}</p>}

                    <label>
                      City <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    />
                    {errors.city && <p className="error">{errors.city}</p>}

                    <label>
                      State <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                    {errors.state && <p className="error">{errors.state}</p>}

                    <label>
                      Country <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                    />
                    {errors.country && <p className="error">{errors.country}</p>}

                    <label>
                      Pin Code <span style={{ color: 'red' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Pin Code"
                      value={newAddress.pinCode}
                      onChange={(e) => setNewAddress({ ...newAddress, pinCode: e.target.value })}
                    />
                    {errors.pinCode && <p className="error">{errors.pinCode}</p>}

                    <button onClick={handleAddAddress}>Add Address</button>
                    <button onClick={() => setShowAddAddressForm(false)} style={{ backgroundColor: 'red' }}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setShowAddAddressForm(true)}>Add New Address</button>
                )}
              </div>

              <button onClick={handlePlaceOrder} disabled={!selectedAddressId}>
                Place Order
              </button>
            </>
          )}
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default ViewCart;
