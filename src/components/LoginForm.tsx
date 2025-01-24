import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn, ArrowLeft } from 'lucide-react';
import { login, requestOTP, verifyOTPAndSetPassword, resetAuth } from '../store/slices/authSlice';
import type { RootState, AppDispatch } from '../store';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, otpSent } = useSelector((state: RootState) => state.auth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleRequestOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      dispatch(requestOTP(email));
    }
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    dispatch(verifyOTPAndSetPassword({ email, otp, password: newPassword }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {otpSent ? 'Enter OTP' : 'Sign in to your account'}
          </h2>
        </div>

        {!otpSent ? (
          <div className="mt-8 space-y-6">
            <div className="text-sm text-center">
              <button
                onClick={() => dispatch(resetAuth())}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Don't have an account? Sign up with email
              </button>
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter your email to sign up"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Get OTP'}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
            <div>
              <button
                type="button"
                onClick={() => dispatch(resetAuth())}
                className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </button>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter the OTP sent to your email"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                Set Password
              </label>
              <input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Create a new password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP & Create Account'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              For demo purposes, use OTP: 123456
            </p>
          </form>
        )}
      </div>
    </div>
  );
}