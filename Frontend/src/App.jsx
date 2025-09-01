import { useState, useEffect } from 'react'
import Logo from './assets/logo.png'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './Components/header'
import Navbar from './Components/navbar'



function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for demonstration
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
     <div className="flex items-center justify-center w-screen h-screen">
  <span className="loading loading-ring loading-xl text-green-600"></span>
</div>
    )
  }

  return (
    <>
      <Navbar/>
      <Header/>
    
    </>
  )
}

export default App