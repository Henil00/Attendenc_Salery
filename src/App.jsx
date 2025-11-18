import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/login'
import Dashboard from './pages/dashboard/dashboard'
import DashboardEmployee from './pages/dashboard/dshboardEmployee'
import ProtectedRoute from './pages/ProctedRoute/proctedroute'
import DashboardLayout from './components/DashboardLayout'
import NotFoundPage from './components/NotFoundPage'

function App() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen min-w-screen">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes with Layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Nested Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route index element={<DashboardEmployee />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
