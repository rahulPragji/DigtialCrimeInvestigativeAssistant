import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage'
import DeviceSelectionPage from './pages/DeviceSelectionPage'
import ArtefactsPage from './pages/ArtefactsPage'
import ChatPage from './pages/ChatPage'
import './assets/styles/global.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/device-selection/:crimeType" element={<DeviceSelectionPage />} />
        <Route path='/artefacts/:deviceType/:crimeType' element={<ArtefactsPage />} />
        <Route path="/chat/:deviceType/:crimeType" element={<ChatPage />} />
        <Route path="/chat/custom" element={<ChatPage />} />
        {/* Add more routes as needed */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  )
}

export default App
