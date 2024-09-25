import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/RegistrationPage';
import Login from './components/LoginPage';
import UserDashboard from './components/UserDashboard';
import RestaurantOwnerDashboard from './components/RestaurantOwnerDashboard';
import AddRestaurant from './components/AddRestaurant';
import ViewAllRestaurants from './components/ViewAllRestaurants';
import ViewAllCategories from './components/ViewAllCategories';
import ViewFoodItem from './components/ViewFoodItem';
import RestaurantDetails from './components/RestaurantDetails';
import ViewCart from './components/ViewCart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/RestaurantOwnerDashboard" element={<RestaurantOwnerDashboard />} />
        <Route path="/addRestaurant" element={<AddRestaurant />} />
        <Route path="/viewAllRestaurants" element={<ViewAllRestaurants />} />
        <Route path="/ViewAllCategories" element={<ViewAllCategories />} />
        <Route path="/ViewFoodItem" element={<ViewFoodItem />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantDetails />} />
        <Route path="/cart/user/:userId/restaurant/:restaurantId" element={<ViewCart />} />
      </Routes>
    </Router>
  );
}

export default App;
