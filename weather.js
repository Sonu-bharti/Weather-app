const apiKey = 'Enter Your Api key';

document.querySelector('.search-bar').addEventListener('submit', function (e) {
    e.preventDefault();
    const location = document.querySelector('.search-input').value;
    if (location) {
        getWeatherData(location);
    }
});

async function getWeatherData(location) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
        const data = await response.json();

        if (data.cod === 200) {
            updateWeatherInfo(data);
            updateForecast(data.coord.lat, data.coord.lon);
        } else {
            alert('Location not found');
        }
    } catch (error) {
        console.error('Error fetching the weather data:', error);
    }
}

function updateWeatherInfo(data) {
    document.querySelector('.day').textContent = getDayName();
    document.querySelector('.date').textContent = new Date().toLocaleDateString();
    document.querySelector('.temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.description').textContent = data.weather[0].description;
    document.querySelector('.weather-icon img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    document.querySelector('.detail-item:nth-child(1) .value').textContent = data.name;
    document.querySelector('.detail-item:nth-child(2) .value').textContent = `${Math.round(data.main.temp)}°C`;
    document.querySelector('.detail-item:nth-child(3) .value').textContent = `${data.main.humidity}%`;
    document.querySelector('.detail-item:nth-child(4) .value').textContent = `${data.wind.speed} Km/h`;
}

async function updateForecast(lat, lon) {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=metric&appid=${apiKey}`);
      const data = await response.json();
      console.log('API Response:', data);
  
      if (data.daily && data.daily.length > 4) {
        console.log('Daily Data:', data.daily);
        const forecastItems = document.querySelectorAll('.forecast ul li');
        for (let i = 1; i <= 4; i++) {
          const dayData = data.daily[i];
          const dayElement = forecastItems[i-1];
          const dayName = getDayName(new Date(dayData.dt * 1000).getDay());
          console.log(`Day ${i}:`, dayName, dayData.temp.day);
  
          dayElement.querySelector('span').textContent = dayName;
          dayElement.querySelector('.day-temp').textContent = `${Math.round(dayData.temp.day)}°C`;
          dayElement.querySelector('img').src = `https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`;
        }
      } else {
        console.error('Insufficient data received from the API.');
      }
    } catch (error) {
      console.error('Error fetching the forecast data:', error);
    }
  }


function getDayName(dayIndex = new Date().getDay()) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}
