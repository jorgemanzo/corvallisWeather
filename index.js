import k2f from "kelvin-to-fahrenheit";
import cities from "cities";

const OMWCALL = "https://api.openweathermap.org/data/2.5/weather?zip=97331,us&APPID=aa9644578cbb315c8d2f7c97b00ecba3";
const music = {
  SUNSHINE_BEACH: "https://www.youtube.com/embed/rsA5oVt3ypc?autoplay=1&controls=0&disablekb=1&loop=1&rel=0&showinfo=0",
  NSMB_DESERT: "https://www.youtube.com/embed/J_pguaNsCyg?autoplay=1&controls=0&fs=0&loop=1&rel=0&showinfo=0",
  N64_JOLLY_ROGER: "https://www.youtube.com/embed/cTl0ky4DcHA?autoplay=1&controls=0&disablekb=1&loop=1&rel=0&showinfo=0",
  PKMNXD_GATEON: "https://www.youtube.com/embed/6uVfoUzGN4Q?autoplay=1&controls=0&disablekb=1&loop=1&rel=0&showinfo=0"
};

function clearClassList(element){
  
  
  if(element.classList.length > 0){
    for (let index = 0; index < element.classList.length; index++) {
      
      element.classList.remove(element.classList[index]);
    }
  }
}

function fromSearch() {
  let zipCode = document.getElementById("navbar-search-input").value;
  let callURL;
  if(zipCode !== ""){
    let cityName = cities.zip_lookup(zipCode).city;
    
    callURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",us&APPID=aa9644578cbb315c8d2f7c97b00ecba3";
    return {
      OMWCALL: callURL,
      city: cityName
    }
  } else {
    return {
      OMWCALL: OMWCALL,
      city: "Corvallis"
    };
  }
}


function isDay(time) {
  if (time < 18 && time >= 6) {
    // it is day
    return 1;
  } else {
    // it is night
    return 0;
  }
}


function humidOrDry(humidity, time) {
  if (humidity > 50) {
    
    // its humid
    document.getElementById("mainBody").classList.add("hotHumid");
    // is it day
    if (isDay(time)) {
      document.getElementById("sun").classList.add("orange");
    }
    document.getElementById("ytplayer").src = music.SUNSHINE_BEACH;
  } else {
    
    // its dry
    document.getElementById("mainBody").classList.add("hot");
    // is it day
    if (isDay(time)) {
      document.getElementById("sun").classList.add("yellow");
    }
    document.getElementById("ytplayer").src = music.NSMB_DESERT;
  }
}



function hotOrCold(temp, humidity, time) {
  if (temp >= 70) {
    
    humidOrDry(humidity, time);
  } else {
    
    document.getElementById("mainBody").classList.add("normal");
    document.getElementById("ytplayer").src = music.N64_JOLLY_ROGER;
  }
}


function setInfo(temp, humidity, cityName) {
  document.getElementById("cityName").innerText = cityName;
  document.getElementById("weatherMan").innerText = temp + " F";
  document.getElementById("humidityDiv").innerText = humidity + "%";
}

function secretCheck(currentDate) {
  // if it is August 4th, the release date of PokemonXD, then...
  if ((currentDate.getMonth() === 8) && (currentDate.getDay() === 4)) {
    if (isDay(currentDate.getHours())) {
      document.getElementById("mainBody").classList.add("normal");
      document.getElementById("sun").classList.add("yellow");
      document.getElementById("ytplayer").src = PKMNXD_GATEON;
    }
  }
}


function getTheme(temp, humidity, time) {
  if (time < 18 && time >= 6) {
    // it is day
    
    document.getElementById("sun").classList.add("yellow");
    hotOrCold(temp, humidity, time);
  } else {
    // it is night
    
    document.getElementById("sun").classList.add("moon");
    hotOrCold(temp, humidity, time);
  }
}

function updateScreen(JSONobj) {
  
  let currentDate = new Date();
  let time = currentDate.getHours();
  let temp = k2f(JSONobj.main.temp);
  let humidity = JSONobj.main.humidity.toString();

  setInfo(temp, humidity, fromSearch().city);

  clearClassList(document.getElementById("sun"))
  clearClassList(document.getElementById("mainBody"))
  getTheme(temp, humidity, time);
  secretCheck(currentDate);
}

function JSONify(resp) {
  return resp.json();
}

function pullData() {
  fetch(fromSearch().OMWCALL).then(
    resp => JSONify(resp)
  ).then(
    JSONobj => updateScreen(JSONobj)
  );
}

let response = setInterval(pullData, 300000);
pullData();
document.getElementById('zipInput').addEventListener('submit', (e) => {
  e.preventDefault();
  pullData();
});