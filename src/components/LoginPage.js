import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './context/UserContext';  // Import the UserContext
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const { loginUser } = useContext(UserContext);  // Get loginUser from the context

  const validateEmail = (email) => {
    const re = /^[A-Za-z0-9._%+-]+@nucleusteq\.com$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/;
    return re.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!email) {
      validationErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Email must end with @nucleusteq.com.';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (!validatePassword(password)) {
      validationErrors.password = 'Password must be at least 6 characters long and include at least one uppercase letter, one digit, and one special character.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    // Encode password
    const encodedPassword = btoa(password);

    try {
      const response = await axios.post('http://localhost:100/users/login', {
        email,
        password: encodedPassword,
      });

      const data = response.data;

      // Use loginUser to store the user in context and localStorage
      loginUser(data);

      // Redirect based on role
      navigate(data.role === 'USER' ? '/UserDashboard' : '/RestaurantOwnerDashboard');
    } catch (error) {
      setError({ server: error.response?.data?.message || 'An error occurred. Please try again.' });
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error.server && <p className="error">{error.server}</p>}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && <p className="error">{error.email}</p>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && <p className="error">{error.password}</p>}
        </div>
        <button type="submit" className="btn-submit">Login</button>
      </form>
      <p>
        If new user, then <Link to="/register">register here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;
