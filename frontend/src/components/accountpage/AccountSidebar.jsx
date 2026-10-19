import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'; 

const NAV_ITEMS = [
  { id: 'overview', label: 'MY ACCOUNT' },
  { id: 'purchases', label: 'MY PURCHASES' },
  { id: 'returns', label: 'RETURNS' },
  { id: 'refunds', label: 'REFUNDS' },
  { id: 'details', label: 'MY DETAILS' },
  { id: 'addresses', label: 'MY ADDRESSES' },
];

export default function AccountSidebar({ activeTab, onSelect }) {
  const navigate = useNavigate();
  const { logout } = useAuthStore(); 

  const handleLogout = () => {
    // 1. Storage se saare tokens permanently delete karo
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('token'); 
    
    // 2. Turant Home page ('/') par niklo taaki ProtectedRoute intercept na kare
    navigate('/'); 
    
    // 3. 10 milliseconds baad global state clear karo jab user safely Home par land ho chuka ho
    setTimeout(() => {
      if (logout) logout();
    }, 10);
  };

  return (
    <aside className="w-full lg:w-56 lg:shrink-0">
      <div className="lg:sticky lg:top-28">
        <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
          Account
        </p>
        <nav className="flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`text-left text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-200 ${
                activeTab === item.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-12 pt-8 border-t border-[#222]">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-red-600 hover:text-red-400 transition-colors"
          >
            <LogOut size={14} strokeWidth={2} />
            SIGN OUT
          </button>
        </div>
      </div>
    </aside>
  );
}