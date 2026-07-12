const fs = require('fs');
const path = require('path');

const src = 'e:/odoohackathon/frontend/hackathon/src';

function writeFile(filePath, content) {
    const fullPath = path.join(src, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
}

// ==========================================
// AUTHENTICATION MODULE
// ==========================================

writeFile('pages/Authentication/Authentication.module.css', `
.header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: -1px;
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.demoCredentials {
  margin-top: 32px;
  padding: 16px;
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.demoCredentials h4 {
  color: var(--text-main);
  margin-bottom: 8px;
  font-weight: 600;
}

.demoCredentials ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demoCredentials li {
  display: flex;
  justify-content: space-between;
}
`);

writeFile('pages/Authentication/index.jsx', `
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
        </ul>
      </div>
    </div>
  );
};

export default Authentication;
`);

writeFile('pages/Authentication/components/LoginForm.module.css', `
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-muted);
  cursor: pointer;
}

.forgotPassword {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.forgotPassword:hover {
  text-decoration: underline;
}

.submitBtn {
  margin-top: 8px;
  padding: 12px;
  font-size: 1rem;
}
`);

writeFile('pages/Authentication/components/LoginForm.jsx', `
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
        <div style={{ color: 'var(--danger)', fontSize: '0.875rem', padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>
          {apiError}
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
`);

console.log("Authentication module generated successfully.");
