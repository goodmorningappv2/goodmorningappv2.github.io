var good_text = document.getElementById('text');
const now = new Date();
const hours = now.getHours();
var turn = 0;
let bgimg = document.getElementById('container')

if (4 <= hours && hours < 12){
    good_text.textContent = 'Good Morning' 
    document.title = 'Good Morning'
    bgimg.style.backgroundImage = "url(img/morning.jpg)"
}
else if (12 <= hours && hours < 18){
    good_text.textContent = 'Good Afternoon'
    document.title = 'Good Afternoon'
    bgimg.style.backgroundImage = "url(img/afternoon.jpg)"
}
else if (18 <= hours && hours < 22){
    good_text.textContent = 'Good Evening'
    document.title = 'Good Evening'
    bgimg.style.backgroundImage = "url(img/evening.jpg)"
}
else{
    good_text.textContent = 'Good Night'
    document.title = 'Good Night'
    bgimg.style.backgroundImage = "url(img/night.jpg)"
}

async function updateWeather() {
    let savedWeather = JSON.parse(localStorage.getItem("weatherList"));

    // First: get latitude and longitude from city name
    let url_id = `https://api.openweathermap.org/geo/1.0/direct?q=${savedWeather[turn]}&limit=10&appid=51387f71b3654879e5fb657de92e89d6`;
    let geoData = await fetch(url_id).then(res => res.json());

    let lat = geoData[0].lat;
    let lon = geoData[0].lon;

    // Second: get actual weather data using lat/lon
    let url_weather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=51387f71b3654879e5fb657de92e89d6`;
    let data = await fetch(url_weather).then(res => res.json());

    // Get DOM elements
    let temp_value = document.getElementById('temp_value');
    let windspeed_value = document.getElementById('windspeed_value');
    let feelslike_value = document.getElementById('feelslike_value');
    let winddirection_value = document.getElementById('winddirection_value');
    let rain_value = document.getElementById('rain_value');
    let humidity_value = document.getElementById('humidity_value');
    let rain_name = document.getElementById('rain_name');
    let arrow = document.getElementById('arrow');

    // Fill in weather data
    temp_value.innerHTML = `${Math.floor(data.main.temp - 273.15)}°C`;
    feelslike_value.innerHTML = `${Math.floor(data.main.feels_like - 273.15)}°C`;
    humidity_value.innerHTML = `${data.main.humidity}%`;
    windspeed_value.innerHTML = `${Math.floor(data.wind.speed * 3.6)}km/h`;
    arrow.style.rotate = `${Math.abs(data.wind.deg - 180)}deg`;

    if (data.weather[0].main === 'Rain') {
        rain_name.innerHTML = 'Rain';
        rain_value.innerHTML = `${data.rain?.['1h'] || 0}mm`;
    } else if (data.weather[0].main === 'Snow') {
        rain_name.innerHTML = 'Snow';
        rain_value.innerHTML = `${data.snow?.['1h'] || 0}mm`;
    } else {
        rain_name.innerHTML = 'Rain';
        rain_value.innerHTML = `0mm`;
    }

    document.getElementById('weather_icon').src = `img/${data.weather[0].icon}.png`;
    console.log("update")
}

// Call the function
updateWeather().catch(err => console.error(err));

///////////////////////////////////////////////////

async function updateStation() {
    let savedStations = JSON.parse(localStorage.getItem("stationList"));

    // First: get latitude and longitude from city name
    let url_id = 'https://transport.opendata.ch/v1/locations?query=' + savedStations[turn]
    let station_id = await fetch(url_id).then(res => res.json());

    let id = station_id['stations'][0]['id']
    console.log(id)

    // Second: get actual weather data using lat/lon
    let url_station = `https://transport.opendata.ch/v1/stationboard?id=${id}&limit=10`;
    let data = await fetch(url_station).then(res => res.json());
    var train_table = document.getElementById('train_values')
    train_table.innerHTML = "";
    var place_name = document.getElementById('location_name')
    place_name.innerHTML = capitalizeFirstLetter(savedStations[turn])

    // Get DOM elements
    for(var t=0; t<10; t++){
            var date = new Date(data['stationboard'][t]['passList'][0]['departure'])
            var formated_time = `${(date.getHours()).toString().padStart(2, '0')}:${(date.getMinutes()).toString().padStart(2, '0')}`
            var row = `<tr>
                            <td>${formated_time}</td>
                            <td>${data['stationboard'][t]['category'] + " " + data['stationboard'][t]['number']}</td>
                            <td>${data['stationboard'][t]['to']}</td>
                            <td>${data['stationboard'][t]['operator']}</td>
                            <td>${data['stationboard'][t]['passList'][0]['platform']}</td>
                            <td>+${data['stationboard'][t]['passList'][0]['delay']}</td>
                    </tr>`
            train_table.innerHTML += row;
        }
}

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

updateStation().catch(err => console.error(err));

var switch_button = document.getElementById('switch')

var train_cont = document.getElementById('train_box')

train_cont.addEventListener('click', ()=>{
    window.location.href = 'train.html'
})

var train_cont = document.getElementById('weather_box')

train_cont.addEventListener('click', ()=>{
    window.location.href = 'weather.html'
})

var setting_cont = document.getElementById('message')

setting_cont.addEventListener('click', ()=>{
    window.location.href = 'settings.html'
})


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting){
            entry.target.classList.add('show');
        }
        else{
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


switch_button.addEventListener('click', () =>{
    let savedStations = JSON.parse(localStorage.getItem("stationList"));
    var max_places = savedStations.length -1
    turn += 1;
        console.log(turn)

    if (turn > max_places){
        turn = 0
    }
    updateWeather()
    updateStation()
})