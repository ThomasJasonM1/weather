const baseUrl = 'https://api.openweathermap.org/data/2.5/';
const appID = '&APPID=8ed0861da9937636b9473061da83c43c';
const defaultCities = [];
const usCities = masterCityList.filter(f => f.country === 'US' && f.stat.population > 800000);

while (defaultCities.length <= 13) {
    console.log(usCities.length)
    // let randomNumber = Math.floor(Math.random() * usCities.length)
    let cityId = usCities[defaultCities.length].id;

    if (!defaultCities.includes(cityId)) {
        defaultCities.push(cityId);
    }
}

const getWeather = queryParams => {
    $.ajax({
        url: baseUrl + queryParams + appID,
        method: 'GET',
    }).then((resp) => {
        resp.list.map(city => {
            let li = $('<li>').attr('class', 'list-group-item list-group-item-action').text(`${city.name}, ${city.sys.country}`);
            li.attr('data-id', city.id);
            li.attr('data-temp', city.main.temp);
            li.attr('data-humidity', city.main.humidity);
            li.attr('data-wind-speed', city.wind.speed);
            li.attr('data-icon', city.weather[0].icon);
            li.attr('data-date', city.dt);
            li.attr('data-name', city.name);
            li.attr('data-lat', city.coord.lat);
            li.attr('data-lon', city.coord.lon);
            $('#city-list').append(li);
        });
    })
}

const buildCityDisplay = (cityObj, cityData) => {
    $('#this-city-weather').empty();
    $('#five-day').empty();
    $.ajax({
        method: 'GET',
        url: `${baseUrl}uvi?lat=${cityData.lat}&lon=${cityData.lon + appID}`,
    }).then((uvIndex) => {
        let dateString = moment(new Date()).format('L')
        // This is the heading with the city name, date, and weather icon
        let h1 = $('<h1>').text(cityData.name + '  ');
        let span1 = $('<span>').text(dateString + '  ');
        let span2 = $('<span>');
        let img = $('<img>').attr('src', `https://openweathermap.org/img/wn/${cityData.icon}@2x.png`);
        span2.append(img);
        h1.append(span1, span2);

        // This is the weather data bleow for that city
        let temp = $('<h2>').html('Temperature: ' + Math.round(cityData.temperature) + ' &#8457;').attr('class', 'pb-2');
        let humid = $('<h2>').text('Humidity: ' + cityData.humidity + '%').attr('class', 'pb-2');
        let wind = $('<h2>').text('Wind Speed: ' + cityData.windSpeed + ' MPH').attr('class', 'pb-2');
        let uv = $('<h2>').text('UV Index: ' + uvIndex.value).attr('class', 'pb-2'); // .attr('class', 'bg-danger');

        $('#this-city-weather').append(h1, temp, humid, wind, uv);

        // adds the 5 day forcast
        let dateDay = 1;
        cityObj.list.map(item => {
            let date = moment(new Date()).add(dateDay, 'd').format('L');
            let div = $('<div>').attr('class', 'col-md-2 col-sm-12 mr-3 bg-primary mx-auto border rounded');
            let h2 = $('<h4>').text(date).attr('class', 'py-3');
            let icon = $('<img>').attr('src', `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`).attr('class', 'py-3').attr('class', 'w-75');
            let temp = $('<h4>').html('Temp: ' + Math.round(item.main.temp * 9/5 - 459.67) + '&#8457;').attr('class', 'py-3');
            let humid = $('<h4>').text('Humidity: ' + item.main.humidity + '%').attr('class', 'py-3');

            div.append(h2, icon, temp, humid);
            $('#five-day').append(div);

            dateDay++;
        })
    })
}

$(document).on('click', '.list-group-item', function() {
    let  numOfDays = '5';
    let cityId = $(this).attr('data-id');
    let cityData = {
        cityId: cityId,
        temperature: $(this).attr('data-temp'),
        humidity: $(this).attr('data-humidity'),
        windSpeed: $(this).attr('data-wind-speed'),
        icon: $(this).attr('data-icon'),
        date: $(this).attr('data-date'),
        name: $(this).attr('data-name'),
        lat: $(this).attr('data-lat'),
        lon: $(this).attr('data-lon'),
    }
    saveToLoacalStorage('cityId', cityId);

    $.ajax({
        url: `${baseUrl}forecast?id=${cityId}&cnt=${numOfDays + appID}`,
        method: 'GET',
    }).then((cityObj) => {
        buildCityDisplay(cityObj, cityData);
    })
})

$('#button').on('click', function(event) {
    searchCity();
})

$(document).on('keypress',function(event) {
    
    
    if(event.which == 13 && event.target.id === 'city-value') {
        event.preventDefault();
        searchCity();
    }
});

const saveToLoacalStorage = (type, value) => {
    localStorage.setItem(type, value);
}

function searchCity(passedInCity = null, queryString = null) {
    let value = $('#city-value')[0].value;
    if (value) { saveToLoacalStorage('cityName', value); }
    let  numOfDays = '5';
    if (!queryString) { queryString = 'weather?q=' }
    if (!value) { value = passedInCity }

    $.ajax({
        method: 'GET',
        url: baseUrl + queryString + value + appID,
    }).then((resp) => {
        $('#this-city-weather').empty();
        $('#five-day').empty();

        let cityData = {
            cityId: resp.id,
            temperature: resp.main.temp,
            humidity: resp.main.humidity,
            windSpeed: resp.wind.speed,
            icon: resp.weather[0].icon,
            name: resp.name,
            lat: resp.coord.lat,
            lon: resp.coord.lon,
        }
        $.ajax({
            url: `${baseUrl}forecast?id=${cityData.cityId}&cnt=${numOfDays + appID}`,
            method: 'GET',
        }).then((cityObj) => {
            buildCityDisplay(cityObj, cityData);
        })
    })
}

$(document).ready(() => {
    let cityId = localStorage.getItem('cityId');
    let cityName = localStorage.getItem('cityName');
    getWeather(
        'group?id=' + JSON.stringify(defaultCities).replace(/[\[\]']+/g,'') + '&units=imperial'
    );
    if (cityName) {
        searchCity(cityName, 'weather?q=');
    } else if (cityId) {
        searchCity(cityId, 'group?id=');
    } else {
        searchCity('Dallas', 'weather?q=');
    }
})
