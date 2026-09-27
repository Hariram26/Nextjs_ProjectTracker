'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        // Redirect to home page
        router.push('/');
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during signup');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-violet-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
        
        <div className="p-8 relative">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Create an Account</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">Join us to start managing your projects</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineUser className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="email"
                  className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-zinc-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all active:scale-[0.98]"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">Already have an account? </span>
            <Link href="/login" className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
