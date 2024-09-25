import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ContactUs.css';

const ContactUs = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({ subject: '', message: '' }); // New state for errors
  const navigate = useNavigate();

  const validateFields = () => {
    let valid = true;
    const newErrors = { subject: '', message: '' };

    if (!subject.trim()) {
      newErrors.subject = 'Subject is required.';
      valid = false;
    } else if (subject.length < 1 || subject.length > 100) {
      newErrors.subject = 'Subject must be between 1 and 100 characters.';
      valid = false;
    }

    if (!message.trim()) {
      newErrors.message = 'Text is required.';
      valid = false;
    } else if (message.length < 1 || message.length > 500) {
      newErrors.message = 'Text must be between 1 and 500 characters.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Resetting errors before validation
    setErrors({ subject: '', message: '' });

    // Validate fields before submission
    if (!validateFields()) {
      return; // Stop submission if validation fails
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Create JSON object instead of FormData
    const data = {
      subject: subject.trim(),
      text: message.trim(),
    };

    try {
      const response = await axios.post('http://localhost:100/users/send', data, {
        headers: {
          'Content-Type': 'application/json', // Set content type to JSON
        },
      });
      setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
      setSubject('');
      setMessage('');
    } catch (error) {
      // Handle error response
      if (error.response) {
        const { message } = error.response.data;
        setSubmitStatus({ type: 'error', message: message || 'Failed to send message. Please try again.' });
      } else {
        setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-us-container">
      <div className="contact-us-form">
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            {errors.subject && <div className="error-message">{errors.subject}</div>} {/* Error message */}
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows="4"
            ></textarea>
            {errors.message && <div className="error-message">{errors.message}</div>} {/* Error message */}
          </div>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        {submitStatus && (
          <div className={`status-message ${submitStatus.type}`}>
            {submitStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
