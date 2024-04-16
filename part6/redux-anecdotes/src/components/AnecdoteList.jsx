import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { notify } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const sortedList = [...state.anecdotes].sort((a, b) => b.votes - a.votes)
    if (state.filter.length > 0) {
      console.log(state.anecdotes)
      let filteredList = [...state.anecdotes].filter(anecdote =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
      )
      return filteredList
    } else {
      return sortedList
    }
  })
  const dispatch = useDispatch()

  const vote = anecdote => {
    dispatch(addVote(anecdote))
    dispatch(notify(`You voted for ${anecdote.content}!`, 5))
  }
  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default AnecdoteList
