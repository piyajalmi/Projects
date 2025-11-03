import React, { useState } from 'react';
import axios from 'axios';
import "../Admin/AdminSignup.css";

import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Optional: for password toggle icons

const AdminSignup = () => {
  const [accessCode, setAccessCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAccessSubmit = (e) => {
    e.preventDefault();
    if (accessCode === import.meta.env.VITE_ADMIN_CODE) {
      setVerified(true);
      setError('');
    } else {
      setError('❌ Incorrect admin access code.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError("❗ Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/auth/admin-signup', {
        name,
        email,
        password,
        confirmPassword
      });

      if (res.data.success) {
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        navigate('/login');
      } else {
        setError(res.data.message || "Signup failed");
      }
    } catch (err) {
      setError("⚠️ Signup error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-signup">

        <div className="form-container">
          {!verified ? (
        <form onSubmit={handleAccessSubmit}>
          <h2>🔐 Enter Admin Access Code</h2>
          <input
            type="password"
            placeholder="Admin Access Code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
            style={{ width: '100%', padding: '0.5rem', margin: '1rem 0' }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ width: '100%' }}>Verify</button>
        </form>
      ) : (
        <>
          <h2>👨‍💼 Admin Signup</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Admin Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
            />

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem' }}
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer'
                }}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

            <button type="submit" disabled={isLoading} style={{ width: '100%' }}>
              {isLoading ? 'Registering...' : 'Register Admin'}
            </button>
          </form>
        </>
      )}
    </div>
    </div>
  );
};

export default AdminSignup;
