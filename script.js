const apiKey = "7YLTWMP2M6ATGGSEK9PE5TVXB";



const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
        themeBtn.innerHTML = "🌙 Dark Mode";
    } else {
        themeBtn.innerHTML = "☀ Light Mode";
    }
});



setInterval(() => {
    document.getElementById("clock").innerHTML =
        new Date().toLocaleTimeString();
}, 1000);

// Enter Key Search

document.getElementById("city")
.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getWeather();
    }
});


function displayWeather(data) {

    document.getElementById("cityName").innerHTML =
        data.resolvedAddress;

    document.getElementById("temp").innerHTML =
        `${Math.round(data.currentConditions.temp)}°C`;

    document.getElementById("description").innerHTML =
        data.currentConditions.conditions;

    document.getElementById("humidity").innerHTML =
        `${data.currentConditions.humidity}%`;

    document.getElementById("wind").innerHTML =
        `${data.currentConditions.windspeed} km/h`;

    document.getElementById("pressure").innerHTML =
        `${data.currentConditions.pressure}`;

    document.getElementById("icon").style.display = "none";

    updateExtraInfo(data);
}


function updateExtraInfo(data) {

    document.getElementById("sunrise").innerHTML =
        `🌅 Sunrise<br>${data.currentConditions.sunrise}`;

    document.getElementById("sunset").innerHTML =
        `🌇 Sunset<br>${data.currentConditions.sunset}`;

    document.getElementById("feelsLike").innerHTML =
        `🌡 Feels Like<br>${Math.round(data.currentConditions.feelslike)}°C`;

    document.getElementById("uvIndex").innerHTML =
        `☀ UV Index<br>${data.currentConditions.uvindex}`;

    document.getElementById("airQuality").innerHTML =
        `🌬 Conditions<br>${data.currentConditions.conditions}`;
}

// 24 Hour Forecast

function render24HourForecast(data) {

    const hourly =
        document.getElementById("hourlyForecast");

    hourly.innerHTML = "";

    data.days[0].hours.slice(0, 24).forEach(hour => {

        hourly.innerHTML += `
        <div class="hour-card">
            <p>${hour.datetime}</p>
            <h3>${Math.round(hour.temp)}°C</h3>
            <p>${hour.conditions}</p>
        </div>
        `;
    });
}

// 7 Day Forecast

let visualForecast = [];

function renderDailyForecast(data) {

    const daily =
        document.getElementById("dailyForecast");

    daily.innerHTML = "";

    visualForecast = data.days;

    data.days.slice(0, 7).forEach(day => {

        daily.innerHTML += `
        <div class="day-card"
             onclick="showDayWeather('${day.datetime}')">

            <h4>
            ${new Date(day.datetime)
                .toLocaleDateString('en-US', {
                    weekday: 'short'
                })}
            </h4>

            <h3>${Math.round(day.temp)}°C</h3>

            <p>${day.conditions}</p>

        </div>
        `;
    });

    showDayWeather(data.days[0].datetime);
}

// Selected Day Details

function showDayWeather(date) {

    const container =
        document.getElementById("selectedDayForecast");

    container.innerHTML = "";

    const day =
        visualForecast.find(d => d.datetime === date);

    if (!day) return;

    day.hours.forEach(hour => {

        container.innerHTML += `
        <div class="detail-card">
            <p>${hour.datetime}</p>
            <h4>${Math.round(hour.temp)}°C</h4>
            <p>${hour.conditions}</p>
        </div>
        `;
    });
}

// Search Date

function searchForecastDate() {

    const selectedDate =
        document.getElementById("forecastDate").value;

    const result =
        document.getElementById("dateWeatherResult");

    if (!selectedDate) {
        result.innerHTML =
            "<p>Please select a date</p>";
        return;
    }

    const day =
        visualForecast.find(
            d => d.datetime === selectedDate
        );

    if (day) {

        result.innerHTML = `
        <div class="detail-card">
            <h3>${day.datetime}</h3>
            <p>🌡 Temperature: ${Math.round(day.temp)}°C</p>
            <p>☁ ${day.conditions}</p>
            <p>💧 Humidity: ${day.humidity}%</p>
        </div>
        `;

    } else {

        result.innerHTML =
            "<p>Date not available in forecast</p>";
    }
}

// Search Weather

async function getWeather() {

    const city =
        document.getElementById("city").value.trim();

    if (city === "") {
        alert("Enter City Name");
        return;
    }

    const loader =
        document.getElementById("loader");

    loader.style.display = "block";

    try {

        const response =
            await fetch(
                `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`
            );

        const data =
            await response.json();

        loader.style.display = "none";

        displayWeather(data);

        render24HourForecast(data);

        renderDailyForecast(data);

    } catch (error) {

        loader.style.display = "none";

        alert("Error Loading Weather");
    }
}

// Location Weather

function getLocationWeather() {

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const lat =
                position.coords.latitude;

            const lon =
                position.coords.longitude;

            const response =
                await fetch(
                    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${apiKey}&contentType=json`
                );

            const data =
                await response.json();

            displayWeather(data);

            render24HourForecast(data);

            renderDailyForecast(data);
        }

    );
}



window.onload = () => {

    document.getElementById("city").value = "Delhi";

    getWeather();
};
