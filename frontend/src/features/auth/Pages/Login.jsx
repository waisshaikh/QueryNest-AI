import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router';
import { useAuth } from '../hook/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import { setError } from '../auth.slice';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localWarning, setLocalWarning] = useState('');

    const user = useSelector(state => state.auth.user);
    const loading = useSelector(state => state.auth.loading);
    const error = useSelector(state => state.auth.error);

    const { handleLogin } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Clear initial route errors on component mount
    useEffect(() => {
        dispatch(setError(null));
        setLocalWarning('');
    }, [dispatch]);

    const submitForm = async (event) => {
        event.preventDefault();
        setLocalWarning('');
        dispatch(setError(null));

        if (!email.trim() || !password.trim()) {
            setLocalWarning('Please enter both email and password.');
            return;
        }

        const payload = {
            email: email.trim(),
            password,
        };

        const result = await handleLogin(payload);
        if (result.success) {
            navigate("/");
        }
    };

    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <section className="min-h-screen bg-[#f8f6f2] px-4 py-10 text-slate-900 sm:px-6 lg:px-8 flex items-center justify-center font-sans">
            <div className="mx-auto flex w-full max-w-md items-center justify-center">
                <div className="w-full rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-2xl shadow-orange-950/10">
                    
                    {/* Header with QueryNest AI Logo & Title */}
                    <div className="flex flex-col items-center text-center space-y-2">
                        <img
                            src="/QuerynestAI-logo.png"
                            alt="QueryNest AI Logo"
                            className="w-14 h-14 object-contain drop-shadow"
                        />
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-sm font-medium text-slate-600">
                            Sign in to access your QueryNest AI workspace
                        </p>
                    </div>

                    <form onSubmit={submitForm} noValidate className="mt-8 space-y-5">
                        
                        {/* Validation Warning for Empty Fields */}
                        {localWarning && (
                            <div className="flex items-center space-x-2 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm font-semibold text-amber-800">
                                <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
                                <span>{localWarning}</span>
                            </div>
                        )}

                        {/* Error Message Box for Incorrect Credentials / Verification */}
                        {error && !localWarning && (
                            error.toLowerCase().includes('verify') ? (
                                <div className="rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm font-medium text-amber-900">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-2xl">📧</span>
                                        <div>
                                            <p className="font-bold text-amber-950 mb-1">Email Not Verified</p>
                                            <p className="text-amber-800 leading-relaxed">
                                                Please check your inbox and verify your email before logging in.
                                                Check your <strong>Spam</strong> or <strong>Promotions</strong> folder if you don't see it.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2 rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-sm font-semibold text-rose-700">
                                    <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                                    <span>
                                        {error.toLowerCase().includes('user not exist') || error.toLowerCase().includes('invalid password')
                                            ? 'Wrong email or password. Please try again.'
                                            : error}
                                    </span>
                                </div>
                            )
                        )}

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
                                    placeholder="Enter your password"
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

                        {/* Submit Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-amber-700 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm font-medium text-slate-600">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700 hover:underline">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;
