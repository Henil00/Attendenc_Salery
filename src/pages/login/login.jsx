import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, TextField, Alert, CircularProgress } from '@mui/material'
import { EmailOutlined, PhoneAndroidOutlined, LockOutlined } from '@mui/icons-material'
import Cookies from 'js-cookie'
import api from '../../lib/basic'
import { setRole } from '../../redux/store/counterSlice'

function Login() {
  // States
  const [step, setStep] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [timer, setTimer] = useState(60)
  const [verificationType, setVerificationType] = useState('')
  const inputRefs = useRef([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Timer for OTP resend
  useEffect(() => {
    if (step === 'otp-verify' && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000)
      return () => clearInterval(interval)
    }
  }, [step, timer])

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password })
      const data = response.data

      if (data.otp_verification_required) {
        setVerificationType('mobile')
        setStep('mobile-input')
        setSuccess('Please enter your mobile number for OTP verification')
      } else if (data.email_verification_required) {
        setVerificationType('email')
        await sendEmailOTP()
      } else if (data.token) {
        handleSuccessfulLogin(data)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Send Mobile OTP
  const sendMobileOTP = async () => {
    if (!mobile) {
      setError('Please enter mobile number')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/verify/mobile', { email, password, mobile })
      if (response.data.status) {
        setSuccess('OTP sent to your mobile number')
        setStep('otp-verify')
        setTimer(60)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Send Email OTP
  const sendEmailOTP = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/verify/email', { email, password })
      if (response.data.status) {
        setSuccess('OTP sent to your email address')
        setStep('otp-verify')
        setTimer(60)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError('Please enter complete OTP')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/verify/otp', { email, otp: otpString })
      const data = response.data

      if (data.success && data.token) {
        handleSuccessfulLogin(data)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Handle successful login
  const handleSuccessfulLogin = (data) => {
    Cookies.set('token', data.token, { expires: 7 })
    localStorage.setItem('user', JSON.stringify(data.user))
    
    // Dispatch role to Redux
    if (data.user?.role) {
      dispatch(setRole(data.user.role))
    }
    
    setSuccess('Login successful! Redirecting...')
    setTimeout(() => navigate('/'), 1500)
  }

  // Resend OTP
  const handleResend = async () => {
    setError('')
    setSuccess('')
    
    if (verificationType === 'mobile') {
      await sendMobileOTP()
    } else {
      await sendEmailOTP()
    }
  }

  // Reset to login
  const resetToLogin = () => {
    setStep('login')
    setOtp(['', '', '', '', '', ''])
    setMobile('')
    setError('')
    setSuccess('')
    setTimer(60)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <AnimatePresence mode="wait">
        {/* LOGIN STEP */}
        {step === 'login' && (
          <motion.div
            key="login"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-linear-to-br from-blue-500 to-purple-600 p-4 rounded-full">
                <LockOutlined sx={{ fontSize: 48, color: 'white' }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-gray-600 text-sm sm:text-base">Sign in to continue</p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <Alert severity="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <Alert severity="success">{success}</Alert>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #663a91 100%)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
              </motion.div>
            </form>
          </motion.div>
        )}

        {/* MOBILE INPUT STEP */}
        {step === 'mobile-input' && (
          <motion.div
            key="mobile-input"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-linear-to-br from-green-500 to-teal-500 p-4 rounded-full">
                <PhoneAndroidOutlined sx={{ fontSize: 48, color: 'white' }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Mobile Verification</h2>
              <p className="text-gray-600 text-sm sm:text-base">Enter your mobile number to receive OTP</p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <Alert severity="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <Alert severity="success">{success}</Alert>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <TextField
                fullWidth
                type="tel"
                label="Mobile Number"
                variant="outlined"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Enter 10 digit mobile number"
                disabled={loading}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <Button
                variant="contained"
                fullWidth
                onClick={sendMobileOTP}
                disabled={loading || !mobile}
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
              </Button>

              <Button
                variant="text"
                fullWidth
                onClick={resetToLogin}
                disabled={loading}
                sx={{ textTransform: 'none', color: 'gray' }}
              >
                Back to Login
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* OTP VERIFICATION STEP */}
        {step === 'otp-verify' && (
          <motion.div
            key="otp-verify"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-linear-to-br from-purple-500 to-pink-500 p-4 rounded-full">
                {verificationType === 'mobile' ? (
                  <PhoneAndroidOutlined sx={{ fontSize: 48, color: 'white' }} />
                ) : (
                  <EmailOutlined sx={{ fontSize: 48, color: 'white' }} />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Enter OTP</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Code sent to {verificationType === 'mobile' ? mobile : email}
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <Alert severity="error" onClose={() => setError('')}>
                  {error}
                </Alert>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <Alert severity="success">{success}</Alert>
              </motion.div>
            )}

            <form onSubmit={handleVerifyOTP}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center gap-2 sm:gap-3 mb-6"
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={loading}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors disabled:bg-gray-100"
                  />
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3"
              >
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || otp.join('').length !== 6}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                </Button>

                <div className="text-center">
                  {timer > 0 ? (
                    <p className="text-gray-600 text-sm">
                      Resend OTP in <span className="font-bold text-purple-600">{timer}s</span>
                    </p>
                  ) : (
                    <Button
                      variant="text"
                      onClick={handleResend}
                      disabled={loading}
                      sx={{ textTransform: 'none', fontWeight: 'bold' }}
                    >
                      Resend OTP
                    </Button>
                  )}
                </div>

                <Button
                  variant="text"
                  fullWidth
                  onClick={resetToLogin}
                  disabled={loading}
                  sx={{ textTransform: 'none', color: 'gray' }}
                >
                  Back to Login
                </Button>
              </motion.div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Login