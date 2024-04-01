import axios from 'axios'
const baseUrlCountry = 'https://studies.cs.helsinki.fi/restcountries/api'


const getAll = () => {
    const request = axios.get(`${baseUrlCountry}/all`)
    return request.then(response => response.data)
}


export default {
    getAll,
}