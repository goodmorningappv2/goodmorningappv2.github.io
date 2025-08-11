const now = new Date();
const hours = now.getHours();
var turn = 0;
let bgimg = document.getElementById('container')


if (4 <= hours && hours < 12){
    document.title = 'Good Morning'
    bgimg.style.backgroundImage = "url(img/morning.jpg)"
}
else if (12 <= hours && hours < 18){
    document.title = 'Good Afternoon'
    bgimg.style.backgroundImage = "url(img/afternoon.jpg)"
}
else if (18 <= hours && hours < 22){
    document.title = 'Good Evening'
    bgimg.style.backgroundImage = "url(img/evening.jpg)"
}
else{
    document.title = 'Good Night'
    bgimg.style.backgroundImage = "url(img/night.jpg)"
}

var return_arrow = document.getElementById('return_arrow')
var search_box = document.getElementById('search_box')

return_arrow.addEventListener('click', ()=>{
    window.location.href="index.html"
})

search_box.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
    getId(search_box.value);
    }
});

function getTimeInTimezone(offsetInSeconds) {
    const offsetInMinutes = offsetInSeconds / 60; // Convert seconds to minutes
    const now = new Date();
    
    // Get the current UTC time and apply the offset
    const localTime = new Date(now.getTime() + offsetInMinutes * 60000);

    return localTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

var station_options = document.getElementById('station_options')

function getId(place){
    var url_id = 'https://api.openweathermap.org/geo/1.0/direct?q='+ place + '&limit=10&appid=51387f71b3654879e5fb657de92e89d6'
    fetch(url_id)
        .then(response => response.json())
        .then(data => {
            /*console.log(data)*/
            /*console.log(data.length)*/
            station_options.innerHTML = ""
            for(var n = 0; n < data.length; n++){
                var opt =  `<option value="${data[n]['lat']}+${data[n]['lon']}"><span class="name_display">${data[n]['name']}, ${data[n]['state']}, ${data[n]['country']}</span>
                                
                            </option>`
                console.log(opt)
                station_options.innerHTML += opt
            }})
}


station_options.addEventListener('change', ()=>{
    getWeatherInfo(station_options.value)
})


function getWeatherInfo(id){
    var coords = id.split('+')
    var url_weather = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=51387f71b3654879e5fb657de92e89d6`
    var temp_value = document.getElementById('temp_value')
    var tod_value = document.getElementById('temp_tod')
    var windspeed_value = document.getElementById('windspeed_value')
    var feelslike_value = document.getElementById('feelslike_value')
    var winddirection_value = document.getElementById('winddirection_value')
    var rain_value = document.getElementById('rain_value')
    var humidity_value = document.getElementById('humidity_value')
    var rain_name = document.getElementById('rain_name')
    
    
    fetch(url_weather)
        .then(response => response.json())
        .then(data => {
          console.log(data);
            tod_value.innerHTML = getTimeInTimezone(data['timezone'])
            temp_value.innerHTML = `${Math.floor((parseFloat(data['main']['temp']) - 273.15))}°C`
            feelslike_value.innerHTML =  `${Math.floor((parseFloat(data['main']['feels_like']) - 273.15))}°C`
            humidity_value.innerHTML =  `${data['main']['humidity']}%`
            windspeed_value.innerHTML = `${Math.floor(parseFloat(data['wind']['speed'])* 3.6)}km/h`
            /*winddirection_value.innerHTML = `${Math.abs(data['wind']['deg']-180)}°`*/
            arrow.style.rotate = (`${Math.abs(data['wind']['deg']-180)}deg`)
            /*console.log(Math.abs(data['wind']['deg']-180))*/

            if (data['weather'][0]['main'] == 'Rain'){
                rain_name.innerHTML = 'Rain'
                rain_value.innerHTML = `${data['rain']['1h']}mm`
            }
            else if (data['weather'][0]['main'] == 'Snow'){
                rain_name.innerHTML = 'Snow'
                rain_value.innerHTML = `${data['snow']['1h']}mm`
            }
            else{
                rain_name.innerHTML = 'Rain'
                rain_value.innerHTML = `0mm`
            }
            
            
            document.getElementById('weather_icon').src = `img/${data['weather'][0]['icon']}.png`
           
        })
}

function getStationInfo(id){
    
var url_train = `https://transport.opendata.ch/v1/stationboard?id=${id}&limit=10`
var train_table = document.getElementById('train_values')
train_table.innerHTML = ""

fetch(url_train)
    .then(response => response.json())
    .then(data => {
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
    
    })
}



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