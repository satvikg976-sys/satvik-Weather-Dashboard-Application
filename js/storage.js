// =======================================
// Local Storage Configuration
// =======================================

const STORAGE_KEY = "weather_dashboard_last_city";

// =======================================
// Save Last Searched City
// =======================================

function saveLastCity(city) {

    if (!city) return;

    try {

        localStorage.setItem(STORAGE_KEY, city);

    }

    catch (error) {

        console.error("Unable to save city:", error);

    }

}

// =======================================
// Get Last Searched City
// =======================================

function getLastCity() {

    try {

        const city = localStorage.getItem(STORAGE_KEY);

        return city ? city : "Tirupati";

    }

    catch (error) {

        console.error("Unable to retrieve city:", error);

        return "Tirupati";

    }

}

// =======================================
// Clear Saved City
// =======================================

function clearLastCity() {

    try {

        localStorage.removeItem(STORAGE_KEY);

    }

    catch (error) {

        console.error("Unable to clear saved city:", error);

    }

}

// =======================================
// Check Local Storage Support
// =======================================

function isStorageSupported() {

    try {

        const test = "__storage_test__";

        localStorage.setItem(test, test);

        localStorage.removeItem(test);

        return true;

    }

    catch (error) {

        return false;

    }

}

// =======================================
// Initialize Storage
// =======================================

if (!isStorageSupported()) {

    console.warn("Local Storage is not supported in this browser.");

}