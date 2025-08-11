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

var station_options = document.getElementById('station_options')

function getId(place){
    var url_id = 'https://transport.opendata.ch/v1/locations?query=' + place
    fetch(url_id)
        .then(response => response.json())
        .then(data => {
            station_options.innerHTML = ""
            for(var n = 0; n < (data['stations']).length; n++){
                var opt =  `<option value="${data['stations'][n]['id']}" style="background-image: url(img/${data['stations'][n]['icon']}.png);"><span class="name_display">${data['stations'][n]['name']}</span>
                                
                            </option>`
                console.log(opt)
                station_options.innerHTML += opt
            }})
}


station_options.addEventListener('change', ()=>{
    getStationInfo(station_options.value)
})




function getStationInfo(id){
    console.log(id)
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