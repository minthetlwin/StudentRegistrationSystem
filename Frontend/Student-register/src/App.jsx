import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import StudentPasswordContainer from "./containers/StudentPasswordContainer"
import StudentTypeSelector from './components/StudentTypeSelector'

function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/register" element={<StudentPasswordContainer />} />
        <Route path="/student-type" element={<StudentTypeSelector />} />
      </Routes>
    </Router>
  )
}

export default App
