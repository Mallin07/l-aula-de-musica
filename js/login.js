import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);

document.getElementById("loginBtn").addEventListener("click", login);

function login(){

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

signInWithEmailAndPassword(auth,email,password)
.then((userCredential)=>{

window.location.href="classes.html";

})
.catch((error)=>{

alert("Error d'accés");

});

}

window.entrarAlumne=function(){
window.location.href="alumne.html";
}