import React from 'react'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Testers from './pages/Testers.jsx'
import TestCases from './pages/TestCases.jsx'
import ChatBot from './components/ChatBot.jsx'
import UploadPDFs from './pages/UploadPDFs.jsx'
import './App.css'


function App() {


  return (

    <ChatBot />

  )
}

export default App


// Falta agregar el link del chatbot en el navbar