const Header = (props) => {
    return (
      <div>
        <h2>{props.course.name}</h2>
      </div>
    )
  }
  
  const Content = (props) => {
    return (
      <div>
        {props.parts.map(part => <Part key={part.id} part={part} />)}
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
    const total = props.parts.reduce((acc, curr) =>
      acc + curr.exercises, 0)
    return (
  
      <div>
        <b>total of {total} exercises</b>
      </div>
    )
  }
  
  const Course = (props) => {
    return (
      <div>
        <Header course={props.course} />
        <Content parts={props.course.parts} />
        <Total parts={props.course.parts} />
      </div>
    )
  }

export default Course;