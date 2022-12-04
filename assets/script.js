var APIkey = `cb8d3a328e6b7aa47d98d6e678c6df07`
var selectedCity = ``
var todayDate = moment().format(`L`)

$(`#citySubmit`).on(`click`, function(event) {
    event.preventDefault()
    getWeatherToday()
    getForecast()
})


function getWeatherToday(){
    var selectedCity = $("#city").val().trim()
  
  //use user input to make API call for rendering curent date weather info
    var weatherRequest = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=imperial&appid=${APIkey}`
    $.ajax({
        url: weatherRequest,
        method: `GET`
    }).then(function(weatherData){
        console.log(weatherData)
        $(`#today`).empty()
        var todayEl = ` 
        <div class="card">
         <h3 class="card-header" id="selectedCityName">${weatherData.name} - ${todayDate} </h3>  
         <ul class="card-body list">
         <li>Condition: ${weatherData.weather[0].description}</li>
          <li><img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="${weatherData.weather[0].description}"></li>   
          
          <li>Temperature: ${weatherData.main.temp}°F</li>
          <li>Humidity: ${weatherData.main.humidity}%</li>
          <li>Wind Speed: ${weatherData.wind.speed} MPH</li>

         </ul>
        </div>`
        $(`#today`).append(todayEl)
     })}
 
function getForecast(){
    var selectedCity = $("#city").val().trim()
    var forecastRequest = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&exclude=current,minutely,hourly,alerts&units=imperial&appid=${APIkey}`
    $.ajax({
        url: forecastRequest,
        method: `GET`
    }).then(function(forecastData){
        console.log(forecastData)
        console.log(moment.unix(forecastData.list[0].dt).format("MM/DD/YYYY"))
        
        let i = 4
        while(i<40){
            var forecastDay = moment.unix(forecastData.list[i].dt).format("MM/DD/YYYY")
            var forecastEl = `
            <div class="card text-bg-primary mb-2" style="max-width: 12rem;">
             <ul class="card-body list">
              <li>${forecastDay}</li>
              <li>Condition: ${forecastData.list[i].weather[0].description}</li>
              <li><img src="https://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png" alt="${forecastData.list[i].weather[0].description}"></li>            
              <li>Temperature: ${forecastData.list[i].main.temp}°F</li>
              <li>Humidity: ${forecastData.list[i].main.humidity}%</li>
              <li>Wind Speed: ${forecastData.list[i].wind.speed} MPH</li> 
             </ul>
            </div>
            `
            $(`#forecastDisplay`).append(forecastEl)
            i=i+8;
        }


    })

}
