import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({filter, onChange}) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={onChange}/>
    </div>
  )
}

const PersonForm = ({onSubmit, newName, nameOnChange, newNumber, numberOnChange}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={nameOnChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={numberOnChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({filteredPersons, onDelete}) => {
  return (
    filteredPersons.map(person =>
      <Person key={person.id} person={person} onDelete={onDelete} />
    )
  )
}

const Person = ({person, onDelete}) => {
  const handleRemoveClick = () => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      onDelete(person.id) 
    }
  }

  return (
    <p>{person.name} {person.number} <button onClick={handleRemoveClick}>delete</button></p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const personExists = persons.some(person => person.name.toLowerCase() === newName.toLowerCase())

    if (personExists) {
      const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {        
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson ))
            setNewName('')
            setNewNumber('')
          })
      }
      return
    }

    const noteObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(noteObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleDeletePerson = (id) => {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const filteredPersons = persons.filter(
    person => person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm onSubmit={addPerson} newName={newName} nameOnChange={handlePersonChange}
      newNumber={newNumber} numberOnChange={handleNumberChange} />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} onDelete={handleDeletePerson} />
    </div>
  )
}

export default App