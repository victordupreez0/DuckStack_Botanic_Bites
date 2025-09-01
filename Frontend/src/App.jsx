import { useState, useEffect } from 'react'
import Logo from './assets/logo.png'
import viteLogo from '/vite.svg'
import './App.css'
import CardNav from './Components/CardNav/CardNav'

const items = [
  {
    label: "About",
    bgColor: "#3D211A",
    textColor: "#fff",
    links: [
      { label: "Company", ariaLabel: "About Company" },
      { label: "Careers", ariaLabel: "About Careers" }
    ]
  },
  {
    label: "Projects", 
    bgColor: "#3D211A",
    textColor: "#fff",
    links: [
      { label: "Featured", ariaLabel: "Featured Projects" },
      { label: "Case Studies", ariaLabel: "Project Case Studies" }
    ]
  },
  {
    label: "Contact",
    bgColor: "#3D211A", 
    textColor: "#fff",
    links: [
      { label: "Email", ariaLabel: "Email us" },
      { label: "Twitter", ariaLabel: "Twitter" },
      { label: "LinkedIn", ariaLabel: "LinkedIn" }
    ]
  }
];

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
  <span className="loading loading-ring loading-xl text-primary"></span>
</div>
    )
  }

  return (
    <>
      <CardNav
        logo={Logo}
        logoAlt="Company Logo"
        items={items}
        baseColor="#fff"
        menuColor="#000"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
      />
    
    </>
  )
}

export default App