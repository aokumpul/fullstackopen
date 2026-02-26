import { useState } from 'react'

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

const Persons = ({filteredPersons}) => {
  return (
    filteredPersons.map(person =>
      <Person key={person.name} person={person}/>
    )
  )
}

const Person = ({person}) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const noteObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(noteObject))
    setNewName('')
    setNewNumber('')
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
      <Persons filteredPersons={filteredPersons} />
    </div>
  )
}

export default App