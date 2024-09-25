// src/components/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load the user from localStorage when the app starts
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUser({ id: storedUserId });
    }
  }, []);

  // Function to handle user login and store in context + localStorage
  const loginUser = (userData) => {
    localStorage.setItem('userId', userData.id);
    setUser(userData);
  };

  // Function to handle user logout
  const logoutUser = () => {
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
