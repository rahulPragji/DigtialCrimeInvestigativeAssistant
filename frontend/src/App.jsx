import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    // We'll add API call here later when backend is running
    setMessage('Welcome to Digital Crime Investigative Assistant')
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>{message}</h1>
      </header>
    </div>
  )
}

export default App
