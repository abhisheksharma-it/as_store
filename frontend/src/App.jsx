import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/Login';
import Account from './pages/Account';
import Checkout from './pages/Checkout'; // Import the Checkout page
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/ui/CartDrawer'; // Tune ye sahi import kiya tha

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
          </Routes>
        </div>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;