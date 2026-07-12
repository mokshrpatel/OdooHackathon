import React, { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import { getNotifications, markAsRead } from '../../../services/notifications/notificationsService';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchNotifications(); // Refresh on open
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={styles.bellContainer} ref={dropdownRef}>
      <div className={styles.bellIcon} onClick={handleToggle}>
        🔔
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            Notifications
            <span style={{ fontSize: '0.75rem', cursor: 'pointer', color: 'var(--primary)' }} onClick={() => notifications.forEach(n => !n.read && handleMarkAsRead(n.id, { stopPropagation: () => {} }))}>Mark all read</span>
          </div>
          <div className={styles.dropdownList}>
            {loading ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>No new notifications.</div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className={`${styles.dropdownItem} ${!notif.read ? styles.unread : ''}`}>
                  <div className={styles.notifTitle}>
                    {notif.type === 'warning' ? '⚠️ ' : notif.type === 'success' ? '✅ ' : 'ℹ️ '}
                    {notif.title}
                  </div>
                  <div className={styles.notifMessage}>{notif.message}</div>
                  <div className={styles.notifFooter}>
                    <span className={styles.notifTime}>{new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {!notif.read && (
                      <span className={styles.markRead} onClick={(e) => handleMarkAsRead(notif.id, e)}>Mark Read</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
