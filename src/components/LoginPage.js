import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => /^[A-Za-z0-9._%+-]+@nucleusteq\.com$/.test(email);


  const handleLogin = async (e) => {
    e.preventDefault();
    const errors = {};

  
    if (!validateEmail(email)) {
      errors.email = 'Email is required and must end with @nucleusteq.com';
    }

    if (password.length<=0) {
      errors.password = 'Enter valid password';
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    // const encodepassword = btoa(password);
    password = btoa(password)

    try {
      const response = await fetch('http://localhost:100/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate(data.role === 'USER' ? '/UserDashboard' : '/RestaurantOwnerDashboard');
      } else {
        setError({ server: data.message || 'Login failed' });
      }
    } catch (error) {
      setError({ server: 'An error occurred. Please try again.' });
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
