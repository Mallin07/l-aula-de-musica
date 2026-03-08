import { app } from "./firebase-config.js";

import {
getFirestore,
doc,
getDoc,
setDoc
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore(app);

document
.getElementById("entrarClasse")
.addEventListener("click",entrarClasse);


async function entrarClasse(){

const codi = document.getElementById("codiClasse").value.trim();
const nom = document.getElementById("nomAlumne").value.trim();

if(!nom){
document.getElementById("error").innerText="Introdueix el teu nom";
return;
}

const docRef = doc(db,"activitats",codi);
const docSnap = await getDoc(docRef);

if(!docSnap.exists()){

document.getElementById("error").innerText="Codi incorrecte";
return;

}

/* guardar alumne */

await setDoc(
doc(db,"activitats",codi,"players",nom),
{
nom:nom,
punts:0,
resposta:"",
joinedAt:Date.now()
}
);

/* guardar localment */

localStorage.setItem("nomAlumne",nom);
localStorage.setItem("activitatId",codi);

/* anar a sala d'espera */

window.location.href="espera.html";

}