// =======================================
// DOM Elements
// =======================================

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loader = document.getElementById("loader");
const errorBox = document.getElementById("error");
const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const todayDate = document.getElementById("todayDate");

const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const visibility = document.getElementById("visibility");

const forecastContainer = document.getElementById("forecast");

// =======================================
// Loader
// =======================================

function showLoader() {

    loader.style.display = "block";

    weatherCard.style.display = "none";

    errorBox.style.display = "none";

}

function hideLoader() {

    loader.style.display = "none";

}

// =======================================
// Error
// =======================================

function showError(message) {

    errorBox.textContent = message;

    errorBox.style.display = "block";

}

function hideError() {

    errorBox.style.display = "none";

}

// =======================================
// Date
// =======================================

function getTodayDate() {

    return new Date().toLocaleDateString("en-US", {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

    });

}

// =======================================
// Display Current Weather
// =======================================

function displayCurrentWeather(data) {

    cityName.textContent =
        `${data.name}, ${data.sys.country}`;

    todayDate.textContent =
        getTodayDate();

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;

    description.textContent =
        data.weather[0].description;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    humidity.textContent =
        `${data.main.humidity}%`;

    wind.textContent =
        `${data.wind.speed} m/s`;

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;

    visibility.textContent =
        `${(data.visibility / 1000).toFixed(1)} km`;

    weatherCard.style.display = "grid";

}
// =======================================
// Create Forecast Card
// =======================================

function createForecastCard(day) {

    const date = new Date(day.dt_txt);

    const dayName = date.toLocaleDateString("en-US", {
        weekday: "short"
    });

    return `

        <div class="forecast-card">

            <h3>${dayName}</h3>

            <img
                src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"
                alt="${day.weather[0].description}"
            >

            <h2>${Math.round(day.main.temp)}°C</h2>

            <p>${day.weather[0].description}</p>

            <small>

                H: ${Math.round(day.main.temp_max)}°

                |

                L: ${Math.round(day.main.temp_min)}°

            </small>

        </div>

    `;

}

// =======================================
// Display Forecast
// =======================================

function displayForecast(forecastData) {

    forecastContainer.innerHTML = "";

    forecastData.forEach(day => {

        forecastContainer.innerHTML +=
            createForecastCard(day);

    });

}

// =======================================
// Search Weather
// =======================================

async function searchWeather(city) {

    if (city.trim() === "") {

        showError("Please enter a city name.");

        return;

    }

    showLoader();

    hideError();

    try {

        const weather = await fetchWeather(city);

        displayCurrentWeather(weather.current);

        displayForecast(weather.forecast);

        saveLastCity(city);

    }

    catch (err) {

        showError(err.message);

    }

    finally {

        hideLoader();

    }

}

// =======================================
// Search Button
// =======================================

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    searchWeather(city);

});

// =======================================
// Enter Key
// =======================================

cityInput.addEventListener("keypress", event => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});

// =======================================
// Load Last City
// =======================================

window.addEventListener("DOMContentLoaded", () => {

    const lastCity = getLastCity();

    cityInput.value = lastCity;

    searchWeather(lastCity);

});