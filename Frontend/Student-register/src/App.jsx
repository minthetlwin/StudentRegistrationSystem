import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import Navbar from "./components/Navbar"
import StudentPasswordContainer from "./containers/StudentPasswordContainer"
import StudentTypeSelector from './components/StudentTypeSelector'
import LoginContainer from './containers/LoginContainer'
import AdminContainer from './containers/AdminContainer'
import DashboardContainer from './containers/DashboardContainer'
import MainLayout from './Layouts/MainLayout'

function App() {
  
  return (
   <Router>
      <Routes>
        {/* Pages that use MainLayout (Navbar included) */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/register" element={<MainLayout><StudentPasswordContainer /></MainLayout>} />
        <Route path="/student-type" element={<MainLayout><StudentTypeSelector /></MainLayout>} />
        <Route path="/login" element={<MainLayout><LoginContainer /></MainLayout>} />
        <Route path="/admin-login" element={<MainLayout><AdminContainer /></MainLayout>} />

        {/* Pages without Navbar */}
        <Route path="/dashboard" element={<DashboardContainer />} />
      </Routes>
    </Router>
  )
}

export default App
