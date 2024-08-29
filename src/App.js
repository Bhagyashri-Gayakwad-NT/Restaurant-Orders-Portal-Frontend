import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/RegistrationPage';
import Login from './components/LoginPage';
// import UserDashboard from './UserDashboard';
// import RestaurantOwnerDashboard from './RestaurantOwnerDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/restaurant-dashboard" element={<RestaurantOwnerDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;