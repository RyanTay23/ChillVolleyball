//---------------------------------------------------------
// OFFLINE CAPABILITIES
//---------------------------------------------------------
if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
    }

//---------------------------------------------------------
// FIREBASE SERVICES
//---------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";


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
// GOOGLE OAUTH
//---------------------------------------------------------
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in

    console.log("Signed in user:", user.displayName, user.email);
    // You can show user info in the UI
  } else {
    // User is signed out
    console.log("No user signed in");
    signInWithPopup(auth, provider)
  }
  displayUser(user);
});

function displayUser(user) {
    const profile = document.getElementById("profile");
    const pfp = document.getElementById("pfp");
    pfp.src = user.photoURL;
}