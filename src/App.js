
let code = "a687e5ea475e61b3eb2a5486106b4e28";
let city = "Kyiv";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
let currentTemperature;

function showTemperature(response) {
    console.log(response);
    let temperature = Math.round(response.data.main.temp);
    let temperatureElement = document.querySelector("#current-temperature");
    temperatureElement.innerHTML = temperature;
    let descriptionElement = document.querySelector("#temperature-description");
    descriptionElement.innerHTML = response.data.weather[0].description;
    let temperatureFeelsLike = Math.round(response.data.main.feels_like);
    let temperatureFeelsLikeElement = document.querySelector("#feels-like");
    temperatureFeelsLikeElement.innerHTML = temperatureFeelsLike;
    let humidity = Math.round(response.data.main.humidity);
    let humidityElement = document.querySelector("#hum-current");
    humidityElement.innerHTML = humidity;
    let wind = response.data.wind.speed;
    let windElement = document.querySelector("#wind-current");
    windElement.innerHTML = wind;
    currentTemperature = temperature;
}
axios.get(`${apiUrl}&appid=${code}`).then(showTemperature);


let currentDate = new Date();

const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekForecast = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(date) {
    let currentMonth = date.getMonth();
    let hours = date.getHours();
    if (hours < 10) {
    hours = `0${hours}`;}
    let minutes = date.getMinutes();
    if (minutes < 10) {
    minutes = `0${minutes}`;}
    return ` ${month[currentMonth]} ${date.getDate()}, ${hours}:${minutes}`;
}

let currentTimeElement = document.querySelector("#locale-time");
currentTimeElement.innerHTML = formatDate(currentDate);


function showDay(date) {    
    let weekday = date.getDay();
    return `${week[weekday]}`;
}

let headerDayElement = document.querySelector(".current-weekDay-0");
headerDayElement.innerHTML = showDay(currentDate);

function editDayForecast(date) {
    let i = date.getDay();
    let daysForecastElement = document.querySelectorAll(".day-forecast");
    for (let a = 0; a < daysForecastElement.length; a += 1){
        daysForecastElement[a].innerHTML = `${weekForecast[a + i]}`;
    }

}
editDayForecast(currentDate);

function convertToFahrenheit(event) {
    event.preventDefault();
    let currentTempElement = document.querySelector("#current-temperature"); 
    let tempToFahr = Math.round((currentTemperature * 9) / 5 + 32);
    currentTempElement.innerHTML = `${tempToFahr}`;
    
}


function convertToCelsius(event) {
    event.preventDefault();
    let currentTempElement = document.querySelector("#current-temperature");
    currentTempElement.innerHTML = currentTemperature; 
}


let linkCelsiusElement = document.querySelector("#celsius");
let linkFahrElement = document.querySelector("#fahrenheit");
linkCelsiusElement.addEventListener("click", convertToCelsius);
linkFahrElement.addEventListener("click", convertToFahrenheit);


function showCity(event) {
    event.preventDefault();
    let inputCityElement = document.querySelector("#input-search-city");
    
    if (inputCityElement.value == false) {
        alert("Empty city is not valid");
    } else {
        let headerCityElement = document.querySelector("#city");
        headerCityElement.innerHTML = inputCityElement.value;
    }
}
let searchElement = document.querySelector("#search-form");
searchElement.addEventListener("submit", showCity);


