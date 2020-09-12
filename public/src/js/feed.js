let city = "New York City";
let apiId = "df456d2302397a47a06f8afeca0de68e";
let dateTimeElement = document.querySelector('#date_time');
let locationElement = document.querySelector('#location');
let iconElement = document.querySelector('#icon');
let temperatureElement = document.querySelector('#temperature');
let weatherElement = document.querySelector('#weather');
let searchForm = document.querySelector('#search_form');
let openWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
var networkDataReceived = false;

function updateWeather(data){
  let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let dateTime = new Date();
  dateTimeElement.textContent = dateTime.toLocaleDateString("en-US", options);

  locationElement.textContent = data.sys.country + " / " + data.name;

  temperatureElement.textContent = (data.main.temp - 273.15).toFixed(1) + '°C';

  iconElement.setAttribute("src", "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png")

  weatherElement.textContent = data.weather[0].main + " / " + data.weather[0].description
}

function getWeather(location)
{
  fetch(openWeatherUrl +'?q='+ location +'&appid=' + apiId)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      networkDataReceived = true;
      localStorage.setItem(openWeatherUrl +'?q='+ location +'&appid=' + apiId, JSON.stringify(data));
      updateWeather(data);
    })
    .catch(function(err){
      console.log(err);
    })
}

getWeather(city);


document.getElementById('location_input').onkeydown = function(e){
  if(e.key === 'Enter'){
    let location = document.getElementById('location_input').value;
    if(location){
      networkDataReceived = false;

      getWeather(location);

      if(localStorage.getItem(openWeatherUrl +'?q='+ location +'&appid=' + apiId)){
        if(!networkDataReceived){
          updateWeather(JSON.parse(localStorage.getItem(openWeatherUrl +'?q='+ location +'&appid=' + apiId)));
        }
      }

      document.getElementById('close_search').click();
    }
  }
};

function searchToggle(obj, evt){
  var container = obj.closest('.search-wrapper');
  if(!container.classList.contains('active')){
      container.classList.add('active');
      evt.preventDefault();
  }
  else if(container.classList.contains('active') && obj.closest('.input-holder') == null){
      container.classList.remove('active');
      // clear input
      container.querySelector('.search-input').value ='';
  }
  else
  {
    let input = document.querySelector("#location_input");
    let ev = document.createEvent('Event');
    ev.initEvent('keydown');
    ev.key = 'Enter';
    input.dispatchEvent(ev);
  }
}