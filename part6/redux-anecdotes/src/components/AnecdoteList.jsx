import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    console.log(state.filter)
    const sortedList = state.anecdotes.sort((a, b) => b.votes - a.votes)
    if (state.filter.length > 0) {
      console.log(state.anecdotes)
      let filteredList = state.anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
      )
      return filteredList
    } else {
      return sortedList
    }
  })
  const dispatch = useDispatch()

  const vote = id => {
    dispatch(addVote(id))
  }
  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default AnecdoteList
