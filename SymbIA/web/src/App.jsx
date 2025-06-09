import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [apiData, setApiData] = useState(null)

  const fetchApiData = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/data')
      const data = await response.json()
      setApiData(data)
    } catch (error) {
      console.error('Error fetching API data:', error)
      setApiData({ error: 'Failed to fetch data' })
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={fetchApiData}>
          Call API /api/data
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      {apiData && (
        <div className="card">
          <h3>API Response:</h3>
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
        </div>
      )}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
