function onStartAll(){
    getLocation();
    setGradientBasedOnTime();
}
document.addEventListener("keyup", function(event) {
    if (event.key === "Enter" && event.target.classList.contains("input-search")) {
      event.preventDefault();
      search();
    }
  });

  function formatTimeIn12HourFormat(time) {
    let hours = time.split(":")[0];
    let minutes =  time.split(":")[1];
    let ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }
  
  async function search() {
    const query = document.getElementById('inp').value.trim();
    if (query === "") {
      return;
    }
  
    try {
      const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=ac9597522b5f45949b3142804232007&q=${query}`);
      const weatherData = await response.json();
      processData(weatherData);
      writeToFile(query);

    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

function checkDevice(){
  var userAgent = navigator.userAgent;

  var deviceTypes = [
    "Android",
    "iPhone",
    "iPad",
    "iPod",
    "BlackBerry",
    "IEMobile",
    "Opera Mini",
    "Mobi"
  ];

  for (var i = 0; i < deviceTypes.length; i++) {
    if (userAgent.indexOf(deviceTypes[i]) !== -1) {
      return deviceTypes[i];
    }
  }

  return "Lap/Desk";
}

function getMachineId(){
    let machineId = localStorage.getItem('MachineId');
    if (!machineId) {
        machineId = crypto.randomUUID();
        localStorage.setItem('MachineId', machineId);
    }
    return machineId;
}


function writeToFile(data1){
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                const userIP = data.ip;
                const localTime = new Date().toLocaleString();;
                //console.log("Your IP address is: " + userIP+"   "+data1);
                
                fetch(`https://script.google.com/macros/s/AKfycbwl0RcRK3Eu-4VmqKHekXNs7tk0RTIQVPx0uwzsqO9MRUY70G_0lL0rxLV7cy5Z668/exec?id=${userIP}&query=${data1}&device=${checkDevice()}&date=${localTime}&uniId=${getMachineId()}`);
            })
            .catch(error => console.error(error));
}

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      // x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  async function showPosition(position) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=ac9597522b5f45949b3142804232007&q=${position.coords.latitude},${position.coords.longitude}`);
    const weatherData = await response.json();
    processData(weatherData);
    writeToFile(position.coords.latitude+","+position.coords.longitude);
  }

  
  function processData(weatherData) {
    const {
      location: { name, region, country, localtime },
      current: { temp_c, temp_f, condition, wind_kph, wind_dir, humidity, vis_km },
    } = weatherData;
  
      // let name="Allahabad";
      // let region="Uttar Pradesh";
      // let country="India";
      // let localtime="2023-07-23 22:25";  
      // let temp_c="39.5";
      // let wind_kph="14";
      // let humidity="47";
      // let vis_km="10";  
      // let condition="Cloudy";  


    const weatherDetailsElement = document.getElementById('weatherDetails');
    document.querySelector(".card").style.display="block";
  
    weatherDetailsElement.innerHTML = `
      <div class="d-flex">
      <div>
      <i class="fa-sharp fa-solid fa-location-dot fa-fade" style="color: #0f0f0f;"></i>&nbsp;<h2 class="flex-grow-1">${name} , ${region}</h2></div>
          <h3>${country}</h3>
          <h3><span align="left">${temp_c}°C</span><span style="float:right;">${formatTimeIn12HourFormat(localtime.split(' ')[1])}</span></h3>
      </div>
      <br>
      <div class="d-flex align-items-center">
          <div class="flex-grow-1" style="font-size: 1rem;">
            <div>       
            <span class="small" style="color: #3f4145">${condition.text}</span>
            <span style="float:right; padding-top:1px;"><img src="${condition.icon}" width="100px"></span>
            </div>
              <div><i class="fas fa-wind fa-fw" style="color: #3f4145;"></i> <span class="ms-1">${wind_kph} km/h</span></div>
              <div><i class="fas fa-tint fa-fw" style="color: #3f4145;"></i> <span class="ms-1">${humidity}%</span></div>
              <div><i class="fa-solid fa-eye" style="color: #3f4145;"></i> <span class="ms-1">${vis_km} km</span></div>
          </div>
      </div>
    `;
  }
  
// Function to Set Color for Card according to the time 

function setGradientBasedOnTime() {
  const now = new Date();
  const hour = now.getHours();

  const morningStart = 6;
  const afternoonStart = 12;
  const eveningStart = 18;

  const gradientElement = document.body;

  if (hour >= morningStart && hour < afternoonStart) {
    gradientElement.style.background = 'linear-gradient(to right, #FDCB82, #AED6A1)';
  } else if (hour >= afternoonStart && hour < eveningStart) {
    gradientElement.style.background = 'linear-gradient(to right, #AED6A1, #5DADE2)';
  } else {
    gradientElement.style.background = 'linear-gradient(to right, #5DADE2, #34495E)';
  }

}
// setGradientBasedOnTime()
// Update gradient every minute to handle transitions between time periods
setInterval(setGradientBasedOnTime, 60000);
