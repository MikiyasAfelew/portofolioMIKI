import { useState, useEffect } from 'react'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Education from './components/Education'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Services from './components/Services'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDark = () => setDarkMode((d) => !d)

  return (
    <div className="relative min-h-screen transition-colors duration-300 bg-white dark:bg-[#0B0F1A] text-slate-800 dark:text-[#E6EAF2]">
      <Background darkMode={darkMode} />

      <div className="relative z-10">
        <Navbar darkMode={darkMode} toggleDark={toggleDark} />
        <main id="main-content">
          <Hero darkMode={darkMode} />
          <About />
          <Education />
          <Experience />
          <Skills />
          <Services />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
