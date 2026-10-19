import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  // NAYA LOGIC: Current page ka URL capture karna
  const location = useLocation();

  // Agar login nahi hai, toh wapas login page par bhejo, aur 'state' mein current URL save kardo
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;