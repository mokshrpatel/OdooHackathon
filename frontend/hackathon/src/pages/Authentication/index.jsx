import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import styles from './Authentication.module.css';
import useAuth from '../../hooks/useAuth';
import { RoutePaths } from '../../routes/RoutePaths';

const Authentication = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (isAuthenticated) {
      navigate(RoutePaths.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.logo}>TransitOps</div>
        <p className={styles.subtitle}>Sign in to your account</p>
      </div>
      
      <LoginForm />

      <div className={styles.demoCredentials}>
        <h4>Demo Accounts</h4>
        <ul>
          <li>
            <span>manager@transitops.com</span>
            <span>securepassword123</span>
          </li>
          <li>
            <span>dispatcher_02@transitops.com</span>
            <span>temporaryPassword123</span>
          </li>
          <li>
            <span>safety@transitops.com</span>
            <span>safetyfirst123</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Authentication;
