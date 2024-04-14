var APIkey = `cb8d3a328e6b7aa47d98d6e678c6df07`;
var selectedCity = ``;
var todayDate = moment().format(`L`);

var savedCities = JSON.parse(localStorage.getItem(`city`)) || [];

init(savedCities);
//event handlers :
//search button
$(`#citySubmit`).on(`click`, function () {
  var selectedCity = $("#city").val().trim();

  getWeatherToday(selectedCity);
  getForecast(selectedCity);

});
//saved cities as buttons
$(document).on("click", "#savedCitySubmit", function () {
  var archiveCity = $(this).text();
  getWeatherToday(archiveCity);
  getForecast(archiveCity);
});
//provided a clear history and refresh page button
$(`#clear`).on("click", function () {
  localStorage.clear();
  searchHistory = [];
  window.location.reload("Refresh");
});

function getWeatherToday(selectedCity) {
  //use user input to make API call for rendering curent date weather info
  var weatherRequest = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=imperial&appid=${APIkey}`;
  $.ajax({
    url: weatherRequest,
    method: `GET`,
  }).then(function (weatherData) {
    console.log(weatherData); //using object retrieved from API render weather info onto page
   
  if (!savedCities.includes(selectedCity.toUpperCase())) {
    savedCities.push(selectedCity.toUpperCase()); //if city entered is not in savedcities array, it will be added to array
    var cityArchiveEl = `     
        <button type="button" class="btn btn-info mt-1" id="savedCitySubmit" city-data="${selectedCity}">${selectedCity.toUpperCase()}</button>`;
    $(`#cityArchive`).append(cityArchiveEl);
  }
  localStorage.setItem("city", JSON.stringify(savedCities));
    $(`#today`).empty();
    var todayEl = ` 
        <div class="card shadow h-100">

            <div class="card-header d-flex justify-content-between align-items-center" id="selectedCityName">
                <h2> ${weatherData.name}</h2>
                <p>${todayDate} </p>
            </div>  

         <ul class="card-body list d-flex flex-column align-items-center">
         <li class="w-75">
         <div class="d-flex justify-content-between ">
            <p class="fw-bold fs2">Condition:</p> 
           <p> ${weatherData.weather[0].description}</p>
           </div>
         </li>
         <li>
          <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}">
         </li>   
          <li class="w-75">
         <div class="d-flex justify-content-between">
         
         <p class="fw-bold fs2">Temperature: </p>
         <p>${weatherData.main.temp}°F</p></div>

          </li>

          <li class="w-75">
         <div class="d-flex justify-content-between">
         
         <p class="fw-bold fs2">Humidity: </p>
         <p>${weatherData.main.humidity}%</p></div>

          </li>
          <li class="w-75">
         <div class="d-flex justify-content-between">
         <p class="fw-bold fs2">Wind Speed: </p>
         <p>${weatherData.wind.speed} mph</p></div>

          </li>

         </ul>
        </div>`;
    $(`#today`).append(todayEl);
  }).fail(() => {
    $('#today')
    .empty()
    .append('<div class="card rounded shadow h-100"><p class="m-auto">oops! there seems to be an error, try again</p></div>')
  });
}

//retrieve 5 day data w/api call based on user input
function getForecast(selectedCity) {
  var forecastRequest = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${APIkey}`;
  $.ajax({
    url: forecastRequest,
    method: `GET`,
  }).then(function (forecastData) {
    $(`#forecastDisplay`).empty();

    let i = 4;
    while (i < 40) {
      //5 day data is provided in 3 hr increments, 4th = noon, +8 is equal to a day.
      var forecastDay = moment
        .unix(forecastData.list[i].dt)
        .format("MM/DD/YYYY");
      let currDayNum = new Date(forecastData.list[i].dt * 1000).getDay(); //get day return 0-6 value assigned in order of sunday-monday
      let dayName = [
        "Sunday",
        "Monday",
        "Tueday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      let currDay = dayName[currDayNum];
      var forecastEl = `
            <div class="card mb-2 bg-info-subtle d-flex flex-column justify-content-center">
            <div class="card-title d-flex justify-content-between px-5 py-2">
            <h2 class="fw-bold">${currDay}</h2>
           <p> ${forecastDay}</p>
            </div>

             <ul class="card-body w-100 list d-flex flex-column  align-items-center">
              <li class="w-75 d-flex justify-content-between align-items-center">
              <p>${forecastData.list[i].weather[0].description}</p>
              <img src="https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png" alt="${forecastData.list[i].weather[0].description}">
              </li>            
              <li class="w-75 d-flex justify-content-between align-items-center">
             <p> Temperature: </p>
              <p>${forecastData.list[i].main.temp}°F</p></li>
              <li class="w-75 d-flex justify-content-between align-items-center">
              <p>Humidity: </p>
              <p>${forecastData.list[i].main.humidity}%</p></li>
              <li class="w-75 d-flex justify-content-between align-items-center">
              <p>Wind Speed:</p>
               <p>${forecastData.list[i].wind.speed} MPH</p></li> 
             </ul>
            </div>
            `;
      $(`#forecastDisplay`).append(forecastEl);
      i = i + 8;
    }
  });
}
function init() {
  //populate city archive from local storage displaying entries searched in the past
  savedCities.forEach(function (i) {
    var cityArchiveEl = `     
        <button type="button" class="btn btn-info mt-1" id="savedCitySubmit" city-data="${i}">${i.toUpperCase()}</button>`;
    $(`#cityArchive`).append(cityArchiveEl);
  });
}
