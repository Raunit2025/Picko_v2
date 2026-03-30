"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ShoppingBag, ChefHat, User } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'owner/admin'>('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin ? { email, password } : { name, email, password, role };
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';

      const res = await fetch(`${apiBase}${endpoint.replace('/api', '')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      setAuth(data.user, data.token);
      if (data.user.role === 'owner/admin') {
        router.push('/owner');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillTestCredentials = (type: 'customer' | 'owner') => {
    if (type === 'customer') {
      setEmail('student@university.edu');
      setPassword('password123');
    } else {
      setEmail('owner@dominos.com');
      setPassword('owner123');
    }
    setIsLogin(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-2xl shadow-md border border-orange-100 mb-4">
            <ShoppingBag className="text-orange-600" size={28} />
            <span className="text-2xl font-black text-gray-900">Picko</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            {isLogin ? 'Login to continue craving' : 'Sign up to start ordering'}
          </p>
        </div>

        {/* Test credential shortcuts */}
        {isLogin && (
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => fillTestCredentials('customer')}
              className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors"
            >
              👤 Test Customer
            </button>
            <button
              type="button"
              onClick={() => fillTestCredentials('owner')}
              className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
            >
              🏪 Test Owner
            </button>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm font-semibold">
              {error}
            </div>
          )}

          {/* Role Selection (signup only) */}
          {!isLogin && (
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-700 mb-3">I am a...</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-bold transition-all duration-200 ${
                    role === 'customer'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md shadow-orange-100'
                      : 'border-gray-200 text-gray-500 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <User size={28} className={role === 'customer' ? 'text-orange-600' : 'text-gray-400'} />
                  <span className="text-sm">Customer</span>
                  <span className="text-[11px] font-medium opacity-70">Browse & Order</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('owner/admin')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-bold transition-all duration-200 ${
                    role === 'owner/admin'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100'
                      : 'border-gray-200 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <ChefHat size={28} className={role === 'owner/admin' ? 'text-emerald-600' : 'text-gray-400'} />
                  <span className="text-sm">Shop Owner</span>
                  <span className="text-[11px] font-medium opacity-70">Manage Orders</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  placeholder="John Doe"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold text-lg py-4 rounded-xl hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 text-white ${
                !isLogin && role === 'owner/admin'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm font-medium">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-orange-600 hover:text-orange-800 transition-colors font-bold underline decoration-2 underline-offset-4"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
