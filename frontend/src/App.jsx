import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import AccountPage from './components/accountpage/AccountPage';
import Checkout from './pages/Checkout'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Favourites from './pages/Favourites'; 
import Register from './components/Register';
import CartPage from './components/ui/CartPage'; 
import AIStylistDrawer from './components/ai/AIStylistDrawer';
import NotFound from './pages/NotFound'; // <-- ye line add ki

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:department" element={<ProductList />} />
            <Route path="/products/:department/:category" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Routes */}
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              } 
            />
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

            {/* 404 Catch-All - Hamesha sabse last me hona chahiye */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        
        <Footer />
        {/* SS ke hisab se CartDrawer ke niche mount karna tha */}
        <AIStylistDrawer />
      </div>
    </Router>
  );
}

export default App;