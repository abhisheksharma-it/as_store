import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // Zustand store se function aur state nikalna
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const success = await login(email, password);
    if (success) {
      // Login successful hone pe, user ko home page ya checkout par bhej do
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-white px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-center mb-10">
          Sign In
        </h1>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-4 mb-6 tracking-wide text-center uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors placeholder-gray-600"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors placeholder-gray-600"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-3 h-3 accent-white cursor-pointer" />
              <span className="text-[10px] uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">Remember Me</span>
            </label>
            <button type="button" className="text-[10px] uppercase tracking-widest underline text-gray-400 hover:text-white transition-colors">
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors mt-8 disabled:bg-white/50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
            Don't have an account?
          </p>
          <button 
            type="button"
            className="w-full border border-white text-white py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;