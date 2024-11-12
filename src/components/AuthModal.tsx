import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onSwitchMode: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, {
            displayName: name,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`
          });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF4D8D] to-[#FF8D6B] text-transparent bg-clip-text">
            {mode === 'signin' ? 'Welcome Back!' : 'Join ShopSquad'}
          </h2>
          <p className="text-gray-600 mt-2">
            {mode === 'signin' 
              ? 'Sign in to continue shopping with your squad'
              : 'Create an account to start shopping with friends'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full rounded-xl border border-gray-200 focus:border-[#FF4D8D] focus:ring focus:ring-[#FF4D8D] focus:ring-opacity-50"
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full rounded-xl border border-gray-200 focus:border-[#FF4D8D] focus:ring focus:ring-[#FF4D8D] focus:ring-opacity-50"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full rounded-xl border border-gray-200 focus:border-[#FF4D8D] focus:ring focus:ring-[#FF4D8D] focus:ring-opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#FF4D8D] to-[#FF8D6B] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-600">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchMode}
                  className="text-[#FF4D8D] hover:text-[#FF8D6B] font-medium transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchMode}
                  className="text-[#FF4D8D] hover:text-[#FF8D6B] font-medium transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}