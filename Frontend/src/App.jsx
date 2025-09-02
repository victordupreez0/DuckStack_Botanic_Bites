import { useState, useEffect } from 'react'
import './App.css'
import Header from './Components/header'
import Navbar from './Components/navbar'
import LogIn from './Components/logIn'
import SignUp from './Components/signUp'
import Admin from './Components/AdminComponents/admin'
import Home from './Components/home'
import { Routes, Route } from 'react-router-dom';
import FeaturedProducts from './Components/featuredProducts'

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
    <><div className="bg-[#343434] min-h-screen">
        <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
</>
  );
}

export default App;