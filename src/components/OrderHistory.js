import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellationStatus, setCancellationStatus] = useState({});
  const { userId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:200/orders/user/${userId}`);
        const ordersWithDetails = await Promise.all(
          response.data.map(async (order) => {
            const foodItemDetails = await Promise.all(
              order.cartItems.map(async (item) => {
                try {
                  const foodItemResponse = await axios.get(`http://localhost:300/foodItems/${item.foodItemId}`);
                  const imageUrl = `http://localhost:300/foodItems/${item.foodItemId}/image`;
                  return { ...foodItemResponse.data, imageUrl, quantity: item.quantity };
                } catch (error) {
                  return { ...item, name: 'Unknown Item', imageUrl: '', price: 0 };
                }
              })
            );
            return { ...order, foodItems: foodItemDetails };
          })
        );

        const initialCancellationStatus = {};
        ordersWithDetails.forEach(order => {
          const orderTime = new Date(order.placedTiming).getTime();
          const currentTime = new Date().getTime();
          const timeDifference = (currentTime - orderTime) / 1000;
          const canCancel = timeDifference <= 30 && order.orderStatus !== 'CANCELLED';
          initialCancellationStatus[order.orderId] = {
            canCancel,
            timeRemaining: canCancel ? Math.max(30 - timeDifference, 0) : 0
          };
        });

        setOrders(ordersWithDetails);
        setCancellationStatus(initialCancellationStatus);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const cancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:200/orders/cancel/${orderId}`);
      setCancellationStatus((prevStatus) => ({
        ...prevStatus,
        [orderId]: { canCancel: false, timeRemaining: 0 }
      }));
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, orderStatus: 'CANCELLED' } : order
        )
      );
      toast.success(response.data.message)
    } catch (error) {
      toast.error(error.response.data.message)
      console.error('Error cancelling order:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCancellationStatus((prevStatus) => {
        const updatedStatus = {};
        Object.keys(prevStatus).forEach((orderId) => {
          const { canCancel, timeRemaining } = prevStatus[orderId];
          if (canCancel && timeRemaining > 0) {
            updatedStatus[orderId] = {
              canCancel: timeRemaining > 1,
              timeRemaining: timeRemaining - 1
            };
          } else {
            updatedStatus[orderId] = { canCancel: false, timeRemaining: 0 };
          }
        });
        return updatedStatus;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orders]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="order-history">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => {
          const placedTime = new Date(order.placedTiming);
          return (
            <div key={order.orderId} className="order-card">
              <h3>Order </h3>
              <p>Date: {placedTime.toLocaleString()}</p>
              <p>Status: {order.orderStatus}</p>
              <p>Total Amount: Rs. {order.totalPrice.toFixed(2)}</p>
              <div className="food-items">
                {order.foodItems.map((item, index) => (
                  <div key={index} className="food-item">
                    <div>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="food-image" />}
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs. {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {cancellationStatus[order.orderId]?.canCancel && (
                <button onClick={() => cancelOrder(order.orderId)} className="cancel-order-button" style={{backgroundColor:'red'}}>
                  Cancel Order ({Math.ceil(cancellationStatus[order.orderId].timeRemaining)}s)
                </button>
              )}
            </div>
          );
        })
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderHistory;
