import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'orders'

  useEffect(() => {
    // Backend se user ke orders fetch karo
    const fetchOrders = async () => {
      try {
        const response = await api.get('orders/my-orders/');
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen pt-32 pb-20 text-white px-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <h1 className="text-2xl font-light tracking-[0.2em] uppercase mb-10">My Account</h1>
          <ul className="space-y-6 text-xs font-light tracking-wide uppercase text-gray-400">
            <li 
              onClick={() => setActiveTab('profile')}
              className={`cursor-pointer transition-colors ${activeTab === 'profile' ? 'text-white' : 'hover:text-white'}`}
            >
              Profile
            </li>
            <li 
              onClick={() => setActiveTab('orders')}
              className={`cursor-pointer transition-colors flex justify-between items-center ${activeTab === 'orders' ? 'text-white' : 'hover:text-white'}`}
            >
              Orders 
              <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-[9px]">{orders.length}</span>
            </li>
            <li className="hover:text-white cursor-pointer transition-colors text-gray-600">Settings (Coming Soon)</li>
            <li 
              onClick={handleLogout}
              className="hover:text-white cursor-pointer transition-colors pt-6 border-t border-white/10 text-red-400 hover:text-red-300"
            >
              Sign Out
            </li>
          </ul>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 border-l border-white/10 pl-0 md:pl-12 min-h-[400px]">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <h2 className="text-sm tracking-widest uppercase mb-8">Personal Information</h2>
              <div className="bg-[#111] p-8 border border-white/5">
                <div className="space-y-6 text-sm font-light">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Email / Username</p>
                    {/* User data authStore se aayega */}
                    <p className="tracking-wider">{user?.email || user?.username || 'user@example.com'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <h2 className="text-sm tracking-widest uppercase mb-8">Order History</h2>
              
              {loading ? (
                <div className="text-xs text-gray-500 uppercase tracking-widest">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="bg-[#111] p-8 border border-white/5 text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/')} className="text-xs underline tracking-widest hover:text-gray-300 uppercase">Start Shopping</button>
                </div>
              ) : (
                <div className="bg-[#111] border border-white/5">
                  {/* Order Table Header */}
                  <div className="grid grid-cols-4 gap-4 p-4 border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
                    <div>Order ID</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div className="text-right">Total</div>
                  </div>
                  
                  {/* Order List */}
                  {orders.map((order) => (
                    <div key={order.id} className="grid grid-cols-4 gap-4 p-4 border-b border-white/5 text-sm font-light items-center hover:bg-white/5 transition-colors">
                      <div className="text-gray-300">#{order.id}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                      <div>
                        <span className={`text-[10px] px-2 py-1 uppercase tracking-widest ${
                          order.status === 'Paid' ? 'text-green-400 bg-green-400/10' : 
                          order.status === 'Cancelled' ? 'text-red-400 bg-red-400/10' : 
                          'text-yellow-400 bg-yellow-400/10'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-right tracking-wider">₹{order.total_amount}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Account;