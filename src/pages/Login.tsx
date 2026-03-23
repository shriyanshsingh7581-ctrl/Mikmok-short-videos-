import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail } from 'lucide-react';

export default function Login() {
  const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google.');
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black text-white p-6 font-sans">
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        <div className="text-center mb-4">
          <h1 className="text-5xl font-light mb-3 tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>LuxeVoyage</h1>
          <p className="text-zinc-400 font-light tracking-wide text-sm uppercase">Discover high-end travel experiences</p>
        </div>

        {error && (
          <div className="w-full bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center font-light">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-transparent border-b border-zinc-700 px-2 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors font-light"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-transparent border-b border-zinc-700 px-2 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors font-light"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-6 rounded-full font-medium mt-4 hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="w-full flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-zinc-800"></div>
          <span className="text-zinc-600 text-xs uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-zinc-800"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-transparent border border-zinc-700 text-white py-3 px-6 rounded-full font-medium hover:bg-zinc-900 transition-colors"
        >
          <LogIn size={20} className="text-zinc-400" />
          Continue with Google
        </button>

        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-zinc-500 hover:text-white transition-colors text-sm mt-4 font-light"
        >
          {isSignUp ? 'Already a member? Sign In' : "Not a member? Create Account"}
        </button>

        <div className="mt-8 text-center text-xs text-zinc-600 font-light">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
