import { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route} from 'react-router-dom'
import { Attractions } from './pages/Attractions'
import {Home} from './pages/Home'
import { Layout } from './components/Layout'
import 

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Backend not connected'))
  }, [])

  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}><Route/>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/Attractions' element={<Attractions/>}></Route>
        </Route>
      </Routes>
    </Router>
    /* <div>
      <h1>Ferguson Bequest frontend</h1>
      <p>Backend says: {message}</p>
    </div> */
  )
}

export default App