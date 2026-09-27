'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HiOutlineUser, HiOutlineMail, HiOutlineLockClosed,
  HiOutlineCheck, HiOutlineExclamation, HiOutlineShieldCheck,
  HiOutlineCog, HiOutlineTrash,
} from 'react-icons/hi';

// ── Reusable alert component ─────────────────────────────────────────────────
function Alert({ type, message }) {
  if (!message) return null;
  const styles = type === 'success'
    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400'
    : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
  const Icon = type === 'success' ? HiOutlineCheck : HiOutlineExclamation;
  return (
    <div className={`flex items-center gap-2 p-3 rounded-xl border text-sm font-medium ${styles}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      {message}
    </div>
  );
}

export default function Settings() {
  const router = useRouter();

  // ── Profile state ─────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileStatus, setProfileStatus] = useState({ type: '', message: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // ── Password state ────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ── Delete account state ──────────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── Load user on mount ────────────────────────────────────────────────────
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(savedUser);
    setName(user.name || '');
    setEmail(user.email || '');
  }, [router]);

  // ── Update profile ────────────────────────────────────────────────────────
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setProfileLoading(true);
    setProfileStatus({ type: '', message: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        // Update cached user in localStorage
        const updatedUser = { ...JSON.parse(localStorage.getItem('user')), name: data.data.name, email: data.data.email };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setProfileStatus({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setProfileStatus({ type: 'error', message: data.error || 'Failed to update profile.' });
      }
    } catch {
      setProfileStatus({ type: 'error', message: 'Cannot connect to server. Make sure the backend is running.' });
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Update password ───────────────────────────────────────────────────────
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordStatus({ type: '', message: '' });
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/updatepassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        // New token issued — update localStorage
        localStorage.setItem('token', data.token);
        setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: data.error || 'Failed to change password.' });
      }
    } catch {
      setPasswordStatus({ type: 'error', message: 'Cannot connect to server. Make sure the backend is running.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ── Delete account (local logout — server-side deletion can be wired later) ──
  const handleDeleteAccount = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
            <HiOutlineCog className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Settings</h2>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 ml-[52px]">Manage your account preferences and security.</p>
      </div>

      <div className="space-y-6">

        {/* ── Section 1: Profile ── */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Section header accent */}
          <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineUser className="w-5 h-5 text-violet-500" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Profile Information</h3>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineUser className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    id="settings-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full pl-9 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all text-sm"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineMail className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-9 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <Alert type={profileStatus.type} message={profileStatus.message} />

              <button
                id="save-profile-btn"
                type="submit"
                disabled={profileLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-700 hover:bg-violet-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98] shadow-sm"
              >
                {profileLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><HiOutlineCheck className="w-4 h-4" /> Save Changes</>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* ── Section 2: Change Password ── */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <HiOutlineShieldCheck className="w-5 h-5 text-blue-500" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">Change Password</h3>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="block w-full pl-9 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="block w-full pl-9 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="Min. 6 characters"
                  />
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`block w-full pl-9 pr-3 py-2.5 border rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${
                      confirmPassword && newPassword !== confirmPassword
                        ? 'border-red-400 dark:border-red-600'
                        : 'border-zinc-300 dark:border-zinc-700'
                    }`}
                    placeholder="Re-enter new password"
                  />
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <Alert type={passwordStatus.type} message={passwordStatus.message} />

              <button
                id="change-password-btn"
                type="submit"
                disabled={passwordLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all active:scale-[0.98] shadow-sm"
              >
                {passwordLoading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</>
                ) : (
                  <><HiOutlineShieldCheck className="w-4 h-4" /> Update Password</>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* ── Section 3: Danger Zone ── */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-500 to-rose-500" />
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineTrash className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Danger Zone</h3>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Logging out will remove your session. Your data in MongoDB will remain intact.
            </p>

            {!showDeleteConfirm ? (
              <button
                id="logout-session-btn"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-5 py-2.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-xl transition-all"
              >
                <HiOutlineTrash className="w-4 h-4" />
                Log Out of All Sessions
              </button>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium flex-1">
                  Are you sure? You will be logged out immediately.
                </p>
                <button
                  id="cancel-logout-btn"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  id="confirm-logout-btn"
                  onClick={handleDeleteAccount}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all"
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
