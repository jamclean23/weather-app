//Javascript


//Event Listeners

const submitButton = document.querySelector('button');
submitButton.addEventListener('click', getWeather)


//Functions

function getWeather () {

    const city = document.querySelector('#city');
    const state = document.querySelector('#state');
    let cityLat;
    let cityLon;
    let forecastData = {};
    let dataToBeDisplayed = {};

    //Get city info
    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city.value + ',' + state.value +',&limit=&appid=2c01d27f6e4ccace82f774629e85f711&')
    .then(function(cityData) {
        return cityData.json();
    })
    //submit a new request with lat and lon for current conditions
    .then(function(cityData) {
        cityLat = cityData[0].lat;
        cityLon = cityData[0].lon;
        return fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial')
    })
    .then(function(weather) {
        return weather.json();
    })
    .then(function(weather) {
        console.log('Current Conditions:');
        console.log(weather);
        dataToBeDisplayed.feels_like = weather.main.feels_like;
        dataToBeDisplayed.currentTemp = weather.main.temp;
    })
    //submit a new request for an hourly weather forecast
    .then(function() {
        return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial&cnt=8');
    })
    .then(function(weather) {
        return weather.json();
    })
    .then(function(weather) {
        console.log('Forecast:');
        console.log(weather);
        dataToBeDisplayed.low = calculateNightLowTemp(weather);
    })
    .then(function() {
        return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial&cnt=40');
    })
    .then(function(weather) {
        return weather.json();
    })
    .then(function(weather) {
        dataToBeDisplayed.days = calculateDailyForecast(weather);
    })
    .then(function() {
        console.log(dataToBeDisplayed);
        displayData(dataToBeDisplayed);
    })

    function calculateNightLowTemp (weather) {
        //Look at weather predicitons by 3 hour intervals and determine which times are at night
        const nightTemps = [];
        weather.list.forEach((item, index) => {
            let date  = new Date(item.dt * 1000);
            if (date.getHours() > 18 || date.getHours() < 7) {
                nightTemps.push(item.main.temp);
            }
        });
        //Sort the temps and find the lowest
        const lowestTemp =  nightTemps.reduce((accumulator, currentValue) => {
            if (accumulator <= currentValue) {
                return accumulator;
            } else {
                return currentValue;
            }
        });
        console.log('Night-time Low:');
        console.log(lowestTemp);
        return lowestTemp;
    }

    function calculateDailyForecast (weather) {
        console.log(weather);
        let forecast = [];

        weather.list.forEach((item, index) => {
            let date = new Date(item.dt * 1000);
            let day = {};
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            if (date.getHours() <= 17 && date.getHours() >= 15) {
                day.date = months[date.getMonth()] + ' ' + date.getDate() + ' day:';
                day.description = item.weather[0].description;
                day.temp = item.main.temp;
                forecast.push(day);
                console.log(day);
            }
            if (date.getHours() <= 4 && date.getHours() >= 2) {
                day.date = months[date.getMonth()] + ' ' + date.getDate() + ' night:';
                day.description = item.weather[0].description;
                day.temp = item.main.temp;
                forecast.push(day);
                console.log(day);
            }
        });
        return forecast;
    }

    //Display the weather data in a field
    function displayData (data) {

        let forecast = "";
        data.days.forEach((item, index) => {
            console.log(item);
            forecast += '\n \n' + item.date + '\n' + item.description + "\nTemp: " + item.temp;
        });

        const result = document.querySelector('#result');
        result.innerText = "";
        result.innerText = 
        "Feels Like: " + data.feels_like + '\u00B0' +
        "\nTemp: " + data.currentTemp + '\u00B0' + 
        "\nNight-time Low: " + data.low + '\u00B0' +
        forecast;
    }

}
