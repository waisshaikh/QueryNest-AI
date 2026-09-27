import React, { useState } from 'react';
import { Link } from 'react-router';
import { register as registerUser } from '../services/auth.api';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [localWarning, setLocalWarning] = useState('');

  const submitForm = async (event) => {
    event.preventDefault();
    setLocalWarning('');
    setMessage('');
    setError('');

    if (!username.trim() || !email.trim() || !password.trim()) {
      setLocalWarning('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setLocalWarning('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    const payload = {
      username: username.trim(),
      email: email.trim(),
      password,
    };

    try {
      await registerUser(payload);
      setMessage(`Registration successful! Please check ${email} and verify your account before logging in.`);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (err) {
      const responseData = err.response?.data;
      const validationMessage = responseData?.errors?.[0]?.msg;
      setError(validationMessage || responseData?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f6f2] px-4 py-10 text-slate-900 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
      <div className="mx-auto flex w-full max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-2xl shadow-orange-950/10">
          
          {/* Header with QueryNest AI Logo */}
          <div className="flex flex-col items-center text-center space-y-2">
            <img
              src="/QuerynestAI-logo.png"
              alt="QueryNest AI Logo"
              className="w-14 h-14 object-contain drop-shadow"
            />
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Join QueryNest AI to get started
            </p>
          </div>

          <form onSubmit={submitForm} noValidate className="mt-8 space-y-5">
            
            {/* Local Empty/Short Password Validation Warning */}
            {localWarning && (
              <div className="flex items-center space-x-2 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm font-semibold text-amber-800">
                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                <span>{localWarning}</span>
              </div>
            )}

            {/* Registration Success Alert */}
            {message && (
              <div className="flex items-start space-x-3 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                <span className="leading-relaxed">{message}</span>
              </div>
            )}

            {/* Backend Registration Error Alert */}
            {error && !localWarning && (
              <div className="flex items-center space-x-2 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-sm font-semibold text-rose-700">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  if (localWarning) setLocalWarning('');
                }}
                placeholder="Choose a username"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (localWarning) setLocalWarning('');
                }}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (localWarning) setLocalWarning('');
                  }}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-4 pr-12 py-3 text-slate-900 font-medium placeholder-slate-400 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-medium text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
