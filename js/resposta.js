import { app } from "./firebase-config.js";

import {
getFirestore,
doc,
updateDoc,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore(app);


/* ---------- VARIABLES ---------- */

const activitatId = localStorage.getItem("activitatId");
const nom = localStorage.getItem("nomAlumne");

let preguntaActualLocal = -1;

if(!activitatId || !nom){

window.location.href="alumne.html";

}


/* ---------- ESCOLTAR ACTIVITAT ---------- */

onSnapshot(
doc(db,"activitats",activitatId),
(docSnap)=>{

const data = docSnap.data();

if(!data) return;

if(data.estat === "pregunta"){

if(data.preguntaActual !== preguntaActualLocal){

preguntaActualLocal = data.preguntaActual;

mostrarPregunta(preguntaActualLocal);

}

}

}
);


/* ---------- MOSTRAR PREGUNTA ---------- */

function mostrarPregunta(num){

document.getElementById("missatge").innerText = "";

document.getElementById("respostaInput").value = "";

document.getElementById("respostaInput").disabled = false;

document.getElementById("enviarResposta").disabled = false;

}


/* ---------- ENVIAR RESPOSTA ---------- */

document
.getElementById("enviarResposta")
.addEventListener("click",enviarResposta);


async function enviarResposta(){

const resposta = document
.getElementById("respostaInput")
.value
.trim()
.toLowerCase();

if(!resposta){

document.getElementById("missatge").innerText =
"Escriu una resposta";

return;

}

await updateDoc(
doc(db,"activitats",activitatId,"players",nom),
{
resposta:resposta,
timestamp:Date.now()
}
);

document.getElementById("respostaInput").disabled = true;

document.getElementById("enviarResposta").disabled = true;

document.getElementById("missatge").innerText =
"Resposta enviada!";

}