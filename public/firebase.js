//---------------------------------------------------------
// OFFLINE CAPABILITIES
//---------------------------------------------------------
if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');}

//---------------------------------------------------------
// FIREBASE SERVICES
//---------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { doc, setDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
const firebaseConfig = {
            apiKey: "AIzaSyAKzwVOCg-4sv88dS991lGGTmmLQkkYfUc",
            authDomain: "chillvolleyball-d1394.firebaseapp.com",
            projectId: "chillvolleyball-d1394",
            storageBucket: "chillvolleyball-d1394.firebasestorage.app",
            messagingSenderId: "444423349699",
            appId: "1:444423349699:web:45fbdb5cbeeb9a81a38976",
            measurementId: "G-ZR758VFKBM"
        };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

//---------------------------------------------------------
// DATA MANAGEMENT
//---------------------------------------------------------
async function saveUserToDatabase(user) {
  if (!user) return;

  // Reference to a document with UID as key
  const userRef = doc(db, "Players", user.uid);

  await setDoc(userRef, {
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  }, { merge: true }); // merge ensures existing data isn't overwritten
}

// Real-time leaderboard updates
onSnapshot(collection(db, "Players"), (snapshot) => {
  const leaderboard = [];

  snapshot.forEach((doc) => {
    leaderboard.push(doc.data());
  });

  leaderboard.sort((a, b) => b.XP - a.XP);
  displayLeaderboard(leaderboard);
});

function displayLeaderboard(users) {
  const container = document.getElementById("leaderboard");
  container.innerHTML = "";

  users.forEach((user, index) => {
    const div = document.createElement("div");
    div.classList.add("player");
    div.innerHTML = `
      <span>#${index + 1}</span>
      <img src="${user.photoURL}" width="30">
      <span>${user.name}</span>
      <span>${user.XP || 0}xp</span>
    `;

    container.appendChild(div);
  });
}

async function calcXP(duration) {
  const user = auth.currentUser;
  if (!user) return; // Ensure user is logged in before calculating XP
  const mins = duration / 60000;
  await setDoc(doc(db, "Players", user.uid), { XP: mins }, { merge: true });
}
calcXP(elapsedTime);
//---------------------------------------------------------
// GOOGLE OAUTH
//---------------------------------------------------------
function displayUser(user) {
    const profile = document.getElementById("profile");
    const pfp = document.getElementById("pfp");
    pfp.src = user.photoURL;
}
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("Signed in user:", user.displayName, user.email);
    saveUserToDatabase(user);
    // You can show user info in the UI
  } else {
    // User is signed out
    console.log("No user signed in");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user; // Firebase User object
        saveUserToDatabase(user);
      })
  }
  displayUser(user);
});
