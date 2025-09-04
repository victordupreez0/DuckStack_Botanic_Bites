import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './Components/navbar'
import LogIn from './Components/logIn'
import SignUp from './Components/signUp'
import Admin from './Components/AdminComponents/admin'
import Home from './Components/home'
import ProductPage from './Components/productPage'
import Shop from './Components/shop'
import Cart from './Components/cart'
import Care from './Components/care'
import ScrollToTop from "./Components/scrollToTop";
import { Routes, Route } from 'react-router-dom';
import FeaturedProducts from './Components/featuredProducts'
import Footer from './Components/footer'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for demonstration
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex bg-black items-center justify-center w-screen h-screen">
        <span className="loading loading-ring loading-xl text-green-600"></span>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <ScrollToTop />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/admin/*" element={
            JSON.parse(localStorage.getItem('user') || 'null')?.isAdmin
              ? <Admin />
              : <Home />
          } />
          <Route path="/shop" element={<Shop />} />
          <Route path="/care" element={<Care />} />
          <Route path="/productPage" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}

export default App;