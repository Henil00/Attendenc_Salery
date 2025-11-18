import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Button } from '@mui/material'
import Cookies from 'js-cookie'
import { decrement, increment } from '../../redux/store/counterSlice'

function Dashboard() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    Cookies.remove('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <motion.h1 
        className="text-4xl font-bold mb-4 text-blue-600"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard - Protected Page
      </motion.h1>

      <p className="text-lg mb-4">Count: {count}</p>
      
      <div className="flex gap-4 mb-4">
        <Button variant="contained" color="primary" onClick={() => dispatch(increment())}>
          +
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => dispatch(decrement())}>
          -
        </Button>
      </div>

      <Button variant="contained" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}

export default Dashboard