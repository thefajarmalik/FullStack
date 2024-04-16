import { createSlice, current } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationChange (state, action) {
      return action.payload
    }
  }
})

export const notify = content => {
  return async dispatch => {
    dispatch(notificationChange(content))
    setTimeout(() => {
      dispatch(notificationChange(''))
    }, 5000)
  }
}
export const { notificationChange } = notificationSlice.actions
export default notificationSlice.reducer
