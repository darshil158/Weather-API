async function getWeather() {

    const city = document.getElementById("cityInput").value;
    const error = document.getElementById("error");

    error.innerText = "";

    if (!city) {
        error.innerText = "Please Enter a City Name";
        error.style.color = "#ff0000";
        error.style.fontSize = '20px';
        error.style.fontWeight = '700';
        error.style.fontFamily = "'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif";
        return;
    }

    try {
        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
        );

        const geoData = await geoRes.json();

        if (!geoData.results) {
            error.innerText = "City Not Found";
            return;
        }

        const place = geoData.results[0];

        const lat = place.latitude;
        const lon = place.longitude;

        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
        );

        const weatherData = await weatherRes.json();

        const current = weatherData.current;

        document.getElementById("temp").innerText = current.temperature_2m + "°C";

        document.getElementById("city").innerText = `${place.name}, ${place.country}`;

        document.getElementById("humidity").innerText = current.relative_humidity_2m + "%";

        document.getElementById("wind").innerText = current.wind_speed_10m + " km/h";

        document.getElementById("condition").innerText = getWeatherDescription(current.weather_code);

        document.getElementById("weather").style.display = "block";

    }

    catch (err) {
        error.innerText = "ERROR !!!";
        console.log(err);
    }
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Fog",
        51: "Light Drizzle",
        53: "Moderate Drizzle",
        55: "Heavy Drizzle",
        61: "Rain",
        63: "Moderate Rain",
        65: "Heavy Rain",
        66: "Light Freezing Rain",
        67: "Heavy Freezing Rain",
        71: "Light Snow",
        73: "Moderate Snow",
        75: "Heavy Snow",
        80: "Slight Rain Showers",
        81: "Moderate Rain Showers",
        82: "Violent Rain Showers",
        95: "Thunderstorm"
    };

    return weatherCodes[code];
}