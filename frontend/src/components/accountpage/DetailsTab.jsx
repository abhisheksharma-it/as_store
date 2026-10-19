import { useState, useEffect } from 'react';
import api from '../../api'; // Apna API config import kar lena
import { useAuthStore } from '../../store/authStore';

export default function DetailsTab() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Zustand se token/user check karne ke liye
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // 🔴 Apne Django backend ke hisaab se endpoint check kar lena. 
        // Ye logged-in user ka data return karega
        const response = await api.get('accounts/profile/'); // ya 'users/profile/'
        setProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Could not load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className="text-white text-xs tracking-widest uppercase mt-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-xs tracking-widest uppercase mt-8">{error}</div>;
  }

  return (
    <div className="max-w-xl">
      <h2 className="mb-12 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
        My Profile
      </h2>

      <div className="space-y-8 border-b border-[#222] pb-12">
        
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Name
            </p>
            {/* 🔴 Ab yahan dynamic data aayega */}
            <p className="text-[11px] uppercase tracking-wider text-gray-400">
              {profile?.first_name || profile?.name || 'N/A'} {profile?.last_name || ''}
            </p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-gray-300">
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              E-mail
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gray-400">
              {profile?.email || 'N/A'}
            </p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-gray-300">
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Mobile
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gray-400">
              {profile?.phone || profile?.mobile || 'Not provided'}
            </p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-gray-300">
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Password
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gray-400">
              ••••••••
            </p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-gray-300">
            Edit
          </button>
        </div>
        
        {/* Date of Birth aur Gender fields agar DB mein hain toh dikha dena warna null handle kiya hai */}
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Date of birth
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gray-400">
              {profile?.dob || 'Not provided'}
            </p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-gray-300">
            Edit
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Gender
            </p>
            <p className="text-[11px] uppercase tracking-wider text-gray-400">
              {profile?.gender || 'Not provided'}
            </p>
          </div>
          <button className="text-[10px] font-bold uppercase tracking-[0.2em] text-white hover:text-gray-300">
            Edit
          </button>
        </div>

      </div>
    </div>
  );
}