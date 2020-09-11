// var shareImageButton = document.querySelector('#share-image-button');
// var createPostArea = document.querySelector('#create-post');
// var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
// var sharedMomentsArea = document.querySelector('#shared-moments');

// function openCreatePostModal() {
//   createPostArea.style.display = 'block';
//   if(deferredPrompt){
//     deferredPrompt.prompt();

//     deferredPrompt.userChoice.then(function(choiceResult){
//       console.log(choiceResult.outcome);

//       if(choiceResult.outcome === 'dismissed'){
//         console.log('User cancelled installation');
//       }
//       else{
//         console.log('User added to home screen');
//       }
//     });

//     deferredPrompt = null;
//   }
// }

// function closeCreatePostModal() {
//   createPostArea.style.display = 'none';
// }

// shareImageButton.addEventListener('click', openCreatePostModal);

// closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

// function onSaveButtonClicked(event){
//   console.log('clicked');
// }

// function createCard(){
//   var cardWrapper = document.createElement('div');
//   cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
//   var cardTitle = document.createElement('div');
//   cardTitle.className = 'mdl-card__title';
//   cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
//   cardTitle.style.backgroundSize = 'cover';
//   cardTitle.style.height = '180px';
//   cardWrapper.appendChild(cardTitle);
//   var cardTitleTextElement = document.createElement('h2');
//   cardTitleTextElement.className = 'mdl-card__title-text';
//   cardTitleTextElement.textContent = 'San Francisco Trip';
//   cardTitle.appendChild(cardTitleTextElement);
//   var cardSupportingText = document.createElement('div');
//   cardSupportingText.className = 'mdl-card__supporting-text';
//   cardSupportingText.textContent = 'In San Francisco';
//   cardSupportingText.style.textAlign = 'center';
//   var cardSaveButton = document.createElement('button');
//   cardSaveButton.textContent = 'Save';
//   cardSaveButton.addEventListener('click', onSaveButtonClicked);
//   cardSupportingText.appendChild(cardSaveButton);
//   cardWrapper.appendChild(cardSupportingText);
//   componentHandler.upgradeElement(cardWrapper);
//   sharedMomentsArea.appendChild(cardWrapper);
// }

// fetch('https://httpbin.org/get')
//   .then(function(res){
//     return res.json();
//   })
//   .then(function(data){
//     createCard();
//   });

let city = "New York City";
let apiId = "df456d2302397a47a06f8afeca0de68e";
let dateTimeElement = document.querySelector('#date_time');
let locationElement = document.querySelector('#location');
let iconElement = document.querySelector('#icon');
let temperatureElement = document.querySelector('#temperature');
let weatherElement = document.querySelector('#weather');
let searchForm = document.querySelector('#search_form');

function getWeather(location)
{
  fetch('https://api.openweathermap.org/data/2.5/weather?q='+ location +'&appid=' + apiId)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let dateTime = new Date();
      dateTimeElement.textContent = dateTime.toLocaleDateString("en-US", options);

      locationElement.textContent = data.sys.country + " / " + data.name;

      temperatureElement.textContent = (data.main.temp - 273.15).toFixed(1) + '°C';

      iconElement.setAttribute("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png")

      weatherElement.textContent = data.weather[0].main + " / " + data.weather[0].description
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
      getWeather(location);
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