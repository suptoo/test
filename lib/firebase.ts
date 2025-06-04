import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDD1xBc1WRkKfvEWahM0fmGGj7zDkhrll0",
  authDomain: "resturant-app-b444c.firebaseapp.com",
  projectId: "resturant-app-b444c",
  storageBucket: "resturant-app-b444c.firebasestorage.app",
  messagingSenderId: "437910509347",
  appId: "1:437910509347:web:5ee03ef20a6a729b519e96",
  measurementId: "G-7L8KYR9547",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

export default app
