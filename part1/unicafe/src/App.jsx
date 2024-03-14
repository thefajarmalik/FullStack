import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.number}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const all = () => {
    return (props.good + props.neutral + props.bad)
  }
  const average = () => {
    return ((props.good - props.bad) / (props.good + props.neutral + props.bad))
  }
  const positive = () => {
    return ((props.good / (props.good + props.neutral + props.bad) * 100) + "%")
  }
  if (props.good > 0 || props.neutral > 0 || props.bad > 0) {
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text="good" number={props.good} />
            <StatisticLine text="neutral" number={props.neutral} />
            <StatisticLine text="bad" number={props.bad} />
            <StatisticLine text="all" number={all()} />
            <StatisticLine text="average" number={average()} />
            <StatisticLine text="positive" number={positive()} />
          </tbody>

        </table>
      </div>
    )
  }
  else {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text="good" onClick={() => setGood(good + 1)} />
      <Button text="neutral" onClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" onClick={() => setBad(bad + 1)} />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App