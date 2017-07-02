//Steven Benjamin - 2450 Team Project - getWeather

//US ISO 3166 country code.
var countryCode = "840";
var country="us";
var zip;

//html elements

//number of dayts to forecast, 16 is the max
var forecastLength = 2;


$(document).ready(function getPosition() 
{
    
  // Find the longitude and latitude based on the users ip.
  var location = "http://ip-api.com/json";

  $.getJSON(location, function(json) 
  {

    lat = json.lat;
    lon = json.lon;

    //Get the current weather data from the open weather API
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e", function(json) 
    {
    //console.log(json);
      var country = json.sys.country;
      var city = json.name;
      var location = city + ", " + country;
      

      //Let's see if that worked...
      console.log(city);
      console.log(country);

      //how to get the weather description
      var weather = json.weather[0].description;
      console.log(weather);

      //using the temprature converter
      var temp = json.main.temp;
      var getTemp = new convertTemp(temp);
     
      console.log(getTemp.celcius());
      console.log(getTemp.frnht());
      
      document.getElementById("currentTemp").innerHTML = getTemp.frnht()+"°";
      document.getElementById("currentImg").src = weatherImg(weather);
      document.getElementById("currentImg").alt = weather;
      
              //the forecast
              $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?q='+ city +','+ country + '&cnt=' + forecastLength + '&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e',function(json)
              {
               
                //console.log(json);  
                

                
                //how to get a date item from the retrieved forecast list...
                var currentForecast = json.list[1].dt;
                var date = new convertDate(currentForecast);
               
                console.log(date.month());
                console.log(date.date());

                var temp = json.list[1].temp.day;
                //console.log(temp);
    
    
              });

    });
  });
});


//If we have a zip code...
  function zipcodeForecast()
  {

    $.getJSON("http://api.openweathermap.org/data/2.5/weather?zip="+ zip +"," + country + "&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e",function(json)
    {

      var country = json.sys.country;
      var city = json.name;
      var location = city + ", " + country;

      //Let's see if that worked...
      console.log(city);
      console.log(country);


      var weather = json.weather[0].description;

      var temp = json.main.temp;
      
      //using the temprature converter
      var getTemp = new convertTemp(temp);
      console.log(getTemp.celcius());
      console.log(getTemp.frnht());
      
      $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?q='+ city +','+ country + '&cnt=' + forecastLength + '&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e',function(json)
       {
        //console.log(json); 
        
       });
    });
   }


   //If we have a city name...
  function cityForecast(city)
  {

    $.getJSON('api.openweathermap.org/data/2.5/weather?q='+ city +','+ countryCode +'&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e',function(json)
    {

      var country = json.sys.country;
      var city = json.name;
      var location = city + ", " + country;

      //Let's see if that worked...
      console.log(city);
      console.log(country);


      var weather = json.weather[0].description;

      var temp = json.main.temp;
      
      //using the temprature converter
      var getTemp = new convertTemp(temp);
      console.log(getTemp.celcius());
      console.log(getTemp.frnht());
      
      $.getJSON('http://api.openweathermap.org/data/2.5/forecast/daily?q='+ city +','+ country + '&cnt=' + forecastLength + '&APPID=ccd8e53c44061ba9fa3596d8aa75cc5e',function(json)
       {
        //console.log(json); 
        
       });
    });
   }

   
  //converts a unix time stamp to a usable date
  function convertDate(unixDate)
  {
      var a = new Date(unixDate * 1000);
      var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      
      return{
      year: function(){ return a.getFullYear();},
      month: function(){ return months[a.getMonth()];},
      date: function(){ return a.getDate();},
      hour: function(){ return a.getHours();},
      min: function(){ return a.getMinutes();},
      sec: function(){ return a.getSeconds();}
      };
  }
  

  //converts kelvin to celcius of fahrenheit
  function convertTemp(temp)
  {
      var c = Math.round((temp - 273.15));
      
      return{
      celcius : function(){return c;},
      frnht : function(){return Math.round(c * 1.8 + 32);}
      };
    
  }
  

 //Gets the zip code for a specified area
  function getZip(city, state)
  {
    var zip;
    
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',' + state + '&sensor=true', function(json)
    {
      console.log(json);
      
      zip = json.results[0].address_components[4].long_name;
      console.log(zip);
      
      //if the city and state are invalid, json.status = ZERO_RESULTS
      
    });
    
    return zip;
    
  }

 //Corrects the spelling of a user entered city.
  function checkCity(city, state)
  {
    var c;
    
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',' + state + '&sensor=true', function(json)
    {
      console.log(json);
      
      //todo
      
      //if the city and state are invalid, json.status = ZERO_RESULTS
      
    });
    
    return c;
    
  }

//only to be used until the images in /png are named after the weather ID codes found here: http://openweathermap.org/weather-conditions
function weatherImg(weather)
{

  
  var imgName = null;
  
  switch (weather) 
  {
    case 'clear sky': 
      {
        imgName = 'png/sunny-day.png';
        break;
      }
      
    case 'few clouds': 
      {
        imgName = 'png/partialy-cloudy.png';
        break;
      }
      
    case 'scattered clouds': 
      {
        imgName = 'png/cloudy-day.png';
        break;
      }
      
    case 'broken clouds': 
      {
        imgName = 'png/overcast-day.png';
        break;
      }
      
    case 'thunderstorm': 
      {
        imgName = 'png/lighting.png';
        break;
      }
      
    case 'rain': 
      {
        imgName = 'png/rainy-day.png';
        break;
      }
      
    case 'shower rain': 
      {
        imgName = 'png/pour-rain.png';
        break;
      }
      
    case 'snow': 
      {
        imgName = 'png/cold.png';
        break;
      }
      
      
}
return imgName;
  
  
}
