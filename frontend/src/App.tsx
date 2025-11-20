import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Create from './pages/Create'
import Preview from './pages/Preview'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/create" element={<Create/>} />
      <Route path="/edit/:id" element={<Create/>} />
      <Route path="/preview/:id" element={<Preview/>} />
    </Routes>
    </>
  )
}

export default App
