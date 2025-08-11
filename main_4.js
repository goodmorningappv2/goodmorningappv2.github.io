const now = new Date();
const hours = now.getHours();
var turn = 0;
let bgimg = document.getElementById('container')


var weather_list = 0
var station_list = 0


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
var weather_b = document.getElementById('weather_b')
var station_b = document.getElementById('station_b')


return_arrow.addEventListener('click', ()=>{
    if(station_list.length == weather_list.length){
            window.location.href="index.html"
    }
    else{
        alert("List size not same")
    }
})

weather_b.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
    weather_list = listify(weather_b.value);
    localStorage.setItem("weatherList", JSON.stringify(weather_list));
    }
});

station_b.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
    station_list = listify(station_b.value);
    localStorage.setItem("stationList", JSON.stringify(station_list));
    }
});

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


function listify(str) {
  return str.split(";").map(s => s.trim());
}