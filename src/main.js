//Javascript

//Initialize

displayBackground();
getWeather();



//Event Listeners

const submitButton = document.querySelector('button');
submitButton.addEventListener('click', getWeather)


//Functions

function displayBackground () {

    //Determine if it's day or night
    const body = document.querySelector('body');
    const date = new Date();

    if (date.getHours() <= 6 || date.getHours() >= 19) {
        body.style.cssText = "background-image: url('./images/night.jpg');";
    } else {
        body.style.cssText = "background-image: url('./images/day.jpg');";
    }
    
}

function getWeather () {

    displayLoading();

    const city = document.querySelector('#city');
    const state = document.querySelector('#state');
    let cityLat;
    let cityLon;
    let dataToBeDisplayed = {};
    dataToBeDisplayed.currentDate = new Date();
    
    //Get city info
    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city.value + ',' + state.value +',&limit=&appid=2c01d27f6e4ccace82f774629e85f711&', { mode: 'cors' })
    .then(function(cityData) {
        return cityData.json();
    })
    //submit a new request with lat and lon for current conditions
    .then(function(cityData) {
        dataToBeDisplayed.cityData = cityData;
        cityLat = cityData[0].lat;
        cityLon = cityData[0].lon;
        return fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial', { mode: 'cors' })
        .then(function(weather) {
            return weather.json();
        })
    })
    .then(function(weather) {
        dataToBeDisplayed.feels_like = weather.main.feels_like;
        dataToBeDisplayed.currentTemp = weather.main.temp;
        dataToBeDisplayed.currentConditions = weather.weather[0].description;

        //submit a new request for an hourly weather forecast
        return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial&cnt=8', { mode: 'cors' })
        .then(function(weather) {
            return weather.json();
        })
    })
    .then(function(weather) {
        dataToBeDisplayed.low = calculateNightLowTemp(weather);
        return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial&cnt=40', { mode: 'cors' })
        .then(function(weather) {
            return weather.json();
        })
    })
    .then(function(weather) {
        dataToBeDisplayed.days = calculateDailyForecast(weather);
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
        return lowestTemp;
    }

    function calculateDailyForecast (weather) {

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
            }
            if (date.getHours() <= 4 && date.getHours() >= 2) {
                day.date = months[date.getMonth()] + ' ' + date.getDate() + ' night:';
                day.description = item.weather[0].description;
                day.temp = item.main.temp;
                forecast.push(day);
            }
        });
        return forecast;
    }

    //Display the weather data in a field
    function displayData (data) {

        //Make a string with day of the week
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = weekdays[data.currentDate.getDay()];

        //Make a string with the name of the month
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const thisMonth = months[data.currentDate.getMonth()];

        //Format current conditions
        data.currentConditions = data.currentConditions.split(" ");
        data.currentConditions = data.currentConditions.map((word) => {
            const capital = word.substr(0,1).toUpperCase();
            let restOfWord = word.substr(1);
            return capital + restOfWord;
        });
        data.currentConditions = data.currentConditions.join(" ");

        //Fill current conditions div
        const result = document.querySelector('#result');
        result.innerHTML = "";
        const h2 = document.createElement('h2');
        h2.innerText = data.cityData[0].name;
        result.appendChild(h2);
        const resultText = document.createElement('p');
        resultText.innerText =
        //date 
        today + "\n" +
        thisMonth + " " +
        data.currentDate.getDate() +
        //conditions
        '\n\n' + data.currentConditions +
        "\nFeels Like: " + data.feels_like + '\u00B0' +
        "\nTemp: " + data.currentTemp + '\u00B0' + 
        "\nNight-time Low: " + data.low + '\u00B0';
        result.appendChild(resultText);


    }

}

function displayLoading() {
    const result = document.querySelector('#result');
    result.innerHtml = '';
    result.innerText = 'Loading Results';
}

