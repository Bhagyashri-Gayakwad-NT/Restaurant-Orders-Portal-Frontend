import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewOrders.css'; // Import the CSS file
import { toast, ToastContainer } from 'react-toastify';

const ViewOrders = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`http://localhost:300/restaurant/restaurants/${userId}`)
      .then(response => setRestaurants(response.data))
      .catch(error => console.error("Error fetching restaurants", error));
  }, [userId]);
  const fetchOrders = async (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
    try {
      const orderResponse = await axios.get(`http://localhost:200/orders/restaurant/${restaurantId}`);
      const ordersWithDetails = await Promise.all(
        orderResponse.data.map(async (order) => {
          const foodItemDetails = await Promise.all(
            order.cartItems.map(async (item) => {
              try {
                const foodItemResponse = await axios.get(`http://localhost:300/foodItems/${item.foodItemId}`);
                const imageUrl = `http://localhost:300/foodItems/${item.foodItemId}/image`;
                return { ...foodItemResponse.data, imageUrl, quantity: item.quantity, price: item.price };
              } catch (error) {
                return { ...item, name: 'Unknown Item', imageUrl: '', price: item.price };
              }
            })
          );
          return { ...order, foodItems: foodItemDetails };
        })
      );
      setOrders(ordersWithDetails);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };
  const markOrderComplete = async (orderId) => {
    try {
      const response = await axios.post(`http://localhost:200/orders/complete/${orderId}/user/${userId}`);
      fetchOrders(selectedRestaurantId); // Refresh orders after marking one as complete
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      console.error("Error completing order", error);
    }
  };
  return (
    <div style={{ padding: '20px' }}>
      <h2>View Orders</h2>
      <h3>Select a Restaurant</h3>
      <ul>
        {restaurants.map(restaurant => (
          <li key={restaurant.restaurantId}>
            <button onClick={() => fetchOrders(restaurant.restaurantId)} style={{ margin: '10px', padding: '10px' }}>
              {restaurant.restaurantName}
            </button>
          </li>
        ))}
      </ul>
      {orders.length > 0 && (
        <>
          <h3>Orders for Restaurant</h3>
          {orders.map(order => {
            const orderDate = new Date(order.orderDate); // Ensure proper date conversion
            return (
              <div key={order.orderId} className="order-container">
                <div className="order-header">
                  <p>Status: {order.orderStatus}</p>
                </div>
                <p>Total Amount: Rs. {order.totalPrice.toFixed(2)}</p>
                <div className="food-items-container">
                  {order.foodItems.map(item => (
                    <div key={item.foodItemId} className="food-item">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="food-image"
                      />
                      <div className="food-details">
                        <p>{item.name}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price Per Item: Rs. {item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Hide button if order status is COMPLETED or CANCELLED */}
                {order.orderStatus !== 'COMPLETED' && order.orderStatus !== 'CANCELLED' && (
                  <button
                    onClick={() => markOrderComplete(order.orderId)}
                    className="complete-button"
                  >
                    Complete Order
                  </button>
                )}
              </div>
            );
          })}
        </>
      )}
      <ToastContainer />

    </div>
  );
};
export default ViewOrders;