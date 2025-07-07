import React, { useState } from 'react';
import './AuthForms.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userApi';

function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      loginUser(formData.email, formData.password)
      .then(response => {
        console.log('Connexion réussie :', response);
        navigate('/finna');
      }).catch(error => {
        console.error('Échec de la connexion :', error);
        if (error && error.status === 401) {
          setErrors({ response: 'Email ou mot de passe invalide' });
        } else {
          setErrors({ response: 'Une erreur est survenue. Veuillez réessayer.' });
        }
      });
    }
  };
  
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-input ${errors.email ? 'input-error' : ''}`}
          placeholder="votre@email.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          name="password"
          className={`form-input ${errors.password ? 'input-error' : ''}`}
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>
      
      <div className="form-row">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <label htmlFor="rememberMe">Se souvenir de moi</label>
        </div>
        
        <a href="/forgot-password" className="forgot-password">
          Mot de passe oublié ?
        </a>
      </div>
      
      <button type="submit" className="auth-button">
        Se connecter
      </button>
      <div style={{ textAlign: 'center'}}>
        {errors.response && <p className="error-message" style={{ fontSize: '18px'}}>{errors.response}</p>}
      </div>
      <div className="auth-divider">
        <span>ou continuez avec</span>
      </div>
      
      <div className="social-buttons">
        <button 
        type="button" 
        className="social-button google"
        onClick={() => {
          window.location.href = 'http://localhost:3001/auth/google';
        }}>
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
          </svg>
          Google
        </button>

        <button type="button" className="social-button github">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
