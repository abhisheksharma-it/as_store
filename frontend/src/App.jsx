import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Account from './pages/Account';
import Checkout from './pages/Checkout'; 
import ProtectedRoute from './components/ProtectedRoute'; 
// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/ui/CartDrawer'; 

// 🔴 FIXED 1: Favourites page ko import kar liya
import Favourites from './pages/Favourites'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        
        {/* CART DRAWER YAHAN LAGEGA - Navbar ke theek neeche */}
        <CartDrawer /> 
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:department" element={<ProductList />} />
            <Route path="/products/:department/:category" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>}/>
            
            {/* 🔴 FIXED 2: Favourites ko as a valid React component <Favourites /> pass kiya */}
            <Route path="/favourites" element={<ProtectedRoute><Favourites /></ProtectedRoute>}/> 
            
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;