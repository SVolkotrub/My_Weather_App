
let code = "a687e5ea475e61b3eb2a5486106b4e28";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric`;
let currentTemperature;
let currentDate = new Date();

const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// -- current-location
function showPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  console.log(latitude);
  console.log(longitude);
    apiUrl = apiUrl + `&lat=${latitude}&lon=${longitude}`;
    console.log(apiUrl);
    axios.get(`${apiUrl}&appid=${code}`).then(showTemperature);
    axios.get(`${apiUrl}&appid=${code}`).then(showCityCountry);
}

function error(err) {
  console.warn(`ERROR(${err.code}):${err.message}`);
}

function currentLocation(event) {
    event.preventDefault();
    console.log('enter function currentLocation');
    navigator.geolocation.getCurrentPosition(showPosition, error);
}
let buttonCurrentLocationElement = document.querySelector("#button-location");
buttonCurrentLocationElement.addEventListener("click", currentLocation);

//---end current location

//-- search

function search(city) {
    console.log('function search is working');
    if (city == false) {
        alert("Empty city is not valid");
    } else {
        axios.get(`${apiUrl}&q=${city}&appid=${code}`).then(showTemperature).catch(function (error) {
       alert('Unfortunately, we cannot find such a city in our database, please check the correct city name or try another city');});
        
    }
}
function handleSubmit(event) {
    event.preventDefault();
    let inputCityElement = document.querySelector("#input-search-city");
    console.log(inputCityElement.value);
    search(inputCityElement.value);
}
let buttonSearchElement = document.querySelector("#search-button");
buttonSearchElement.addEventListener("click", handleSubmit);

//--end search


// --- fill "part with city and time"

function formatDate(timestamp) {
    console.log('start function formatDate');
    let date = new Date(timestamp);
    let headerDayElement = document.querySelector(".current-weekDay-0");
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours < 10) {
    hours = `0${hours}`;} 
    if (minutes < 10) {
        minutes = `0${minutes}`;
    }
    
    headerDayElement.innerHTML = `${week[date.getDay()]}`;
    return ` ${month[date.getMonth()]} ${date.getDate()}, ${hours}:${minutes}`;
}

// ---end  fill "part with city and time"
//--- fill "center part"

function showTemperature(response) {
    console.log(response);
    let temperature = Math.round(response.data.main.temp);
    let temperatureElement = document.querySelector("#current-temperature");
    let descriptionElement = document.querySelector("#temperature-description");
    let temperatureFeelsLike = Math.round(response.data.main.feels_like);
    let temperatureFeelsLikeElement = document.querySelector("#feels-like");
    let humidity = Math.round(response.data.main.humidity);
    let humidityElement = document.querySelector("#hum-current");
    let wind = response.data.wind.speed;
    let windElement = document.querySelector("#wind-current");
    let currentTimeElement = document.querySelector("#locale-time");
    let timestamp = response.data.dt * 1000;         // response.data.dt * 1000;
    let iconElement = document.querySelector("#icon-0");
    let city = response.data.name;
    console.log(city);
    let cityElement = document.querySelector("#city");
    let country = response.data.sys.country;
    let countryElement = document.querySelector("#country");
    
    cityElement.innerHTML = city;
    countryElement.innerHTML = country;
    temperatureElement.innerHTML = temperature;
    descriptionElement.innerHTML = response.data.weather[0].description;
    temperatureFeelsLikeElement.innerHTML = temperatureFeelsLike;
    humidityElement.innerHTML = humidity;
    windElement.innerHTML = wind;
    currentTimeElement.innerHTML = formatDate(timestamp);
    console.log(`data ${timestamp}`);
    iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
    iconElement.setAttribute("alt", `${response.data.weather[0].description}`);
    currentTemperature = temperature;

    linkCelsiusElement.classList.add("active");
    linkFahrElement.classList.remove("active");

    getForecast(response.data.coord);
}
//---end fill "center part"
//-- forecast

function getForecast(coordinates) {
    console.log(coordinates);
    let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${code}`;
    console.log(apiUrlForecast);
    axios.get(apiUrlForecast).then(displayForecast);
}
function formatForecastDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let day = date.getDay();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[day];
}
function formatForecastMonth(timestamp) {
    let date = new Date(timestamp * 1000);
    let monthForecast = date.getMonth();
    return month[monthForecast];
}
function formatForecastDate(timestamp) {
    let date = new Date(timestamp * 1000);
    return date.getDate();
}
function displayForecast(response) {
    const forecast = response.data.daily;
    forecast.length = 5;
    console.log(forecast);
    let forecastElement = document.querySelector("#forecast");

    let forecastHTML = `<div class="card-group forecast border-0">`;
    forecast.forEach(function (forecastDay) {
        forecastHTML += `<div class="col col-forecast">
       
            <div class="card border border-light mb-1 body rounded-3 shadow-lg" style="max-width: 10rem;">
                <div class="card-header text-center bg-transparent border-light">
                    <h5 class="day-forecast">${formatForecastDay(forecastDay.dt)}</h5>
                    <span id="day-forecast-day0-date">${formatForecastDate(forecastDay.dt)}</span>
                    <br>
                    <span class="month-forecast">${formatForecastMonth(forecastDay.dt)}</span>
                    

                </div>

                      <div class="text-center" >
                        <img src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png" alt="Weather image" width ="42" />
                      </div>

                <div class="card-footer text-center bg-transparent border-light">
                   <span class="weather-forecast-temperature-max">${Math.round(forecastDay.temp.max)}°</span> 
                   <br>
                    <span class="weather-forecast-temperature-min">${Math.round(forecastDay.temp.min)}°</span>
                </div>
             </div>
        </div>`;

    })

    forecastHTML += `</div>`;
    forecastElement.innerHTML = forecastHTML;
}




function editDayForecast(date) {
    let i = date.getDay();
    let daysForecastElement = document.querySelectorAll(".day-forecast");
    for (let a = 0; a < daysForecastElement.length; a += 1){
        daysForecastElement[a].innerHTML = `${weekForecast[a + i]}`;
    }

}
editDayForecast(currentDate);

//--- block CONVERT temperature
function convertToFahrenheit(event) {
    event.preventDefault();
    let currentTempElement = document.querySelector("#current-temperature"); 
    linkCelsiusElement.classList.remove("active");
    linkFahrElement.classList.add("active");
    let tempToFahr = Math.round((currentTemperature * 9) / 5 + 32);
    currentTempElement.innerHTML = `${tempToFahr}`;
    
}
function convertToCelsius(event) {
    event.preventDefault();
    linkCelsiusElement.classList.add("active");
    linkFahrElement.classList.remove("active");
    let currentTempElement = document.querySelector("#current-temperature");
    currentTempElement.innerHTML = currentTemperature; 
}
let linkCelsiusElement = document.querySelector("#celsius");
let linkFahrElement = document.querySelector("#fahrenheit");
linkCelsiusElement.addEventListener("click", convertToCelsius);
linkFahrElement.addEventListener("click", convertToFahrenheit);

//---end block CONVERT temperature
 search("Kyiv"); // this string fill data for default city = 'Kyiv'


