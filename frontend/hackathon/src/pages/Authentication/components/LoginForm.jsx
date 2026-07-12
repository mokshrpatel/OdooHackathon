import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import styles from './LoginForm.module.css';
import { loginUser } from '../../../services/auth/authService';
import useAuth from '../../../hooks/useAuth';
import useApi from '../../../hooks/useApi';
import useNotification from '../../../hooks/useNotification';
import { validateForm } from '../../../utils/validation';
import { RoutePaths } from '../../../routes/RoutePaths';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const { execute: attemptLogin, loading, error: apiError } = useApi(loginUser);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error on typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationRules = {
      email: { required: true, isEmail: true },
      password: { required: true }
    };
    
    const validationErrors = validateForm(formData, validationRules);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      const responseData = await attemptLogin({ email: formData.email, password: formData.password });
      
      // Based on API: { token: "...", user: { id, email, role } }
      if (responseData && responseData.token && responseData.user) {
        login(responseData.user, responseData.token);
        addNotification('Successfully logged in!', 'success');
        
        // Navigate to intended page or dashboard
        const from = location.state?.from?.pathname || RoutePaths.DASHBOARD;
        navigate(from, { replace: true });
      }
    } catch (err) {
      addNotification(err.response?.data?.message || 'Invalid credentials. Please try again.', 'error');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <Input 
        label="Email Address" 
        name="email"
        type="email"
        placeholder="e.g. manager@transitops.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        disabled={loading}
        icon="✉️"
      />
      
      <Input 
        label="Password" 
        name="password"
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        disabled={loading}
        icon="🔒"
      />
      
      {apiError && (
        <div style={{ 
          color: 'var(--danger)', 
          fontSize: '0.875rem', 
          padding: '12px 16px', 
          backgroundColor: 'rgba(239, 68, 68, 0.05)', 
          borderLeft: '4px solid var(--danger)',
          borderRadius: 'var(--radius-sm)' 
        }}>
          <strong>Authentication Error: </strong>{apiError}
        </div>
      )}

      <div className={styles.options}>
        <label className={styles.checkbox}>
          <input type="checkbox" disabled={loading} />
          <span>Remember me</span>
        </label>
        <a href="#" className={styles.forgotPassword} onClick={(e) => { e.preventDefault(); addNotification('Contact your IT admin to reset password.', 'info'); }}>
          Forgot password?
        </a>
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        className={styles.submitBtn}
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
