/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ (() => {

eval("//Javascript\n\n\n//Event Listeners\n\nconst submitButton = document.querySelector('button');\nsubmitButton.addEventListener('click', getWeather)\n\n\n//Functions\n\nfunction getWeather () {\n\n    const city = document.querySelector('#city');\n    const state = document.querySelector('#state');\n    let cityLat;\n    let cityLon;\n    let forecastData = {};\n    let dataToBeDisplayed = {};\n\n    //Get city info\n    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + city.value + ',' + state.value +',&limit=&appid=2c01d27f6e4ccace82f774629e85f711&')\n    .then(function(cityData) {\n        return cityData.json();\n    })\n    //submit a new request with lat and lon for current conditions\n    .then(function(cityData) {\n        cityLat = cityData[0].lat;\n        cityLon = cityData[0].lon;\n        return fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial')\n    })\n    .then(function(weather) {\n        return weather.json();\n    })\n    .then(function(weather) {\n        console.log('Current Conditions:');\n        console.log(weather);\n        dataToBeDisplayed.feels_like = weather.main.feels_like;\n        dataToBeDisplayed.currentTemp = weather.main.temp;\n    })\n    //submit a new request for an hourly weather forecast\n    .then(function() {\n        return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial&cnt=8');\n    })\n    .then(function(weather) {\n        return weather.json();\n    })\n    .then(function(weather) {\n        console.log('Forecast:');\n        console.log(weather);\n        dataToBeDisplayed.low = calculateNightLowTemp(weather);\n    })\n    .then(function() {\n        return fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + cityLat + '&lon=' + cityLon + '&appid=2c01d27f6e4ccace82f774629e85f711&units=imperial&cnt=40');\n    })\n    .then(function(weather) {\n        return weather.json();\n    })\n    .then(function(weather) {\n        dataToBeDisplayed.days = calculateDailyForecast(weather);\n    })\n    .then(function() {\n        console.log(dataToBeDisplayed);\n        displayData(dataToBeDisplayed);\n    })\n\n    function calculateNightLowTemp (weather) {\n        //Look at weather predicitons by 3 hour intervals and determine which times are at night\n        const nightTemps = [];\n        weather.list.forEach((item, index) => {\n            let date  = new Date(item.dt * 1000);\n            if (date.getHours() > 18 || date.getHours() < 7) {\n                nightTemps.push(item.main.temp);\n            }\n        });\n        //Sort the temps and find the lowest\n        const lowestTemp =  nightTemps.reduce((accumulator, currentValue) => {\n            if (accumulator <= currentValue) {\n                return accumulator;\n            } else {\n                return currentValue;\n            }\n        });\n        console.log('Night-time Low:');\n        console.log(lowestTemp);\n        return lowestTemp;\n    }\n\n    function calculateDailyForecast (weather) {\n        console.log(weather);\n        let forecast = [];\n\n        weather.list.forEach((item, index) => {\n            let date = new Date(item.dt * 1000);\n            let day = {};\n            const months = [\"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\", \"August\", \"September\", \"October\", \"November\", \"December\"];\n\n            if (date.getHours() <= 17 && date.getHours() >= 15) {\n                day.date = months[date.getMonth()] + ' ' + date.getDate() + ' day:';\n                day.description = item.weather[0].description;\n                day.temp = item.main.temp;\n                forecast.push(day);\n                console.log(day);\n            }\n            if (date.getHours() <= 4 && date.getHours() >= 2) {\n                day.date = months[date.getMonth()] + ' ' + date.getDate() + ' night:';\n                day.description = item.weather[0].description;\n                day.temp = item.main.temp;\n                forecast.push(day);\n                console.log(day);\n            }\n        });\n        return forecast;\n    }\n\n    //Display the weather data in a field\n    function displayData (data) {\n\n        let forecast = \"\";\n        data.days.forEach((item, index) => {\n            console.log(item);\n            forecast += '\\n \\n' + item.date + '\\n' + item.description + \"\\nTemp: \" + item.temp;\n        });\n\n        const result = document.querySelector('#result');\n        result.innerText = \"\";\n        result.innerText = \n        \"Feels Like: \" + data.feels_like + '\\u00B0' +\n        \"\\nTemp: \" + data.currentTemp + '\\u00B0' + \n        \"\\nNight-time Low: \" + data.low + '\\u00B0' +\n        forecast;\n    }\n\n}\n\n\n//# sourceURL=webpack://weather/./src/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/main.js"]();
/******/ 	
/******/ })()
;