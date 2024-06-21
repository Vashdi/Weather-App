import {
  getCardsContainer,
  getLatInput,
  getLongInput,
  getSearchButton,
  getSearchCityInput,
} from './selectors.js'

import { getForecastInfo } from './weatherData.js'

const NUM_OF_DAYS = 14
const API_KEY = '366b27f647664957a31172815241906'
const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&days=${NUM_OF_DAYS}`

const createClassNameElement = (elementString, className) => {
  const element = document.createElement(elementString)
  element.className = className

  return element
}

const getAvgTemp = (temperatures) => {
  const sum = temperatures.reduce((acc, curr) => curr.avgTemp + acc, 0)
  return (sum / temperatures.length).toFixed(2)
}

const createTemperatureCard = (texts, temperature) => {
  const div = document.createElement('div')
  const text = document.createElement('p')
  const icon = document.createElement('img')

  text.textContent = temperature.tempText
  icon.src = `https:${temperature.icon}`
  icon.alt = '-'

  div.appendChild(icon)
  div.appendChild(text)

  texts.appendChild(div)
}

const createTextsDiv = (texts, temperatures) => {
  temperatures.forEach((temperature) => {
    createTemperatureCard(texts, temperature)
  })
}

const fetchWeatherData = async (params) => {
  try {
    const response = await fetch(`${url}&q=${params}`)
    const data = await response.json()

    if (data.error) throw Error(data.error)

    const forecastDays = data.forecast?.forecastday

    if (!forecastDays) throw Error('Bad Request')

    return forecastDays
  } catch (err) {
    console.error(err.message)
  }
}

const createCardsElements = (forecasts) => {
  const cardsContainer = getCardsContainer()

  Object.entries(forecasts).forEach(([dayName, temperatures]) => {
    const card = createClassNameElement('div', 'weather-card')
    const title = createClassNameElement('div', 'weather-title')
    const texts = createClassNameElement('div', 'weather-text')
    const tempAvg = createClassNameElement('div', 'weather-temp')

    title.textContent = dayName
    createTextsDiv(texts, temperatures)
    tempAvg.textContent = getAvgTemp(temperatures)

    card.appendChild(title)
    card.appendChild(texts)
    card.appendChild(tempAvg)

    cardsContainer.appendChild(card)
  })
}

const resetCoordinates = () => {
  const latInput = getLatInput()
  const longInput = getLongInput()

  latInput.value = null
  longInput.value = null

  latInput.classList.remove('error-border')
  longInput.classList.remove('error-border')
}

const resetCityName = () => {
  const searchCityInput = getSearchCityInput()

  searchCityInput.value = null
  searchCityInput.classList.remove('error-border')
}

export const handleSearchByCoordButtonClick = async () => {
  const latInput = getLatInput()
  const longInput = getLongInput()
  const cardsContainer = getCardsContainer()

  cardsContainer.innerHTML = ''

  const latValue = latInput.value
  const longValue = longInput.value

  if (!latValue || !longValue) {
    longInput.classList.add('error-border')
    latInput.classList.add('error-border')
    return
  } else {
    latInput.classList.remove('error-border')
    longInput.classList.remove('error-border')
  }

  const params = [latValue, longValue].join(',')
  const forecastDays = await fetchWeatherData(params)
  const forecastInfoByDay = getForecastInfo(forecastDays)
  resetCityName()
  createCardsElements(forecastInfoByDay)
}

export const handleEnterPress = (event) => {
  const searchButton = getSearchButton()

  if (event.key === 'Enter') {
    event.preventDefault()
    searchButton.click()
  }
}

export const handleSearchByCityButtonClick = async () => {
  const cardsContainer = getCardsContainer()
  const searchCityInput = getSearchCityInput()

  cardsContainer.innerHTML = ''

  const searchCityInputValue = searchCityInput.value

  if (!searchCityInputValue) {
    searchCityInput.classList.add('error-border')
    return
  } else {
    searchCityInput.classList.remove('error-border')
  }

  const forecastDays = await fetchWeatherData(searchCityInput.value)
  const forecastInfoByDay = getForecastInfo(forecastDays)

  resetCoordinates()
  createCardsElements(forecastInfoByDay)
}
