const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// CONTEXT
// ==========================================

// AuthContext
writeFile('context/AuthContext.jsx', `
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token and user on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user from local storage');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
`);

// ThemeContext
writeFile('context/ThemeContext.jsx', `
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Default to dark theme as requested for enterprise look
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
`);

// NotificationContext
writeFile('context/NotificationContext.jsx', `
import React, { createContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Simple inline styles for toast container (can be moved to CSS later)
  const containerStyle = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    zIndex: 9999,
  };

  const toastStyle = (type) => ({
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#18181b',
    color: '#fff',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '250px',
    animation: 'slideIn 0.3s ease',
  });

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div style={containerStyle}>
          {notifications.map(notif => (
            <div key={notif.id} style={toastStyle(notif.type)}>
              <span>{notif.message}</span>
              <button 
                onClick={() => removeNotification(notif.id)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: '16px' }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
};
`);


// ==========================================
// HOOKS
// ==========================================

// useAuth
writeFile('hooks/useAuth.js', `
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
`);

// useTheme
writeFile('hooks/useTheme.js', `
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
`);

// useNotification (Implicitly required for NotificationContext to be useful)
writeFile('hooks/useNotification.js', `
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default useNotification;
`);


// useApi
writeFile('hooks/useApi.js', `
import { useState, useCallback } from 'react';

/**
 * Custom hook to handle API requests with loading, error, and data states.
 * @param {Function} apiFunc - The API function (from services) to be called.
 */
const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      // Execute the API function which should return the response
      const response = await apiFunc(...args);
      // Usually axios wraps data in response.data, but this depends on how the service is written
      const responseData = response.data !== undefined ? response.data : response;
      setData(responseData);
      return responseData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  return { data, loading, error, execute, setError };
};

export default useApi;
`);

console.log("Context and hooks generated successfully.");
