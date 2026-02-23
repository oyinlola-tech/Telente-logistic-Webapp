import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { authApi } from '../utils/api';
import { ADMIN_DASHBOARD_PATH, ADMIN_RESET_PASSWORD_PATH } from '../constants/security';

const adminVisual = '/images/about-warehouse.jpg';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [challengeToken, setChallengeToken] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [nowMs, setNowMs] = useState(Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const otpStep = Boolean(challengeToken);
  const remainingSeconds = useMemo(() => {
    if (!expiresAt) return 0;
    const diffMs = new Date(expiresAt).getTime() - nowMs;
    return Math.max(0, Math.floor(diffMs / 1000));
  }, [expiresAt, nowMs]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    setLoading(true);
    setError('');
    setInfo('');
    try {
      const result = await authApi.login({ username: username.trim(), password });
      setChallengeToken(result.challengeToken);
      setExpiresAt(result.expiresAt);
      setInfo('A one-time passcode has been sent. Enter it to continue.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a valid 6-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');
    setInfo('');
    try {
      await authApi.verifyOtp({ challengeToken, otp });
      navigate(ADMIN_DASHBOARD_PATH);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OTP verification failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!challengeToken) return;
    setResendLoading(true);
    setError('');
    setInfo('');
    try {
      const result = await authApi.resendOtp({ challengeToken });
      setExpiresAt(result.expiresAt);
      setInfo('A new OTP has been sent.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend OTP';
      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  const resetFlow = () => {
    setChallengeToken('');
    setOtp('');
    setExpiresAt(null);
    setError('');
    setInfo('');
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <main className="pt-[85px] pb-10 md:pb-20">
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
            <aside className="relative hidden lg:block">
              <img src={adminVisual} alt="Logistics warehouse operations" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b75bc]/85 to-[#2E4049]/40" />
              <div className="relative z-10 h-full flex items-end p-10 text-white">
                <div>
                  <p className="uppercase tracking-widest text-xs mb-3">Telente Logistics</p>
                  <h2 className="text-3xl font-bold leading-tight">Secure Admin Operations</h2>
                  <p className="mt-3 text-sm text-blue-50">
                    Manage shipments, tracking milestones, jobs, and applications from one secure workspace.
                  </p>
                </div>
              </div>
            </aside>

            <div className="p-6 md:p-10 flex items-center">
              <div className="w-full max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-[#324048] mb-2">Admin Login</h1>
                <p className="text-gray-600 mb-8">
                  {otpStep
                    ? 'Enter the one-time passcode to complete secure sign in.'
                    : 'Sign in to manage shipments and tracking updates.'}
                </p>

                {!otpStep ? (
                  <form onSubmit={handleCredentialsSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1b75bc] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#155a94] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Checking credentials...' : 'Continue'}
                    </button>

                    <div className="text-right">
                      <Link
                        to={ADMIN_RESET_PASSWORD_PATH}
                        className="text-sm font-semibold text-[#1b75bc] hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">One-Time Passcode</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        placeholder="Enter 6-digit OTP"
                        required
                        className="w-full tracking-[0.3em] text-center text-xl px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#1b75bc]"
                      />
                      {expiresAt ? (
                        <p className="mt-2 text-sm text-gray-600">OTP expires in about {remainingSeconds}s.</p>
                      ) : null}
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#1b75bc] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#155a94] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={resendLoading}
                        onClick={handleResendOtp}
                        className="w-full border-2 border-gray-300 text-[#324048] px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        {resendLoading ? 'Sending...' : 'Resend OTP'}
                      </button>
                      <button
                        type="button"
                        onClick={resetFlow}
                        className="w-full border-2 border-gray-300 text-[#324048] px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                      >
                        Start Over
                      </button>
                    </div>
                  </form>
                )}

                {error ? (
                  <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                    {error}
                  </div>
                ) : null}

                {info ? (
                  <div className="mt-5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3 text-sm">
                    {info}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
