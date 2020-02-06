const baseUrl = 'http://api.openweathermap.org/data/2.5/';
const appID = '&APPID=8ed0861da9937636b9473061da83c43c';
const defaultCities = [];
const usCities = masterCityList.filter(f => f.country === 'US' && f.stat.population > 600000);

while (defaultCities.length <= 9) {
    let randomNumber = Math.floor(Math.random() * usCities.length)
    let cityId = usCities[randomNumber].id;

    if (!defaultCities.includes(cityId)) {
        defaultCities.push(cityId);
    }
}

const getWeather = queryParams => {
    $.ajax({
        url: baseUrl + queryParams + appID,
        method: 'GET',
    }).then((resp) => {
        console.log(resp);
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
    // http://openweathermap.org/img/wn/10d@2x.png
    console.log(cityObj);
    console.log(cityData);
    $.ajax({
        method: 'GET',
        url: `${baseUrl}uvi?lat=${cityData.lat}&lon=${cityData.lon + appID}`,
    }).then((uvIndev) => {
        // now I have all the data to buld my card
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

    $.ajax({
        url: `${baseUrl}forecast?id=${cityId}&cnt=${numOfDays + appID}`,
        method: 'GET',
    }).then((cityObj) => {
        buildCityDisplay(cityObj, cityData);
    })
})

$(document).ready(() => {
    getWeather(
        'group?id=' + JSON.stringify(defaultCities).replace(/[\[\]']+/g,'') + '&units=imperial'
    );
})
