import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.payload
    default:
      return state
  }
}

const NotificationContext = createContext()
export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return payload => {
    notificationAndDispatch[1]({ type: 'NOTIFY', payload })
    setTimeout(() => {
      notificationAndDispatch[1]({ type: 'NOTIFY', payload: '' })
    }, 5000)
  }
}
export const NotificationContextProvider = props => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ''
  )

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
