import React, { useState, useEffect } from 'react';
import './App.css'; // The same stylesheet is used

// --- ICONS (No changes here) ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="form__icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="form__icon"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="form__icon"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);

const BACKEND_URL = 'http://localhost:5000';

// --- Reusable Message Component ---
const Message = ({ text, type }) => {
    const messageClass = type === 'error' ? 'error-message' : 'success-message';
    if (!text) return null;
    return <div className={messageClass} role="alert"><span>{text}</span></div>;
};

// --- NEW: DASHBOARD COMPONENT ---
// This is the page the user sees after logging in.
const Dashboard = ({ user, onLogout }) => {
    return (
        <div className="login-card dashboard-card">
            <div className="card-header">
                <h1 className="card-header__title">Welcome, {user.name || 'User'}!</h1>
                <p className="card-header__subtitle">You are successfully logged in.</p>
            </div>
            <div className="dashboard-content">
                <p>Here is an image just for you:</p>
                <img 
                    src="https://placehold.co/600x400/4299e1/ffffff?text=Welcome!" 
                    alt="Welcome placeholder" 
                    className="dashboard-image"
                />
            </div>
            <button onClick={onLogout} className="button button--primary button--logout">
                Logout
            </button>
        </div>
    );
};


// --- LOGIN COMPONENT (Updated) ---
// Now takes an onLoginSuccess prop to notify the App component.
const Login = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || 'Something went wrong');
        
        // On success, call the function passed from App to update the state
        onLoginSuccess(data.token, data.user);

    } catch (err) {
        setError(err.message);
    }
  };

  return (
    <div className="login-card">
      <div className="card-header"><h1 className="card-header__title">Welcome Back!</h1><p className="card-header__subtitle">Sign in to continue</p></div>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group"><span className="form-group__icon-wrapper"><MailIcon /></span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="form__input" /></div>
        <div className="form-group"><span className="form-group__icon-wrapper"><LockIcon /></span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="form__input" /></div>
        <div className="form-options"><a href="#" className="form-options__link">Forgot Password?</a></div>
        <Message text={error} type="error" />
        <button type="submit" className="button button--primary">Login</button>
      </form>
      <div className="card-footer"><p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('signup'); }} className="card-footer__link">Sign Up</a></p></div>
    </div>
  );
};

// --- SIGNUP COMPONENT (No major changes) ---
const SignUp = ({ onNavigate }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (password.length < 6) {
            return setError('Password must be at least 6 characters long.');
        }
        try {
            const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Something went wrong');
            setSuccess(data.msg + " You can now log in.");
        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div className="login-card">
            <div className="card-header"><h1 className="card-header__title">Create Account</h1><p className="card-header__subtitle">Get started with a new account</p></div>
            <form onSubmit={handleSignUp} className="login-form">
                <div className="form-group"><span className="form-group__icon-wrapper"><UserIcon /></span><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className="form__input" /></div>
                <div className="form-group"><span className="form-group__icon-wrapper"><MailIcon /></span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="form__input" /></div>
                <div className="form-group"><span className="form-group__icon-wrapper"><LockIcon /></span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" className="form__input" /></div>
                <Message text={error} type="error" />
                <Message text={success} type="success" />
                <button type="submit" className="button button--primary">Sign Up</button>
            </form>
            <div className="card-footer"><p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('login'); }} className="card-footer__link">Login</a></p></div>
        </div>
    );
};

// --- MAIN APP COMPONENT (Updated to manage auth state) ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login' or 'signup'
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Check for a token in localStorage when the app first loads
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    console.log("stoored:",storedToken,storedUser);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    console.log("login:",newToken,newUser);
    // Store token and user info so they stay logged in after a refresh
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    // Clear the stored token and user info
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentPage('login'); // Go back to login page
  };

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {token ? (
          // If user is logged in (token exists), show the Dashboard
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          // Otherwise, show the Login or SignUp page
          currentPage === 'login' ? (
            <Login onNavigate={navigate} onLoginSuccess={handleLoginSuccess} />
          ) : (
            <SignUp onNavigate={navigate} />
          )
        )}
      </div>
    </div>
  );
}
