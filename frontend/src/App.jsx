import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:8000/api')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Backend not connected'))
  }, [])

  return (
    <div>
      <h1>Ferguson Bequest frontend</h1>
      <p>Backend says: {message}</p>
    </div>
  )
}

export default App