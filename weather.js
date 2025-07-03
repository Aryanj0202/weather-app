const apikey = 'yourpersonalapikey';

const latlongurl =`http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=1&appid=${apikey}`;

const cityname = document.getElementById('searchInput');

// changes the temperature being shown
 function changetempname(temp) {
    const tempdisplay = document.querySelector('.temp');
    tempdisplay.innerText = temp;
 }


// changes the city name
function getCityName(city) {
    const citynamedisplay = document.querySelector('.city');
    citynamedisplay.innerText = city;
}


//changes the weather icon
function changeWeatherIcon(condition) {
    const iconImg = document.querySelector('.weather-icon');
    const iconMap = {
        Clear: 'images/clear.png',
        Clouds: 'images/clouds.png',
        Rain: 'images/rain.png',
        Drizzle: 'images/drizzle.png',
        Thunderstorm: 'images/thunderstorm.png',
        Snow: 'images/snow.png',
        Mist: 'images/mist.png',
        Haze: 'images/mist.png',
        Fog: 'images/mist.png',
        Smoke: 'images/mist.png',
        // Add more mappings as needed
    };
    iconImg.src = iconMap[condition] || 'images/default.png';
}

// change humidity percentage
function changehumidity(humidity){
    const humiditytext = document.querySelector('.humidity');
    humiditytext.innerText = humidity;
}


function changewindspeed(speed){
    const windtext = document.querySelector('.wind');
    windtext.innerText = speed;
}

// gets the latitutde and longitude using api
async function getLatLong(city) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apikey}`);
    var data = await response.json();
    if (data.length === 0) {
        throw new Error('City not found jiiiii');
    }else if (data.length > 1) {
        console.warn('Multiple cities found, using the first one.');
    }
    console.log(data);
    getCityName(data[0].name);
    document.querySelector('.city').style.display = 'block';
    return data;
}


// uses lat and lon to get weather and make changes on the html side 
async function getWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`);
    const data = await response.json();
    if (data.main && data.main.temp) {
        changetempname(data.main.temp + "°C");
    }

    if (data.weather && data.weather.length > 0) {
        changeWeatherIcon(data.weather[0].main); // <-- Add this line
    }

    if(data.main && data.main.humidity ){
        changehumidity(data.main.humidity + "%")
    }

    if(data.wind && data.wind.speed ){
        changewindspeed(data.wind.speed + "km/h")
    }

    console.log(data);
}

// a wrapper function to use all the above functions together

function handleSearch() {
    const city = cityname.value;
    getLatLong(city).then(data => {
        if (Array.isArray(data) && data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            getWeather(lat, lon); // Call here, where lat and lon are defined
        } else {
            alert('City not found error message not console!');
        }
    }).catch(err => {
        alert(err.message);
    });
}

// tells when to implemnet seaarchandler function
document.querySelector('.search button').addEventListener('click', handleSearch);

cityname.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});
