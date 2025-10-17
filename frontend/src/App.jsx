import { useState } from 'react'
import './App.css'
import Navbar from './components/navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen">
      <Navbar />
      <div>
        <h1>Home Page</h1>
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>
          Increment
        </button>
      </div>
    </div>
  )
}

export default App
