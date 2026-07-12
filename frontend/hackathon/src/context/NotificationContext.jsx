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
