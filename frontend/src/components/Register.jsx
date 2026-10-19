import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Apna API config import kar lena

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // 🔴 NAYA LOGIC: Payload ko Django ke hisab se structure kiya
      const payloadData = {
        ...formData,
        username: formData.email // Django ko username chahiye, humne email ko hi as username bhej diya
      };

      console.log("SENDING DATA TO DJANGO:", payloadData); 

      // Request bhejna
      const response = await api.post('accounts/register/', payloadData); 
      
      console.log("REGISTRATION SUCCESS:", response.data);
      alert('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      console.error("FULL BACKEND ERROR RESPONSE:", err.response?.data);
      
      const errorData = err.response?.data;
      let errorMsg = 'Registration failed.';

      // Thoda better error message show karna UI par
      if (typeof errorData === 'object' && errorData !== null) {
          if (errorData.username) errorMsg = `Username/Email Error: ${errorData.username[0]}`;
          else if (errorData.email) errorMsg = `Email Error: ${errorData.email[0]}`;
          else if (errorData.password) errorMsg = `Password Error: ${errorData.password[0]}`;
          else if (errorData.error || errorData.detail) errorMsg = errorData.error || errorData.detail;
          else errorMsg = JSON.stringify(errorData);
      }
      
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-white px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-light tracking-[0.2em] uppercase text-center mb-10">
          Become a Member
        </h1>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 text-xs p-4 mb-6 tracking-wide text-center uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors placeholder-gray-600"
              placeholder="Enter your first name"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              required
              minLength="6"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/20 pb-2 text-sm focus:outline-none focus:border-white transition-colors placeholder-gray-600"
              placeholder="Create a password"
            />
          </div>

          <p className="text-[10px] tracking-widest text-gray-500 uppercase mt-4">
            By clicking become a member, you agree to our Terms & Conditions.
          </p>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors mt-8 disabled:bg-white/50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Register'}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">
            Already have an account?
          </p>
          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="w-full border border-white text-white py-4 text-xs font-medium uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;