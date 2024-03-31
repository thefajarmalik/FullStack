const Filter = ({ handleFilterChange }) => {
    return (
        <div>
            filter shown with <input onChange={handleFilterChange}></input>
        </div>
    )
}

export default Filter;