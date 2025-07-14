import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import './LoginRegister.css';

function LoginRegister() {
  const [isLoginView, setIsLoginView] = useState(true);
  const navigate = useNavigate();
  
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User authenticated:", user);
      navigate('/finna');
    }
  }, [isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isLoginView ? 'Bienvenue' : 'Créer un compte'}</h1>
        </div>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLoginView ? 'active' : ''}`}
            onClick={() => setIsLoginView(true)}
          >
            Se connecter
          </button>
          <button 
            className={`auth-tab ${!isLoginView ? 'active' : ''}`}
            onClick={() => setIsLoginView(false)}
          >
            S'enregistrer
          </button>
        </div>
        
        <div className="auth-form-container">
          {isLoginView ? <LoginForm /> : <RegisterForm />}
        </div>
        
        <div className="auth-footer">
          <p>
            {isLoginView 
              ? "Vous n'avez pas de compte ?" 
              : "Vous avez déjà un compte ?"}
            <button 
              className="auth-text-button"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? "S'enregistrer" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
