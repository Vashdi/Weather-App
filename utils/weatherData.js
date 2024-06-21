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

export const getForecastInfo = (forecastDays) =>
  forecastDays.reduce((acc, curr) => {
    const dateName = getDayName(curr.date)
    const { tempText, avgTemp, icon } = getTemperatureInfoByDay(curr.day)

    if (!acc[dateName]) acc[dateName] = []

    acc[dateName].push({ tempText, avgTemp, icon })

    return acc
  }, {})
