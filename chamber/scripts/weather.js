// scripts/weather.js - Weather API functionality

document.addEventListener('DOMContentLoaded', async function () {
    // Karonga, Malawi coordinates
    const lat = -9.9333;
    const lon = 33.9333;
    const apiKey = 'YOUR_API_KEY_HERE'; // You need to get a free API key from OpenWeatherMap

    // For testing purposes, using placeholder data
    // In production, replace with actual API call

    // Simulated weather data (replace with actual API call)
    const weatherData = {
        current: {
            temp: 28,
            description: "partly cloudy",
            icon: "⛅",
            windSpeed: "12 km/h",
            humidity: 65
        },
        forecast: [
            { day: "Mon", temp: 30 },
            { day: "Tue", temp: 29 },
            { day: "Wed", temp: 27 }
        ]
    };

    displayWeather(weatherData);
});

async function getWeatherData(lat, lon, apiKey) {
    // Actual API implementation
    try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        return {
            current: {
                temp: Math.round(currentData.main.temp),
                description: currentData.weather[0].description,
                icon: getWeatherIcon(currentData.weather[0].icon),
                windSpeed: `${currentData.wind.speed} m/s`,
                humidity: currentData.main.humidity
            },
            forecast: getThreeDayForecast(forecastData)
        };

    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌦️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌈';
}

function getThreeDayForecast(forecastData) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const forecast = [];

    for (let i = 1; i <= 3; i++) {
        const futureDate = new Date(today);
        futureDate.setDate(today.getDate() + i);
        const dayName = days[futureDate.getDay()];

        // Find temperature data for this day (simplified)
        forecast.push({
            day: dayName,
            temp: Math.round(20 + Math.random() * 10) // Replace with actual forecast data
        });
    }

    return forecast;
}

function displayWeather(weatherData) {
    // Current weather
    document.getElementById('current-temp').textContent = `${weatherData.current.temp}°C`;
    document.getElementById('weather-icon').textContent = weatherData.current.icon;
    document.getElementById('weather-desc').textContent = weatherData.current.description;
    document.getElementById('wind-speed').textContent = weatherData.current.windSpeed;
    document.getElementById('humidity').textContent = weatherData.current.humidity;

    // Forecast
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    weatherData.forecast.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day';
        dayElement.innerHTML = `
            <div class="day">${day.day}</div>
            <div class="temp">${day.temp}°C</div>
        `;
        forecastContainer.appendChild(dayElement);
    });
}