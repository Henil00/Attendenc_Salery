'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Box,
  Typography,
  Stack,
  Container,
  Paper,
  CircularProgress,
  Skeleton,
} from '@mui/material'
import axiosInstance from '../../lib/axios'

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

function DashboardEmployee() {
  const [filterType, setFilterType] = useState('monthly')
  const [selectedMonth, setSelectedMonth] = useState('01')
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [page, setPage] = useState(0)
  const recordsPerPage = 50

  // Profile and Salary Data States
  const [profileLoading, setProfileLoading] = useState(true)
  const [salaryLoading, setSalaryLoading] = useState(true)
  const [profileData, setProfileData] = useState(null)
  const [salaryData, setSalaryData] = useState(null)

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      setProfileLoading(true)
      try {
        const response = await axiosInstance.get('/profile')
        if (response.data.success) {
          setProfileData(response.data.profile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Fetch Salary Data
  useEffect(() => {
    const fetchSalary = async () => {
      setSalaryLoading(true)
      try {
        const response = await axiosInstance.get('/salary/GetSalaryDetails')
        if (response.data.success) {
          setSalaryData(response.data.salary)
        }
      } catch (error) {
        console.error('Error fetching salary:', error)
      } finally {
        setSalaryLoading(false)
      }
    }

    fetchSalary()
  }, [])

  // Calculate monthly earning (assuming 8 hours per day, 26 working days)
  const calculateMonthlyEarning = () => {
    if (!salaryData) return '₹0'
    const baseSalary = salaryData.base_salary_per_hour * 8 * 26
    return `₹${baseSalary.toLocaleString('en-IN')}`
  }

  // Personal info data
  const personalInfo = {
    name: profileData?.name || 'Loading...',
    email: profileData?.email || 'Loading...',
    baseSalary: salaryData ? `₹${salaryData.base_salary_per_hour}/hour` : 'Loading...',
    overtimeRate: salaryData ? `₹${salaryData.overtime_salary_per_hour}/hour` : 'Loading...',
    monthlyEarning: calculateMonthlyEarning()
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams()

      if (filterType === 'monthly') {
        queryParams.append('month', selectedMonth)
        queryParams.append('year', selectedYear)
      } else {
        queryParams.append('fromDate', fromDate)
        queryParams.append('toDate', toDate)
      }

      const response = await axiosInstance.get(`/salary-attendance?${queryParams.toString()}`)
      const data = response.data

      if (data.success) {
        setTableData(data.records || [])
        setPage(0)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const paginatedData = tableData.slice(
    page * recordsPerPage,
    page * recordsPerPage + recordsPerPage
  )

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

    const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  }

  // Info Card Component
  const InfoCard = ({ title, value, color, loading }) => (
    <motion.div variants={cardVariants}>
      <Card
        sx={{
          height: '100%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        <CardHeader
          title={
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.625rem',
                fontWeight: 'bold',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {title}
            </Typography>
          }
          sx={{ pb: { xs: 1, md: 1.5 } }}
        />
        <CardContent sx={{ pt: 0 }}>
          {loading ? (
            <Skeleton
              variant="text"
              width="80%"
              height={28}
              sx={{ fontSize: { xs: '0.875rem', md: '1.125rem' } }}
            />
          ) : (
            <Typography
              sx={{
                fontSize: { xs: '0.875rem', md: '1.125rem' },
                fontWeight: 'bold',
                color: color || '#1f2937',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {value}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 3, md: 4 }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 'bold',
                  color: '#1f2937',
                  mb: 1,
                  fontSize: { xs: '1.5rem', md: '2.25rem' },
                }}
              >
                Salary & Attendance Dashboard
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6b7280',
                  fontSize: { xs: '0.875rem', md: '1rem' },
                }}
              >
                Track your salary, overtime, and attendance records
              </Typography>
            </Box>
          </motion.div>

          {/* Personal Info Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(5, 1fr)',
                },
                gap: { xs: 1.5, md: 2 },
              }}
            >
              {/* Name Card */}
              <InfoCard
                title="Name"
                value={personalInfo.name}
                loading={profileLoading}
              />

              {/* Email Card */}
              <InfoCard
                title="Email"
                value={personalInfo.email}
                loading={profileLoading}
              />

              {/* Base Salary Card */}
              <InfoCard
                title="Base Salary"
                value={personalInfo.baseSalary}
                color="#16a34a"
                loading={salaryLoading}
              />

              {/* Overtime Rate Card */}
              <InfoCard
                title="Overtime Rate"
                value={personalInfo.overtimeRate}
                color="#2563eb"
                loading={salaryLoading}
              />

              {/* Monthly Earning Card */}
              <InfoCard
                title="Monthly Earning"
                value={personalInfo.monthlyEarning}
                color="#9333ea"
                loading={salaryLoading}
              />
            </Box>
          </motion.div>

          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card
              sx={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
              }}
            >
              <CardHeader
                title={
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.25rem' },
                      fontWeight: 'bold',
                      color: '#1f2937',
                    }}
                  >
                    Filters
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={{ xs: 2, md: 3 }}>
                  {/* Filter Type Selection */}
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        mb: 1.5,
                      }}
                    >
                      Select Period Type
                    </Typography>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                    >
                      <Button
                        onClick={() => setFilterType('monthly')}
                        variant={filterType === 'monthly' ? 'contained' : 'outlined'}
                        sx={{
                          flex: 1,
                          textTransform: 'none',
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          fontWeight: 'bold',
                          py: { xs: 1.2, md: 1.4 },
                          backgroundColor: filterType === 'monthly' ? '#2563eb' : 'transparent',
                          color: filterType === 'monthly' ? 'white' : '#2563eb',
                          border: '1.5px solid #2563eb',
                          '&:hover': {
                            backgroundColor: filterType === 'monthly' ? '#1d4ed8' : '#eff6ff',
                          },
                        }}
                      >
                        Monthly
                      </Button>
                      <Button
                        onClick={() => setFilterType('custom')}
                        variant={filterType === 'custom' ? 'contained' : 'outlined'}
                        sx={{
                          flex: 1,
                          textTransform: 'none',
                          fontSize: { xs: '0.875rem', md: '1rem' },
                          fontWeight: 'bold',
                          py: { xs: 1.2, md: 1.4 },
                          backgroundColor: filterType === 'custom' ? '#2563eb' : 'transparent',
                          color: filterType === 'custom' ? 'white' : '#2563eb',
                          border: '1.5px solid #2563eb',
                          '&:hover': {
                            backgroundColor: filterType === 'custom' ? '#1d4ed8' : '#eff6ff',
                          },
                        }}
                      >
                        Custom Range
                      </Button>
                    </Stack>
                  </Box>

                  {/* Monthly Filter */}
                  {filterType === 'monthly' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                          },
                          gap: 2,
                        }}
                      >
                        {/* Month Select */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              color: '#1f2937',
                              mb: 1,
                            }}
                          >
                            Month
                          </Typography>
                          <Select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            sx={{
                              width: '100%',
                              height: { xs: '40px', md: '44px' },
                              fontSize: { xs: '0.875rem', md: '1rem' },
                            }}
                          >
                            {months.map((month) => (
                              <MenuItem key={month.value} value={month.value}>
                                {month.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>

                        {/* Year Select */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              color: '#1f2937',
                              mb: 1,
                            }}
                          >
                            Year
                          </Typography>
                          <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            sx={{
                              width: '100%',
                              height: { xs: '40px', md: '44px' },
                              fontSize: { xs: '0.875rem', md: '1rem' },
                            }}
                          >
                            {years.map((year) => (
                              <MenuItem key={year} value={year}>
                                {year}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      </Box>
                    </motion.div>
                  )}

                  {/* Custom Range Filter */}
                  {filterType === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                          },
                          gap: 2,
                        }}
                      >
                        {/* From Date */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              color: '#1f2937',
                              mb: 1,
                            }}
                          >
                            From Date
                          </Typography>
                          <TextField
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                height: { xs: '40px', md: '44px' },
                                fontSize: { xs: '0.875rem', md: '1rem' },
                              },
                            }}
                          />
                        </Box>

                        {/* To Date */}
                        <Box>
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 'bold',
                              color: '#1f2937',
                              mb: 1,
                            }}
                          >
                            To Date
                          </Typography>
                          <TextField
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              width: '100%',
                              '& .MuiOutlinedInput-root': {
                                height: { xs: '40px', md: '44px' },
                                fontSize: { xs: '0.875rem', md: '1rem' },
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  )}

                  {/* Search Button */}
                  <Box sx={{ pt: { xs: 1, md: 2 } }}>
                    <Button
                      onClick={handleSearch}
                      disabled={isLoading}
                      fullWidth
                      sx={{
                        height: { xs: '40px', md: '44px' },
                        fontSize: { xs: '0.875rem', md: '1rem' },
                        fontWeight: 'bold',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#1d4ed8',
                        },
                        '&:disabled': {
                          backgroundColor: '#9ca3af',
                        },
                      }}
                    >
                      {isLoading ? 'Searching...' : 'Search'}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Table Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card
              sx={{
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
              }}
            >
              <CardHeader
                title={
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.25rem' },
                      fontWeight: 'bold',
                      color: '#1f2937',
                    }}
                  >
                    Attendance & Salary Records
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={2}>
                  {isLoading ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 6,
                      }}
                    >
                      <CircularProgress size={32} />
                    </Box>
                  ) : tableData.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography
                        sx={{
                          color: '#6b7280',
                          fontSize: { xs: '0.875rem', md: '1rem' },
                        }}
                      >
                        No records found. Please select filters and click Search.
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {/* Mobile Card View */}
                      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
                        <Stack spacing={1.5}>
                          {paginatedData.map((record, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <Paper
                                sx={{
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  p: 2,
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                  transition: 'box-shadow 0.2s ease',
                                  '&:hover': {
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                  },
                                }}
                              >
                                <Stack spacing={1.5}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'flex-start',
                                      gap: 1,
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: '0.625rem',
                                          fontWeight: 'bold',
                                          color: '#9ca3af',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        Date
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '0.875rem',
                                          fontWeight: 'bold',
                                          color: '#1f2937',
                                          mt: 0.5,
                                        }}
                                      >
                                        {record.date}
                                      </Typography>
                                    </Box>
                                    <Chip
                                      label={record.status}
                                      size="small"
                                      variant="filled"
                                      sx={{
                                        fontWeight: 'bold',
                                        fontSize: '0.625rem',
                                        backgroundColor:
                                          record.status === 'Present'
                                            ? '#dcfce7'
                                            : record.status === 'Absent'
                                            ? '#fee2e2'
                                            : '#fef3c7',
                                        color:
                                          record.status === 'Present'
                                            ? '#166534'
                                            : record.status === 'Absent'
                                            ? '#991b1b'
                                            : '#92400e',
                                      }}
                                    />
                                  </Box>

                                  <Box sx={{ borderTop: '1px solid #f3f4f6', pt: 1.5 }}>
                                    <Box
                                      sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: 1.5,
                                      }}
                                    >
                                      <Box>
                                        <Typography
                                          sx={{
                                            fontSize: '0.625rem',
                                            fontWeight: 'bold',
                                            color: '#9ca3af',
                                            textTransform: 'uppercase',
                                          }}
                                        >
                                          Check In
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            color: '#1f2937',
                                            mt: 0.5,
                                          }}
                                        >
                                          {record.checkIn}
                                        </Typography>
                                      </Box>

                                      <Box>
                                        <Typography
                                          sx={{
                                            fontSize: '0.625rem',
                                            fontWeight: 'bold',
                                            color: '#9ca3af',
                                            textTransform: 'uppercase',
                                          }}
                                        >
                                          Check Out
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold',
                                            color: '#1f2937',
                                            mt: 0.5,
                                          }}
                                        >
                                          {record.checkOut}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(2, 1fr)',
                                      gap: 1.5,
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: '0.625rem',
                                          fontWeight: 'bold',
                                          color: '#9ca3af',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        Hours
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '0.875rem',
                                          fontWeight: 'bold',
                                          color: '#2563eb',
                                          mt: 0.5,
                                        }}
                                      >
                                        {record.hoursWorked}
                                      </Typography>
                                    </Box>

                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: '0.625rem',
                                          fontWeight: 'bold',
                                          color: '#9ca3af',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        Overtime
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '0.875rem',
                                          fontWeight: 'bold',
                                          color: '#ea580c',
                                          mt: 0.5,
                                        }}
                                      >
                                        {record.overtime}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Box
                                    sx={{
                                      display: 'grid',
                                      gridTemplateColumns: 'repeat(2, 1fr)',
                                      gap: 1.5,
                                    }}
                                  >
                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: '0.625rem',
                                          fontWeight: 'bold',
                                          color: '#9ca3af',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        Daily Pay
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '0.875rem',
                                          fontWeight: 'bold',
                                          color: '#16a34a',
                                          mt: 0.5,
                                        }}
                                      >
                                        {record.dailyPay}
                                      </Typography>
                                    </Box>

                                    <Box>
                                      <Typography
                                        sx={{
                                          fontSize: '0.625rem',
                                          fontWeight: 'bold',
                                          color: '#9ca3af',
                                          textTransform: 'uppercase',
                                        }}
                                      >
                                        OT Pay
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '0.875rem',
                                          fontWeight: 'bold',
                                          color: '#9333ea',
                                          mt: 0.5,
                                        }}
                                      >
                                        {record.otPay}
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Stack>
                              </Paper>
                            </motion.div>
                          ))}
                        </Stack>
                      </Box>

                      {/* Desktop Table View */}
                      <Box sx={{ display: { xs: 'none', lg: 'block' }, overflowX: 'auto' }}>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow
                                sx={{
                                  borderBottom: '2px solid #e5e7eb',
                                  backgroundColor: '#f9fafb',
                                }}
                              >
                                <TableCell
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Date
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Status
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Check In
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Check Out
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Hours Worked
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Overtime
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  Daily Pay
                                </TableCell>
                                <TableCell
                                  sx={{
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    color: '#1f2937',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  OT Pay
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {paginatedData.map((record, idx) => (
                                <TableRow
                                  key={idx}
                                  sx={{
                                    borderBottom: '1px solid #f3f4f6',
                                    '&:hover': {
                                      backgroundColor: '#f9fafb',
                                    },
                                    transition: 'background-color 0.2s ease',
                                  }}
                                >
                                  <TableCell
                                    sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: '500',
                                      color: '#1f2937',
                                    }}
                                  >
                                    {record.date}
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={record.status}
                                      size="small"
                                      variant="filled"
                                      sx={{
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                        backgroundColor:
                                          record.status === 'Present'
                                            ? '#dcfce7'
                                            : record.status === 'Absent'
                                            ? '#fee2e2'
                                            : '#fef3c7',
                                        color:
                                          record.status === 'Present'
                                            ? '#166534'
                                            : record.status === 'Absent'
                                            ? '#991b1b'
                                            : '#92400e',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: '0.875rem',
                                      color: '#1f2937',
                                    }}
                                  >
                                    {record.checkIn}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: '0.875rem',
                                      color: '#1f2937',
                                    }}
                                  >
                                    {record.checkOut}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 'bold',
                                      color: '#2563eb',
                                    }}
                                  >
                                    {record.hoursWorked}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 'bold',
                                      color: '#ea580c',
                                    }}
                                  >
                                    {record.overtime}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 'bold',
                                      color: '#16a34a',
                                    }}
                                  >
                                    {record.dailyPay}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: '0.875rem',
                                      fontWeight: 'bold',
                                      color: '#9333ea',
                                    }}
                                  >
                                    {record.otPay}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>

                      {/* Pagination */}
                      {tableData.length > recordsPerPage && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              pt: { xs: 2, md: 3 },
                            }}
                          >
                            <TablePagination
                              component="div"
                              count={tableData.length}
                              page={page}
                              onPageChange={handleChangePage}
                              rowsPerPage={recordsPerPage}
                              onRowsPerPageChange={() => {}}
                              rowsPerPageOptions={[recordsPerPage]}
                              sx={{
                                '& .MuiTablePagination-toolbar': {
                                  minHeight: 'auto',
                                  p: 0,
                                },
                                '& .MuiTablePagination-selectLabel': {
                                  display: 'none',
                                },
                              }}
                            />
                          </Box>
                        </motion.div>
                      )}
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  )
}

export default DashboardEmployee