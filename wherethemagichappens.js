var autocomplete;
//Goodle place api location data gets put in here os that open weather api can access it
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  var input = document.getElementById('location_autocomplete');
	autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', fill_in_form);
}

function fill_in_form() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }
	todays_forcast();
}

function todays_forcast(){
	var data_file = "http://api.openweathermap.org/data/2.5/weather?q=";
	
	var CelsiusRadioButton = document.getElementById("celsiusbutton");
	var FahrenheitRadioButton = document.getElementById("fahrenheitbutton");
	
	var wind;
	
	//Get input field and radiobuttons out of the way
	document.getElementById("location_autocomplete").style.top = "30vw";
	document.getElementById("radio_form").style.top = "35vw";

	for (var component in componentForm) {
		if(component != "") {
    	data_file = data_file + document.getElementById(component).value + ",";
		}
  }
	data_file = data_file + "&appid=b32b44cd76062059d1181f9cc3600e6e";
	//Check the unit selected
	if(CelsiusRadioButton.checked == true){
		data_file = data_file + "&units=metric";
		wind = " km/h";
	}
	if(FahrenheitRadioButton.checked == true){
		data_file = data_file + "&units=imperial";
		wind = " mph";
	}
	
	var http_request = new XMLHttpRequest();
	
	http_request.onreadystatechange = function(){
	 if (http_request.readyState == 4  ){
			var jsonObj = JSON.parse(http_request.responseText);
		 
			document.getElementById("current_temperature").innerHTML = Math.round(jsonObj.main.temp);
		 document.getElementById("current_conditions").innerHTML = jsonObj['weather'][0]['main'];
		 wind = jsonObj.wind.speed + wind;
		 document.getElementById("current_wind_speed").innerHTML = wind;
		 document.getElementById("current_humidity").innerHTML = jsonObj.main.humidity + " %";

	 }
}

http_request.open("GET", data_file, true);
http_request.send();
five_day_forcast();
}

function five_day_forcast(){
	var data_file = "http://api.openweathermap.org/data/2.5/forecast/?q=";
	//I'm actually usig the 16 day forcast data instead because it is given daily, not every 3 hours
	var CelsiusRadioButton = document.getElementById("celsiusbutton");
	var FahrenheitRadioButton = document.getElementById("fahrenheitbutton");
		
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	
	for (var component in componentForm) {
		if(component != "") {
    	data_file = data_file + document.getElementById(component).value + ",";
		}
  }
	data_file = data_file + "&appid=b32b44cd76062059d1181f9cc3600e6e";
	//Check the unit selected
	if(CelsiusRadioButton.checked == true){
		data_file = data_file + "&units=metric";
	}
	if(FahrenheitRadioButton.checked == true){
		data_file = data_file + "&units=imperial";
	}
	
	var http_request = new XMLHttpRequest();
	
http_request.onreadystatechange = function(){
	 if (http_request.readyState == 4  ){
			var jsonObj = JSON.parse(http_request.responseText);
		 	var count;
		 	//Day 1
		  var a = new Date(jsonObj['list'][0]['dt'] * 1000)
			var ad = days[a.getDay()];
			document.getElementById("day1").innerHTML = ad;
		 	document.getElementById("day1_cond").innerHTML =jsonObj['list'][1]['weather'][0]['main'];
		  document.getElementById("day1_temp").innerHTML = Math.round(jsonObj['list'][1]['main']['temp']);
			//Day 2
		 for (count = 0; count < 80; count ++) {
		 		var b = new Date(jsonObj['list'][count]['dt'] * 1000)
				var bd = days[b.getDay()];
		 		if(b.getDay() > a.getDay()){
					document.getElementById("day2").innerHTML = bd;
					document.getElementById("day2_cond").innerHTML =jsonObj['list'][count]['weather'][0]['main'];
					document.getElementById("day2_temp").innerHTML = Math.round(jsonObj['list'][count]['main']['temp']);
					break;
				}
				}
		 //Day 3
		 for (count = 0; count < 80; count ++) {
		 		var c = new Date(jsonObj['list'][count]['dt'] * 1000)
				var cd = days[c.getDay()];
		 		if(c.getDay() > b.getDay()){
					document.getElementById("day3").innerHTML = cd;
					document.getElementById("day3_cond").innerHTML =jsonObj['list'][count]['weather'][0]['main'];
					document.getElementById("day3_temp").innerHTML = Math.round(jsonObj['list'][count]['main']['temp']);

					break;
				}
				}
		 //Day 4
		 for (count = 0; count < 80; count ++) {
		 		var d = new Date(jsonObj['list'][count]['dt'] * 1000)
				var dd = days[d.getDay()];
		 		if(d.getDay() > c.getDay()){
					document.getElementById("day4").innerHTML = dd;
					document.getElementById("day4_cond").innerHTML =jsonObj['list'][1]['weather'][0]['main'];
					document.getElementById("day4_temp").innerHTML = Math.round(jsonObj['list'][count]['main']['temp']);

					break;
				}
				}
		 //Day 5
		 	for (count = 0; count < 80; count ++) {
		 		var e = new Date(jsonObj['list'][count]['dt'] * 1000)
				var ed = days[e.getDay()];
		 		if(e.getDay() > d.getDay()){
					document.getElementById("day5").innerHTML = ed;
					document.getElementById("day5_cond").innerHTML =jsonObj['list'][1]['weather'][0]['main'];
					document.getElementById("day5_temp").innerHTML = Math.round(jsonObj['list'][count]['main']['temp']);

					break;
				}
				}
	 }
}

http_request.open("GET", data_file, true);
http_request.send();
}