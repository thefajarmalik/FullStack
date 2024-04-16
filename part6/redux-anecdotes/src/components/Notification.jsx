import { useSelector } from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const notification = useSelector(state => {
    return state.notification
  })
  if (!notification) {
    return null
  } else {
    return <div style={style}>{notification}</div>
  }
}

export default Notification
