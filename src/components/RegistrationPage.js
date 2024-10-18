import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [role, setRole] = useState('USER');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateFirstName = (firstName) => {
    const re = /^[A-Z][a-zA-Z]*$/;
    return re.test(firstName);
  };

  const validateLastName = (lastName) => {
    const re = /^[A-Z][a-zA-Z]*$/;
    return re.test(lastName);
  };

  const validateEmail = (email) => {
    const re = /^[A-Za-z0-9._%+-]+@nucleusteq\.com$/;
    return re.test(email.trim());
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
      validationErrors.firstName = 'First name must start with a capital letter.';
    }

    if (!lastName) {
      validationErrors.lastName = 'Last name is required.';
    } else if (!validateLastName(lastName)) {
      validationErrors.lastName = 'Last name must start with a capital letter.';
    }

    if (!email) {
      validationErrors.email = 'Email is required.';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Email must end with @nucleusteq.com and contain no spaces.';
    }

    if (!password) {
      validationErrors.password = 'Password is required.';
    } else if (!validatePassword(password)) {
      validationErrors.password = 'Password must be at least 6 characters long and include at least one uppercase letter, one digit, and one special character.';
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
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
        const response = await axios.post('http://localhost:100/users/register', {
          firstName,
          lastName,
          email: email.trim(),
          password: encodedPassword,
          phoneNo,
          role,
        });

        if (response.status === 201) {
          navigate('/login');
        } else {
          setErrors({ form: response.data.message || 'Registration failed xyz' });
        }
      } catch (error) {
        console.error(error.response.data.message)
        setErrors({form: error.response.data.message});
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {errors.form && <p className="error">{errors.form}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>First Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div className="form-group">
          <label>Last Name <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div className="form-group">
          <label>Email <span style={{ color: 'red' }}>*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Password <span style={{ color: 'red' }}>*</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label>Confirm Password <span style={{ color: 'red' }}>*</span></label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <div className="form-group">
          <label>Phone Number <span style={{ color: 'red' }}>*</span></label>
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
