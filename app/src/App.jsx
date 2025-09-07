import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <p className='mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500 dark:text-gray-400'>Hello</p>
    </>
  )
}

export default App
