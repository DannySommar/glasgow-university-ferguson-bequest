import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Attractions } from './pages/Attractions'
import { SpecificAttraction } from './pages/SpecificAttraction'
import { Home } from './pages/Home'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { TermsAndConditions } from './pages/TermsAndConditions'
import { Admin } from './pages/Admin'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const testBackend = async () => {
      try {
        const res = await fetch('/api/hello');
        
        if (res.ok) {
          const data = await res.json();
          setMessage(data.message);
        } else {
          setMessage('Backend returned error');
        }
      } catch (err) {
        setMessage('Backend not connected');
        console.error('Connection error:', err);
      }
    };

    testBackend();
  }, []);

  return (
    <>
    <Router>
      <Routes>
        <Route element={<Layout/>}><Route/>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/About' element={<About />}></Route>
        <Route path='/Attractions' element={<Attractions/>}></Route>
        <Route path="/attractions/:slug" element={<SpecificAttraction />}></Route>
        <Route path='/Terms' element={<TermsAndConditions />}></Route>
        <Route path='/Admin' element={<Admin/>}></Route>
      </Route> 
      </Routes>
    </Router>

    {/* for debug */}
    <div>
      <h1>Ferguson Bequest frontend</h1>
      <p>Backend says: {message}</p>
    </div>
    </>
  )
}

export default App