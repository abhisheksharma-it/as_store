import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Account from './pages/Account';
import Checkout from './pages/Checkout'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Favourites from './pages/Favourites'; 
// 1. Naya CartPage import kar
import CartPage from './components/ui/CartPage'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        
        {/* 2. Yahan se <CartDrawer /> hata diya hai kyunki ab full page use hoga */}
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:department" element={<ProductList />} />
            <Route path="/products/:department/:category" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            
            {/* 3. Naya Cart Route Add Kiya */}
            <Route path="/cart" element={<CartPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/favourites" 
              element={
                <ProtectedRoute>
                  <Favourites />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;