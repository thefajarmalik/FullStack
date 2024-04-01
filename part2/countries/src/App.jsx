import { useState, useEffect } from 'react'
import countryService from './services/country'
import axios from 'axios'

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const [message, setMessage] = useState("Too many matches, specify another filter")


  const hook = () => {
    countryService
      .getAll()
      .then(allCountries => {
        setCountries(allCountries)
        setFilteredCountries(allCountries)
      })
  }
  useEffect(hook, [])

  const handleShowButton = (index) => {
    const newArray = filteredCountries.splice(index, 1)
    setFilteredCountries(newArray)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    var filteredList = [...countries]
    filteredList = filteredList.filter(country => country.name.common.toLowerCase().indexOf(event.target.value.toLowerCase()) !== -1)
    setFilteredCountries(filteredList)
    if (filteredList.length > 10) {
      setMessage("Too many matches, specify another filter")
    }
    else {
      setMessage(null)
    }
  }

  return (
    <div>
      <div>
        find countries <input onChange={handleFilterChange}></input>
      </div>
      <Message message={message} />
      <Countries filteredCountries={filteredCountries} handleShowButton={handleShowButton} />
    </div>
  )
}

const Message = ({ message }) => {
  if (message === null) {
    return null
  }
  else {
    return (
      <div>
        {message}
      </div>
    )
  }
}

const Countries = ({ filteredCountries, handleShowButton }) => {
  if (filteredCountries.length > 10) {
    return null
  }
  else if (filteredCountries.length === 1) {
    return (
      <div>
        <Country country={filteredCountries[0]} />
      </div>
    )
  }
  else {

    return (
      <div>
        {filteredCountries.map((country, index) =>
          <p key={index}>{country.name.common}<button onClick={() => handleShowButton(index)}>show</button></p>
        )}
      </div>
    )
  }
}


const Country = ({ country }) => {
  const [weatherData, setWeatherData] = useState([])
  const APIKEY = import.meta.env.VITE_API_KEY

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${APIKEY}`)
      .then(response => {
        setWeatherData(response.data)
      })
  }, [])

  if (weatherData.length < 1) {
    return null
  }
  else {
    const src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`

    return (
      <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages).map((language, index) =>
            <li key={index}>{language}</li>
          )}
        </ul>
        <img src={country.flags.svg} width={200} />
        <h2>Weather in {country.capital[0]}</h2>
        <p>temperature {weatherData.main.temp} Celcius</p>
        <img src={src} width={100} />
        <p>wind {weatherData.wind.speed} m/s</p>

      </div>
    )
  }
}

export default App
