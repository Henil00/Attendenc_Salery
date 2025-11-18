import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { 
    value: 0,
    role: null,
  },
  reducers: {
    increment: (state) => { 
      state.value += 1 
    },
    decrement: (state) => { 
      state.value -= 1 
    },
    setRole: (state, action) => {
      state.role = action.payload
    },
    clearRole: (state) => {
      state.role = null
    },
  },
})




export const { increment, decrement, setRole, clearRole } = counterSlice.actions
export default counterSlice.reducer
