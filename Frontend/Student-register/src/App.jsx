import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import StudentRegisterForm from "./components/StudentRegisterForm"
import StudentTypeSelector from './components/StudentTypeSelector'

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
      
        <Route path="/" element={<StudentRegisterForm />} />
        <Route path="/register" element={<StudentTypeSelector />} />
      </Routes>
    </Router>
  )
}

export default App
