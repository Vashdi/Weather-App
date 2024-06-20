const NUM_OF_DAYS = 14
const API_KEY = '366b27f647664957a31172815241906'
const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&days=${NUM_OF_DAYS}`

const createWeatherAppContainer = (containerId) => {
  const container = containerId
    ? document.getElementById(containerId)
    : document.createElement('div')
  if (!containerId) {
    document.body.appendChild(container)
  }

  container.className = 'container'
  container.innerHTML = `
          <h1 class="title">Weather App</h1>
            <div class="search-containers">
              <div class="search-city">
              <input id="city-input" type="text" placeholder="Enter City Name" />
              <button>Search</button>
          </div>
    
          <div class="search-coordinates">
            <input id="lat" type="text" placeholder="Latitude" />
            <input id="long" type="text" placeholder="Longitude" />
            <button>Search</button>
          </div>
    
          <div id="cards-container" class="cards-container"></div>
        </div>        
        `
}

const createClassNameElement = (elementString, className) => {
  const element = document.createElement(elementString)
  element.className = className

  return element
}

const getDayName = (dateString) => {
  const date = new Date(dateString)
  const options = { weekday: 'short' }
  const shortDayName = date.toLocaleDateString('en-US', options)

  return shortDayName
}

const getTemperatureInfoByDay = (day) => {
  const { text, icon } = day.condition

  return {
    icon,
    tempText: text,
    avgTemp: day.avgtemp_c,
  }
}

const getForecastInfo = (forecastDays) =>
  forecastDays.reduce((acc, curr) => {
    const dateName = getDayName(curr.date)
    const { tempText, avgTemp, icon } = getTemperatureInfoByDay(curr.day)

    if (!acc[dateName]) acc[dateName] = []

    acc[dateName].push({ tempText, avgTemp, icon })

    return acc
  }, {})

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

const resetCoordinates = () => {
  const latInput = document.querySelector('#lat')
  const longInput = document.querySelector('#long')

  latInput.value = null
  longInput.value = null

  latInput.classList.remove('error-border')
  longInput.classList.remove('error-border')
}

const resetCityName = () => {
  const searchCityInput = document.querySelector('.search-city input')

  searchCityInput.value = null
  searchCityInput.classList.remove('error-border')
}

const getAvgTemp = (temperatures) => {
  const sum = temperatures.reduce((acc, curr) => curr.avgTemp + acc, 0)
  return (sum / temperatures.length).toFixed(2)
}

const createTextsDiv = (texts, temperatures) => {
  temperatures.forEach((temperature) => {
    const div = document.createElement('div')
    const text = document.createElement('p')
    const icon = document.createElement('img')

    text.textContent = temperature.tempText
    icon.src = `https:${temperature.icon}`
    icon.alt = '-'

    div.appendChild(icon)
    div.appendChild(text)

    texts.appendChild(div)
  })
}

const createCardsElements = (forecasts) => {
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

const containerId = window.weatherContainerId || null
createWeatherAppContainer(containerId)

const cardsContainer = document.querySelector('#cards-container')
const searchButton = document.querySelector('.search-city button')
const searchCityInput = document.querySelector('.search-city input')

const handleEnterPress = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    searchButton.click()
  }
}

const handleSearchByCityButtonClick = async () => {
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

searchCityInput.addEventListener('keypress', handleEnterPress)
searchButton.addEventListener('click', handleSearchByCityButtonClick)

const searchCoordinatesButton = document.querySelector(
  '.search-coordinates button'
)

const handleSearchByCoordButtonClick = async () => {
  cardsContainer.innerHTML = ''

  const latInput = document.querySelector('#lat')
  const longInput = document.querySelector('#long')

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

searchCoordinatesButton.addEventListener(
  'click',
  handleSearchByCoordButtonClick
)
