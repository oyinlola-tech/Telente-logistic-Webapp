import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { authApi } from '../utils/api';
import { ADMIN_LOGIN_PATH } from '../constants/security';

function passwordRules(value: string) {
  return {
    minLength: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    digit: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value)
  };
}

export default function AdminResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const tokenFromUrl = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search]);

  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [devResetToken, setDevResetToken] = useState('');

  const hasToken = Boolean(tokenFromUrl);
  const rules = passwordRules(newPassword);
  const passwordIsStrong = Object.values(rules).every(Boolean);

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDevResetToken('');
    if (!identifier.trim()) {
      setError('Enter your admin username or email.');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.forgotPassword({ identifier: identifier.trim().toLowerCase() });
      setSuccess(response.message);
      if (response.devResetToken) {
        setDevResetToken(response.devResetToken);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!passwordIsStrong) {
      setError('Password does not meet complexity requirements.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await authApi.resetPassword({ token: tokenFromUrl, newPassword });
      setSuccess(response.message);
      setTimeout(() => navigate(ADMIN_LOGIN_PATH), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="pt-[85px] pb-20">
        <section className="py-12 md:py-20">
          <div className="max-w-2xl mx-auto px-4 md:px-8">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h1 className="text-2xl md:text-3xl font-bold text-[#324048] mb-2">
                {hasToken ? 'Set New Password' : 'Forgot Admin Password'}
              </h1>
              <p className="text-gray-600 mb-8">
                {hasToken
                  ? 'Create a new secure password to complete account recovery.'
                  : 'Enter your username or email to receive reset instructions.'}
              </p>

              {!hasToken ? (
                <form onSubmit={handleForgotSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Username or Email</label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1b75bc] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#155a94] transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Sending...' : 'Send Reset Instructions'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                    />
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className={rules.minLength ? 'text-green-700' : ''}>At least 8 characters</li>
                    <li className={rules.upper ? 'text-green-700' : ''}>At least 1 uppercase letter</li>
                    <li className={rules.lower ? 'text-green-700' : ''}>At least 1 lowercase letter</li>
                    <li className={rules.digit ? 'text-green-700' : ''}>At least 1 number</li>
                    <li className={rules.symbol ? 'text-green-700' : ''}>At least 1 symbol</li>
                  </ul>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1b75bc] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#155a94] transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}

              {error ? (
                <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="mt-5 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
                  {success}
                </div>
              ) : null}
              {devResetToken ? (
                <div className="mt-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm break-all">
                  Dev reset token: {devResetToken}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
