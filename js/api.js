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

    const url =
        `${GEO_URL}?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`;

    console.log("Geocoding URL:", url);

    const response = await fetch(url);

    console.log("API Status:", response.status);

    if (!response.ok) {

        const errorData = await response.text();

        console.error("OpenWeather Error:", errorData);

        throw new Error(
            `Weather Service Error: ${response.status}`
        );
    }

    const data = await response.json();

    console.log("Location Data:", data);

    if (!data || data.length === 0) {

        throw new Error(
            "Location not found. Please check the place name."
        );
    }

    const place = data[0];

    return {
        lat: place.lat,
        lon: place.lon,
        name: place.name,
        state: place.state || "",
        country: place.country || ""
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

    // Get one forecast around noon for each day
    return data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );
}


// =======================================
// Main Weather Function
// =======================================

async function fetchWeather(city) {

    // First find the exact location
    const location = await getCoordinates(city);

    // Then get weather using latitude and longitude
    const [current, forecast] = await Promise.all([

        getCurrentWeather(
            location.lat,
            location.lon
        ),

        getForecast(
            location.lat,
            location.lon
        )

    ]);

    // IMPORTANT:
    // Use the location selected from the search,
    // not the name returned by the weather API.
    current.name = location.name;
    current.state = location.state;
    current.sys.country = location.country;

    return {
        current,
        forecast,
        location
    };
}
