import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/styles/Login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isStrongPassword = (password) =>
    password.length >= 6;

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    if (!isStrongPassword(password)) {
      toast.error('Password should be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });

      const { role, jwtToken } = res.data;
      localStorage.setItem('token', jwtToken);

      toast.success('Login successful! Redirecting...', { autoClose: 1500 });

      setTimeout(() => {
        if (role === 'student') {
          navigate('/student/dashboard');
        } else if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          toast.error('Invalid user role');
        }
      }, 1800);

    } catch (err) {
      toast.error('Invalid credentials or server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container"
    style={{
    backgroundImage: "url('/images/loginBg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  }} 
  >
      <div className="login-card">
        <img src="/images/UniLogo.png" alt="Logo" />
    
      <h2>Login (Admin & Student)</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        /><br /><br />

        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
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
        </div><br />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        Don’t have an account?{' '}
        <Link to="/student/signup" style={{ color: '#007bff' }}>
          Signup
        </Link>
      </p>

      <ToastContainer position="top-right" />
        </div>
    </div>
  );
};

export default Login;
