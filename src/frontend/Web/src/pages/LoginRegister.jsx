import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import './LoginRegister.css';

function LoginRegister() {
  const [isLoginView, setIsLoginView] = useState(true);
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isLoginView ? 'Welcome Back' : 'Create an Account'}</h1>

        </div>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLoginView ? 'active' : ''}`}
            onClick={() => setIsLoginView(true)}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLoginView ? 'active' : ''}`}
            onClick={() => setIsLoginView(false)}
          >
            Register
          </button>
        </div>
        
        <div className="auth-form-container">
          {isLoginView ? <LoginForm /> : <RegisterForm />}
        </div>
        
        <div className="auth-footer">
          <p>
            {isLoginView 
              ? "Don't have an account?" 
              : "Already have an account?"}
            <button 
              className="auth-text-button"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
