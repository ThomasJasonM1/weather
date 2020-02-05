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
    })
}

$(document).ready(() => {
    // getWeather(
    //     'group?id=' + JSON.stringify(defaultCities).replace(/[\[\]']+/g,'') + '&units=metric'
    // );
})
