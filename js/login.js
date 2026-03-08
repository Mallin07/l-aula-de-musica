import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { 
getFirestore,
doc,
setDoc
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { app } from "./firebase-config.js";

const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", login);

async function login(){

const email = document.getElementById("email").value.trim();
const password = document.getElementById("password").value;

if(!email || !password){
alert("Introdueix correu i contrasenya");
return;
}

try{

const userCredential = await signInWithEmailAndPassword(auth,email,password);

const user = userCredential.user;

/* guardar profesor en Firestore */

await setDoc(
doc(db,"professors",user.uid),
{
email:user.email,
createdAt:Date.now()
},
{ merge:true }
);

/* redirigir */

window.location.href="classes.html";

}

catch(error){

console.error(error);
alert("Error d'accés");

}

}


/* acceso alumno */

window.entrarAlumne = function(){

window.location.href="alumnes/alumne.html";

}