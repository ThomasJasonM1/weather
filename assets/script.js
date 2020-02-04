const baseUrl = 'http://api.openweathermap.org/data/2.5/';
const appID = '&APPID=8ed0861da9937636b9473061da83c43c';
const defaultCities = [];
const usCities = masterCityList; // .filter(f => f.country === 'US' && f.stat.population > 200000);

console.log(usCities.length);

while (defaultCities.length <= 9) {
    let randomNumber = Math.floor(Math.random() * usCities.length)
    let cityId = usCities[randomNumber].id;

    console.log(cityId);
    if (!defaultCities.includes(cityId)) {
        defaultCities.push(cityId);
    }

    console.log(defaultCities);
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
    // console.log(list.filter(f => f.country === 'US'));
    // getWeather(
    //     'group?id=' + JSON.stringify(defaultCities) + '&units=metric'
    // );
})
