import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (!isLogin && (!formData.name || !formData.confirmPassword))) {
      setError('All fields are required');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (isLogin) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.email === formData.email && storedUser.password === formData.password) {
          localStorage.setItem('isAuthenticated', 'true');
          navigate('/home');
        } else {
          setError('Invalid email or password');
        }
      } else {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth auth-container">
      <div className="auth-box">
        <div className="form-section">
          <h2>{isLogin ? 'LOGIN' : 'Create your account'}</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password (min. 8 characters)"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {!showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>
            {!isLogin && (
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {!showConfirmPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            )}
            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'LOGIN' : 'REGISTER'}
            </button>
          </form>
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <span onClick={toggleForm}>{isLogin ? 'Register' : 'Login'}</span>
          </p>
        </div>
        <div className="separator"></div>
        <div className="logo-section">
          <img src="/logo1.png" alt="GeoTrack Logo" />
          <h1>GeoTrack</h1>
        </div>
      </div>
    </div>
  );
};

export default Auth;