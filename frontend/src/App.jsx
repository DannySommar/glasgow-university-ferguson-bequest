import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route} from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'

import { Attractions } from './pages/Attractions'
import { SpecificAttraction } from './pages/SpecificAttraction'
import { Home } from './pages/Home'
import { Layout } from './components/Layout'
import { About } from './pages/About'
import { TermsAndConditions } from './pages/TermsAndConditions'
import { Admin } from './pages/Admin'
import { TicketDraws } from './pages/TicketDraws'
import { MyBookings } from './pages/MyBookings'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'

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
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout/>}>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/About' element={<About />}></Route>
          <Route path='/Attractions' element={<Attractions/>}></Route>
          <Route path="/attractions/:slug" element={<SpecificAttraction />}></Route>
          <Route path='/TicketDraws' element={<TicketDraws />}></Route>
          <Route path='/MyBookings' element={<MyBookings />}></Route>
          <Route path='/Terms' element={<TermsAndConditions />}></Route>
          <Route path='/Admin' element={<Admin/>}></Route>
          <Route path='/Login' element={<Login/>}></Route>
          <Route path='/Signup' element={<Signup/>}></Route>
        </Route> 
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App