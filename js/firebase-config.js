import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

const firebaseConfig = {
apiKey: "TU_API_KEY",
authDomain: "TU_PROJECT.firebaseapp.com",
projectId: "TU_PROJECT",
storageBucket: "TU_PROJECT.appspot.com",
messagingSenderId: "XXXX",
appId: "XXXX"
};

export const app = initializeApp(firebaseConfig);