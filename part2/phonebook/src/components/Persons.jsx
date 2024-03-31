const Persons = ({ filteredPersons, deletePerson }) => {
    return (
        <div>
            <ul>
                {filteredPersons.map(person =>
                    <p key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></p>
                )}
            </ul>
        </div>
    )
}

export default Persons