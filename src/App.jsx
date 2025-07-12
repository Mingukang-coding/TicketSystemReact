import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar'
import LoginForm from './components/LoginForm'
import AdminDashboard from './components/AdminDashboard'
import EmployeeDashboard from './components/EmployeeDashboard'
import CreateTicket from './components/CreateTicket';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null)

  if (!user) {
    return <LoginForm onLogin={setUser} />
  }

  console.log('User in App:', user);
  console.log('User role:', user.role);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Routes>
          <Route path="/dashboard" element={user.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  )
}
export default App



