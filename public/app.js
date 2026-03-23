
//---------------------------------------------------------
// INSTALL BUTTON
//---------------------------------------------------------
let deferredPrompt;

// Detect if app is already installed
window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
});

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome from showing the default prompt
  e.preventDefault();
  deferredPrompt = e;

  // Show your custom install button
  const installBtn = document.getElementById('installBtn');
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', async () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt(); // Show the install prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    deferredPrompt = null;
  });
});


//---------------------------------------------------------
// LOG ARRIVAL
//---------------------------------------------------------
function logArrival() {
    startBtn = document.getElementById('startSesh');
    endBtn = document.getElementById('endSesh');

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
        startBtn.style.display = 'none';
        endBtn.style.display = 'block';
        // Save arrival to database
    } else {
      alert(`Your coordinates are (${lat}, ${lon}). You are not at the court!`);
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

function stopTimer() {
  clearInterval(timerInterval);
  alert(`Session ended. Total time: ${(elapsedTime / 60000).toFixed(2)} minutes.`);
}