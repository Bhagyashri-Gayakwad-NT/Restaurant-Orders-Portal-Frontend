import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [role, setRole] = useState('USER');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFirstName = (firstName) => {
    const re = /^[A-Z][a-zA-Z]{2,}$/;
    return re.test(firstName);
  };

  const validateLastName = (lastName) => {
    const re = /^[A-Z][a-zA-Z]{2,}$/;
    return re.test(lastName);
  };

  const validateEmail = (email) => {
    const re = /^[A-Za-z0-9._%+-]+@nucleusteq\.com$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/;
    return re.test(password);
  };

  const validatePhoneNumber = (phoneNo) => {
    const re = /^[9876]\d{9}$/;
    return re.test(phoneNo);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!firstName) {
      validationErrors.firstName = 'First name is required.';
    } else if (!validateFirstName(firstName)) {
      validationErrors.firstName = 'Name must start with a capital letter and be at least three characters long.';
    }

    if (!lastName) {
      validationErrors.lastName = 'Last name is required.';
    } else if (!validateLastName(lastName)) {
      validationErrors.lastName = 'Name must start with a capital letter and be at least three characters long.';
    }

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

    if (!phoneNo) {
      validationErrors.phoneNo = 'Phone number is required.';
    } else if (!validatePhoneNumber(phoneNo)) {
      validationErrors.phoneNo = 'Phone number must start with 9, 8, 7, or 6 and contain 10 digits.';
    }

    setErrors(validationErrors);

    // Encode password
    const encodedPassword = btoa(password);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch('http://localhost:100/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ firstName, lastName, email, password: encodedPassword, phoneNo, role }),
        });

        const data = await response.json();
        if (response.ok) {
        navigate('/login');
        } else {
          setErrors({ form: data.message || 'Registration failed' });
        }
        
      } catch (error) {
        setErrors({ form: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {errors.form && <p className="error">{errors.form}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            value={phoneNo}
            onChange={(e) => setPhoneNo(e.target.value)}
          />
          {errors.phoneNo && <p className="error">{errors.phoneNo}</p>}
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="RESTAURANT_OWNER">Restaurant Owner</option>
          </select>
        </div>
        <button type="submit" className="btn-submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
