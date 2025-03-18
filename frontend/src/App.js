import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Inline styles for the App component
const styles = {
  app: {
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f5f7'
  },
  header: {
    width: '100%',
    backgroundColor: '#0052cc',
    padding: '1rem 0',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    zIndex: 100
  },
  headerTitle: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 'bold'
  },
  content: {
    width: '100%',
    maxWidth: '1200px',
    padding: '2rem',
    marginTop: '60px',
    flex: 1
  },
  footer: {
    width: '100%',
    backgroundColor: '#172b4d',
    color: 'white',
    padding: '1rem 0',
    textAlign: 'center',
    fontSize: '0.9rem'
  }
};

function App() {
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <Router>
      <div style={styles.app}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Jira Project</h1>
        </header>
        
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
        <footer style={styles.footer}>
          <p>© {new Date().getFullYear()} Jira Project. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

// Placeholder Dashboard component (you'll need to create a proper one)
// Define Dashboard as a separate component outside of App
function Dashboard() {
  const styles = {
    dashboard: {
      textAlign: 'left'
    },
    welcome: {
      fontSize: '2rem',
      marginBottom: '2rem',
      color: '#172b4d'
    },
    logoutButton: {
      backgroundColor: '#de350b',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '3px',
      cursor: 'pointer',
      fontSize: '1rem'
    }
  };

  // Now useNavigate is used at the top level of a function component
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.welcome}>Welcome, {user.name || 'User'}!</h2>
      <p>This is your dashboard. You are now logged in.</p>
      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default App;
