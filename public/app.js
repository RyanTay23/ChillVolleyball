//---------------------------------------------------------
// PROMPT TOGGLING
//---------------------------------------------------------
function closePrompt() {
    const prompt = document.getElementsByClassName('prompt');
    for (let i = 0; i < prompt.length; i++) {
        prompt[i].classList.add('hide');
    }
    const container = document.getElementsByClassName('container');
    for (let i = 0; i < container.length; i++) {
        container[i].classList.remove('blur');
    }
}

function showPrompt(){
    const prompt = document.getElementsByClassName('prompt');
    for (let i = 0; i < prompt.length; i++) {
        prompt[i].classList.remove('hide');
    }
    const container = document.getElementsByClassName('container');
    for (let i = 0; i < container.length; i++) {
        container[i].classList.add('blur');
    }
}

//---------------------------------------------------------
// INSTALL PROMPT
//---------------------------------------------------------
let deferredPrompt;

window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
});

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome from showing the default prompt
  e.preventDefault();
  deferredPrompt = e;

  // Show your custom install button
  const installBtn = document.getElementById('installBtn');
  installBtn.addEventListener('click', async () => {
    console.log("Install button clicked");
    // Hide install prompt
    closePrompt();
    // Show the default install prompt
    deferredPrompt.prompt(); 
    // const { outcome } = await deferredPrompt.userChoice;
    // console.log(`User response: ${outcome}`);

    //resets the prompt so it can be triggered again if needed
    deferredPrompt = null; 
  });
});


//---------------------------------------------------------
// LOG ARRIVAL
//---------------------------------------------------------
function logArrival() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Court coordinates (example)
    const courtLat = 1.2973345895226682;
    const courtLon = 103.76073296128051;
    const allowedRadius = 50; // meters

    if (getDistance(lat, lon, courtLat, courtLon) <= allowedRadius) {
        startTimer();
        console.log('Arrived at the court!');
        // Save arrival to database
    } else {
      console.log(`You are not at the court!`);
    }
  });
}

// Haversine formula to calculate distance between 2 GPS points
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // meters
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

//---------------------------------------------------------
// TIMER
//---------------------------------------------------------

let startTime;
let timerInterval;
let elapsedTime = 0; // milliseconds

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  elapsedTime = Date.now() - startTime; // milliseconds
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  
  document.getElementById('timer').innerText =
    `${hours.toString().padStart(2,'0')}:` +
    `${minutes.toString().padStart(2,'0')}:` +
    `${seconds.toString().padStart(2,'0')}`;
}

// function stopTimer() {
//   clearInterval(timerInterval);
//   document.getElementById('timer').innerText = '00:00:00';
//   const duration = msToHMS(elapsedTime);
//   console.log(`Session duration: ${duration.hours}h ${duration.minutes}m ${duration.seconds}s`);
// }

function msToHMS(ms) {
  let totalSeconds = Math.floor(ms / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}



