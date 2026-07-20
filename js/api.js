// =======================================
// OpenWeather API Configuration
// =======================================

const API_KEY = "f501e280edaddf51cb2fbbdad822adc0";

const GEO_URL =
    "https://api.openweathermap.org/geo/1.0/direct";

const WEATHER_URL =
    "https://api.openweathermap.org/data/2.5/weather";

const FORECAST_URL =
    "https://api.openweathermap.org/data/2.5/forecast";

// =======================================
// Get Coordinates
// =======================================

async function getCoordinates(city) {

    const response = await fetch(

        `${GEO_URL}?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`

    );

    if (!response.ok) {

        throw new Error("Unable to connect to Weather Service.");

    }

    const data = await response.json();

    if (data.length === 0) {

        throw new Error("City not found.");

    }

    return {

        lat: data[0].lat,

        lon: data[0].lon,
        
        name: data[0].name,

    state: data[0].state || "",

    country: data[0].country
    };

}

// =======================================
// Current Weather
// =======================================

async function getCurrentWeather(lat, lon) {

    const response = await fetch(

        `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

    );

    if (!response.ok) {

        throw new Error("Unable to fetch current weather.");

    }

    return await response.json();

}

// =======================================
// Forecast
// =======================================

async function getForecast(lat, lon) {

    const response = await fetch(

        `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`

    );

    if (!response.ok) {

        throw new Error("Unable to fetch forecast.");

    }

    const data = await response.json();

    // Return one forecast around noon for each day
    return data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

}

// =======================================
// Main Function
// =======================================

async function fetchWeather(city) {

    const location = await getCoordinates(city);

    const [current, forecast] = await Promise.all([

        getCurrentWeather(location.lat, location.lon),

        getForecast(location.lat, location.lon)

    ]);

    current.name = location.name;

current.sys.country = location.country;
    return {

        current,

        forecast

    };

}