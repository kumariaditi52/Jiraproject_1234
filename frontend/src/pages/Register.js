import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Inline styles
  const styles = {
    registerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f5f7'
    },
    formContainer: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '5px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px'
    },
    title: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#0052cc'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '3px',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#0052cc',
      color: 'white',
      border: 'none',
      borderRadius: '3px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '1rem'
    },
    loginLink: {
      textAlign: 'center',
      marginTop: '1rem'
    },
    errorMessage: {
      backgroundColor: '#ffebe6',
      color: '#de350b',
      padding: '0.5rem',
      borderRadius: '3px',
      marginBottom: '1rem'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password
      });
      
      // Redirect to login page after successful registration
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={styles.registerContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Register for Jira</h2>
        {error && <div style={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Name</label>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              minLength="6"
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              minLength="6"
            />
          </div>
          <button type="submit" style={styles.button}>Register</button>
        </form>
        <div style={styles.loginLink}>
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
