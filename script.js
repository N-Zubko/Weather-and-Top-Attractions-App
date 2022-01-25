// Foursquare API Key
const clientId = 'XCDJ23SEDKI3TNCBDMMVYL1XFBPJNQFTGUC41JSRMP4DPFDZ';
const clientSecret = 'YOI3TL5V2YJYIX3HNXLLHOKNJHHDR0ZVUL5U4IMX5NNT4RSW';
const authorization = 'fsq3Kz5qwd0ywsDqxpTwiYkI6SuFEspCTAXM+zyBjfHs+zk=';

// OpenWeather API Key and Endpoint
const openWeatherKey = '892156a2190d93525a17cfffe0c0fc42';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';


const url = 'https://api.foursquare.com/v3/places/search?near=';
const urlImage = 'https://api.foursquare.com/v3/places/';

// page elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4"), $("#venue5")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//foursquare API v.3
const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    Authorization: authorization
  }
};

const getVenues = async () => {
	const city = $input.val();
	const urlToFetch = `${url}${city}&limit=10`;
  try{
    const response = await fetch(urlToFetch, options);
    if (response.ok){
      const jsonResponse = await response.json();
      const venues = jsonResponse.results.map(item => item)
      return venues;
    }
  }catch(error){
    console.log(error);
  };
}

//Get foursq. image
const getImages = async(venues) => { 
  for(let index = 0; index <4; index++){
    venueId = venues[index].fsq_id;
    const urlToFetch = `${urlImage}${venueId}/photos?limit=1`;
    try{
      const response = await fetch(urlToFetch,options);
      if (response.ok){
        const jsonResponse = await response.json();
        const venuesImages = jsonResponse
        const urlImage = `${venuesImages[0].prefix}200x200${venuesImages[0].suffix}`;
        console.log(urlImage)
        return urlImage
      }
    }
    catch(error){
      console.log(error)
    }
  }; 
}

const getIndividualImage = async(venue) =>{
  venueId = venue.fsq_id;
  const urlToFetch = `${urlImage}${venueId}/photos?limit=1`;
  try{
    const response = await fetch(urlToFetch,options);
    if (response.ok){
      const jsonResponse = await response.json();
      const venuesImages = jsonResponse
      const urlImage = `${venuesImages[0].prefix}200x200${venuesImages[0].suffix}`;
      return urlImage;
    }
  }catch(error){
    console.log(error)
  }
}


//  Weather API
const getForecast = async() => {
  const city = $input.val();
  const urlToFetch = `${weatherUrl}?q=${city}&appid=${openWeatherKey}&units=metric`;
  try{
    const response = await fetch(urlToFetch);
    if (response.ok){
      const jsonResponse = await response.json();
      return jsonResponse;
    }

  }catch(error){
    console.log(error);
  }
}


// Render Foursq. 
const renderVenues = async(venues) => {
  for (let index=0; index <$venueDivs.length; index++) {
    const venue = venues[index];
    const venueName = venue.name
    const venueLocation = venue.location
    const venueIcon = venue.categories[0].icon;
    const venuefsq_id = venue.fsq_id;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;    
    const imageFinal = await getIndividualImage(venue);
    let venueContent = createVenueHTML(venueName, venueLocation, venueImgSrc, imageFinal);
    $venueDivs[index].append(venueContent);
  };
  $destination.append(`<h2>${$input.val()}</h2>`);
};



const renderForecast = (day) => {
	let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty(); 
  $container.css("visibility", "visible");
  getVenues().then(venues=>renderVenues(venues));
  getForecast().then(day=>renderForecast(day))
  return false;
}


$submit.click(executeSearch) 


const createVenueHTML = (name, location, iconSource, imgSource) => {
	return `<h2>${name}</h2>
	<img class="venueimage" src="${iconSource}"/>
	<h3>Address:</h3>
	<p>${location.address}, ${location.locality}, ${location.country}</p>
	<img class="addimage" src="${imgSource}"/>`;
  }

  const createWeatherHTML = (currentDay) => {
	return `<h2>${weekDays[(new Date()).getDay()]}</h2>
		  <h2>Temperature: ${Math.floor(currentDay.main.temp)}&deg;C</h2>
		  <h2>Feels like: ${Math.floor(currentDay.main.feels_like)}&deg;C</h2>
		  <h2>The current condition is ${currentDay.weather[0].description}</h2>
		  <img class="weatherIcon" src="https://openweathermap.org/img/wn/${currentDay.weather[0].icon}@2x.png"/>`
  }

  