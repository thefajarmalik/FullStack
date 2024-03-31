import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/person'
import Notification from './components/Notification'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  const hook = () => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
        setFilteredPersons(initialPersons)
      })
  }
  useEffect(hook, [])



  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    const found = persons.some(person => person.name === newName)
    if (found) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const existingPerson = persons.find(person => person.name === newName)
        personService.update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setFilteredPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage(
              `Updated ${newName}`
            )

            setError(false)
            setTimeout(() => {
              setMessage(null)
            }, 5000)

          })
      }
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setFilteredPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')

          setMessage(
            `Added ${newName}`
          )
          setError(false)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    const person = filteredPersons.find(person => person.id === id)
    if (window.confirm(`Delete '${person.name}'?`)) {
      personService
        .deletePerson(id)
        .then(setFilteredPersons(persons.filter(person => person.id !== id)))
        .catch(error => {
          setMessage(`Information of ${person.name} has already been removed from server`)
          setError(true)
          setTimeout(() => {
            setMessage(null)
          }, 5000)

        })
    }
  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
    var filteredList = [...persons]
    filteredList = filteredList.filter(person => person.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1)
    setFilteredPersons(filteredList)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error}/>

      <Filter handleFilterChange={handleFilterChange} filter={filter} />

      <h2>Add a new contact</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App