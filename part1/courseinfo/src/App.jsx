const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part part={props.contents[0]} />
      <Part part={props.contents[1]} />
      <Part part={props.contents[2]} />
    </div>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>{props.part.name} {props.part.exercises}</p>
    </div>
  )
}



const Total = (props) => {
  return (
    <div>
      <p>Number of exercises {props.contents[0].exercises + props.contents[1].exercises + props.contents[2].exercises}</p>
    </div>
  )
}


const App = () => {
  const course = 'Half Stack application development'
  const contents = [
    {
      name: "Fundamentals of React",
      exercises: 10
    },
    {
      name: "Using props to pass data",
      exercises: 7
    },
    {
      name: "State of a component",
      exercises: 14
    },
  ]
  return (
    <div>
      <Header course={course} />
      <Content contents={contents} />
      <Total contents={contents} />
    </div>
  )
}

export default App