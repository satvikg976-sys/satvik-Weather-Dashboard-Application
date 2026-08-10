// =======================================
// DOM Elements
// =======================================

const cityInput =
    document.getElementById("cityInput");

const searchBtn =
    document.getElementById("searchBtn");

const loader =
    document.getElementById("loader");

const errorBox =
    document.getElementById("error");

const weatherCard =
    document.getElementById("weatherCard");

const cityName =
    document.getElementById("cityName");

const todayDate =
    document.getElementById("todayDate");

const weatherIcon =
    document.getElementById("weatherIcon");

const temperature =
    document.getElementById("temperature");

const description =
    document.getElementById("description");

const humidity =
    document.getElementById("humidity");

const wind =
    document.getElementById("wind");

const feelsLike =
    document.getElementById("feelsLike");

const visibility =
    document.getElementById("visibility");

const forecastContainer =
    document.getElementById("forecast");


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

    return new Date().toLocaleDateString(
        "en-US",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


// =======================================
// Display Current Weather
// =======================================

function displayCurrentWeather(data, location) {

    // ===================================
    // Location
    // ===================================

    let displayLocation =
        location.name;

    if (location.state) {

        displayLocation +=
            `, ${location.state}`;
    }

    displayLocation +=
        `, ${location.country}`;

    cityName.textContent =
        displayLocation;


    // ===================================
    // Date
    // ===================================

    todayDate.textContent =
        getTodayDate();


    // ===================================
    // Temperature
    // ===================================

    temperature.textContent =
        `${Math.round(data.main.temp)}°C`;


    // ===================================
    // Description
    // ===================================

    description.textContent =
        data.weather[0].description;


    // ===================================
    // Weather Icon
    // ===================================

    const iconCode =
        data.weather[0].icon;

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    weatherIcon.alt =
        data.weather[0].description;

    // Fallback if icon cannot load
    weatherIcon.onerror = function () {

        this.onerror = null;

        this.src =
            `https://openweathermap.org/img/wn/02d@4x.png`;
    };


    // ===================================
    // Humidity
    // ===================================

    humidity.textContent =
        `${data.main.humidity}%`;


    // ===================================
    // Wind
    // ===================================

    wind.textContent =
        `${data.wind.speed} m/s`;


    // ===================================
    // Feels Like
    // ===================================

    feelsLike.textContent =
        `${Math.round(data.main.feels_like)}°C`;


    // ===================================
    // Visibility
    // ===================================

    visibility.textContent =
        `${(data.visibility / 1000).toFixed(1)} km`;


    // ===================================
    // Show Card
    // ===================================

    weatherCard.style.display = "grid";
}


// =======================================
// Create Forecast Card
// =======================================

function createForecastCard(day) {

    const date =
        new Date(day.dt_txt);

    const dayName =
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "short"
            }
        );

    const iconCode =
        day.weather[0].icon;

    return `

        <div class="forecast-card">

            <h3>${dayName}</h3>

            <img
                src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
                alt="${day.weather[0].description}"
                onerror="this.style.display='none';"
            >

            <h2>
                ${Math.round(day.main.temp)}°C
            </h2>

            <p>
                ${day.weather[0].description}
            </p>

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

    city = city.trim();


    // ===================================
    // Validate Input
    // ===================================

    if (city === "") {

        showError(
            "Please enter a location."
        );

        return;
    }


    // ===================================
    // Show Loading
    // ===================================

    showLoader();

    hideError();


    try {

        // =================================
        // Get New Weather Data
        // =================================

        const weather =
            await fetchWeather(city);


        // =================================
        // Display New Location
        // =================================

        displayCurrentWeather(
            weather.current,
            weather.location
        );


        // =================================
        // Display Forecast
        // =================================

        displayForecast(
            weather.forecast
        );


        // =================================
        // Save EXACT Search
        // =================================

        saveLastCity(city);


    } catch (err) {

        showError(
            err.message ||
            "Unable to fetch weather information."
        );

    } finally {

        hideLoader();

    }
}


// =======================================
// Search Button
// =======================================

searchBtn.addEventListener(
    "click",
    () => {

        const city =
            cityInput.value.trim();

        searchWeather(city);

    }
);


// =======================================
// Enter Key
// =======================================

cityInput.addEventListener(
    "keypress",
    event => {

        if (event.key === "Enter") {

            event.preventDefault();

            searchBtn.click();
        }

    }
);


// =======================================
// Load Last City
// =======================================

window.addEventListener(
    "DOMContentLoaded",
    () => {

        const lastCity =
            getLastCity();

        // Only load a previous location
        // if one actually exists.

        if (lastCity) {

            cityInput.value =
                lastCity;

            searchWeather(
                lastCity
            );
        }

    }
);
