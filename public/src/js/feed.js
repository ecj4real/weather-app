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
      console.log("from network", data);
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

      if('caches' in window){
        caches.match(openWeatherUrl +'?q='+ location +'&appid=' + apiId)
          .then(function(response){
            if(response){
              return response.json()
            }
          })
          .then(function(data){
            console.log("From Cache", data);
            if(data !== undefined)
            {
              if(!networkDataReceived){
                updateWeather(data);
              }
            }
          });
      }

      document.getElementById('close_search').click();
    }
  }
};

function searchToggle(obj, evt){
  var container = $(obj).closest('.search-wrapper');
      if(!container.hasClass('active')){
          container.addClass('active');
          evt.preventDefault();
      }
      else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
          container.removeClass('active');
          // clear input
          container.find('.search-input').val('');
      }
}