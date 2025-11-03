import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Student/register.css';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    yearOfStudy: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.yearOfStudy || !form.gender) {
      toast.error('Please fill out all Step 1 fields');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      toast.error('Enter a valid email address');
      return;
    }

    if (!validatePassword(form.password)) {
      toast.error('Password should be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/auth/signup', form);
      toast.success(res.data.message || 'Signup successful! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        {/* You can replace this with a <video> if you want */}
        <img
          src="/images/loginBg.png"
          alt="Graduation Background"
          className="signup-image"
        />
      </div>

      <div className="signup-right">
        <ToastContainer position="top-center" />
        <img src="/images/UniLogo.png" alt="Logo" className="signup-logo" />
        <h2>Sign Up</h2>

        <form
          onSubmit={step === 1 ? handleNext : handleSubmit}
          className="signup-form"
        >
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <select
                name="yearOfStudy"
                value={form.yearOfStudy}
                onChange={handleChange}
                required
              >
                <option value="">Select Year of Study</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>

              <div className="gender-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={form.gender === 'Male'}
                    onChange={handleChange}
                  />{' '}
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={form.gender === 'Female'}
                    onChange={handleChange}
                  />{' '}
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={form.gender === 'Other'}
                    onChange={handleChange}
                  />{' '}
                  Other
                </label>
              </div>

              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Please wait...' : 'Next'}
              </button>

              <p>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />

              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <div className="password-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              <div className="step-buttons">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                >
                  Back
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Signing up...' : 'Get Started'}
                </button>
              </div>

              <p>
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
