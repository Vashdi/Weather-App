import {
  handleEnterPress,
  handleSearchByCityButtonClick,
  handleSearchByCoordButtonClick,
} from './utils/eventFunctions.js'

import {
  getSearchButton,
  getSearchCityInput,
  getSearchCoordinatesButton,
} from './utils/selectors.js'

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

const containerId = window.weatherContainerId || null
createWeatherAppContainer(containerId)

const searchCityInput = getSearchCityInput()
const searchButton = getSearchButton()
const searchCoordinatesButton = getSearchCoordinatesButton()

searchCityInput.addEventListener('keypress', handleEnterPress)
searchButton.addEventListener('click', handleSearchByCityButtonClick)

searchCoordinatesButton.addEventListener(
  'click',
  handleSearchByCoordButtonClick
)
