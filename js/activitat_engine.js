import { app } from "./firebase-config.js";

import {
getFirestore,
doc,
setDoc,
getDoc,
updateDoc,
collection,
getDocs,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import { activitatFamilies } from "./activitats/families.js";

const db = getFirestore(app);


/* ---------- VARIABLES GLOBALS ---------- */

let activitatId = null;
let preguntesActivitat = [];
let indexPregunta = 0;

let tipusActivitat = activitatFamilies.tipus;

let tempsInicial = activitatFamilies.temps;
let temporitzador = null;
let resultatsCalculats = false;


/* ---------- DETECTAR PÀGINA ---------- */

const params = new URLSearchParams(window.location.search);
const activitatIdURL = params.get("codi");

const esLobby = document.getElementById("llistaAlumnes");
const esPantallaPregunta = document.getElementById("titolPregunta");


window.addEventListener("load",()=>{

if(esLobby){
inicialitzarLobby();
}

if(esPantallaPregunta){
inicialitzarPregunta();
}

});


/* ---------- BARREJAR ---------- */

function barrejar(array){

for(let i=array.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1));

[array[i],array[j]]=[array[j],array[i]];

}

return array;

}


/* ---------- LOBBY ---------- */

async function inicialitzarLobby(){

const codi=Math.floor(100000+Math.random()*900000).toString();

const preguntesBarrejades =
barrejar([...activitatFamilies.preguntes]);

await setDoc(doc(db,"activitats",codi),{

tipus:"families",
estat:"espera",
preguntaActual:0,
preguntes:preguntesBarrejades,
createdAt:Date.now()

});

activitatId=codi;
preguntesActivitat=preguntesBarrejades;

document.getElementById("codiActivitat").innerText=codi;

escoltarAlumnes(codi);

activarBotoComencar();

}


/* ---------- ALUMNES CONNECTATS ---------- */

function escoltarAlumnes(codi){

const playersRef=collection(db,"activitats",codi,"players");

onSnapshot(playersRef,(snapshot)=>{

const llista=document.getElementById("llistaAlumnes");

if(!llista) return;

llista.innerHTML="";

snapshot.forEach((docSnap)=>{

const li=document.createElement("li");

li.innerText=docSnap.data().nom;

llista.appendChild(li);

});

});

}


/* ---------- BOTÓ COMENÇAR ---------- */

function activarBotoComencar(){

const boto=document.getElementById("comencarActivitat");

if(!boto) return;

boto.addEventListener("click",async ()=>{

await updateDoc(
doc(db,"activitats",activitatId),
{estat:"pregunta"}
);

window.location.href=
"activitat_pregunta.html?codi="+activitatId;

});

}


/* ---------- PANTALLA PREGUNTA ---------- */

async function inicialitzarPregunta(){

activitatId = activitatIdURL;

const activitatRef = doc(db,"activitats",activitatId);

const snap = await getDoc(activitatRef);

if(!snap.exists()) return;

const data = snap.data();

preguntesActivitat = data.preguntes;

indexPregunta = data.preguntaActual || 0;

mostrarPregunta();

activarBotoSeguent();

escoltarRespostes();

}


/* ---------- MOSTRAR PREGUNTA ---------- */

function mostrarPregunta(){

const pregunta = preguntesActivitat[indexPregunta];

if(!pregunta) return;

document.getElementById("titolPregunta").innerText =
"Pregunta " + (indexPregunta+1);


/* AUDIO */

if(tipusActivitat==="audio"){

const audioPath =
"../../../assets/families/audios/"+pregunta.audio;

document.getElementById("reproductor").innerHTML=`

<audio controls autoplay>
<source src="${audioPath}" type="audio/mp3">
</audio>

`;

}


/* IMATGE */

if(tipusActivitat==="imatge"){

document.getElementById("reproductor").innerHTML=`

<img src="${pregunta.imatge}" style="max-width:500px">

`;

}


/* TEXT */

if(tipusActivitat==="text"){

document.getElementById("reproductor").innerHTML=`

<h2>${pregunta.text}</h2>

`;

}

iniciarTemporitzador();

}


/* ---------- TEMPORITZADOR ---------- */

function iniciarTemporitzador(){

let temps=tempsInicial;

const display=document.getElementById("temporitzador");

if(!display) return;

display.innerText=temps;

clearInterval(temporitzador);

temporitzador=setInterval(()=>{

temps--;

display.innerText=temps;

if(temps<=0){

clearInterval(temporitzador);

calcularResultats();

}

},1000);

}


/* ---------- NETEJAR RESPOSTES (PAS 7) ---------- */

async function netejarRespostes(){

const playersRef=
collection(db,"activitats",activitatId,"players");

const snapshot=await getDocs(playersRef);

for(const playerDoc of snapshot.docs){

await updateDoc(
doc(db,"activitats",activitatId,"players",playerDoc.id),
{
resposta:"",
timestamp:null
}
);

}

}


/* ---------- DETECTAR RESPOSTES (PAS 8) ---------- */

function escoltarRespostes(){

const playersRef =
collection(db,"activitats",activitatId,"players");

onSnapshot(playersRef,(snapshot)=>{

let total = snapshot.size;
let respostes = 0;

snapshot.forEach((docSnap)=>{

const data = docSnap.data();

if(data.resposta && data.resposta !== ""){
respostes++;
}

});

const contador =
document.getElementById("contadorRespostes");

if(contador){
contador.innerText = "Respostes: " + respostes + " / " + total;
}

if(total > 0 && respostes === total){

clearInterval(temporitzador);

calcularResultats();

}

});

}


/* ---------- CALCULAR RESULTATS ---------- */

async function calcularResultats(){

if(resultatsCalculats) return;

resultatsCalculats = true;

const playersRef=
collection(db,"activitats",activitatId,"players");

const snapshot=await getDocs(playersRef);

const respostaCorrecta=
preguntesActivitat[indexPregunta].resposta;

const respostaDiv =
document.getElementById("respostaCorrecta");

if(respostaDiv){

respostaDiv.innerText =
"Resposta correcta: " + respostaCorrecta;

}

let ranking=[];

for(const playerDoc of snapshot.docs){

const data=playerDoc.data();

let puntsActuals=data.punts||0;

if(data.resposta===respostaCorrecta){

puntsActuals+=1000;

await updateDoc(
doc(db,"activitats",activitatId,"players",playerDoc.id),
{punts:puntsActuals}
);

}

ranking.push({
nom:data.nom,
punts:puntsActuals
});

}

ranking.sort((a,b)=>b.punts-a.punts);

mostrarRanking(ranking);

}


/* ---------- MOSTRAR RANKING ---------- */

function mostrarRanking(ranking){

const rankingHTML=document.getElementById("ranking");

if(!rankingHTML) return;

rankingHTML.innerHTML="";

ranking.forEach((player)=>{

const li=document.createElement("li");

li.innerText=player.nom+" - "+player.punts;

rankingHTML.appendChild(li);

});

}


/* ---------- BOTÓ SEGÜENT ---------- */

function activarBotoSeguent(){

const boto=document.getElementById("seguentPregunta");

if(!boto) return;

boto.addEventListener("click",seguentPregunta);

}


async function seguentPregunta(){

/* desbloquejar càlcul de resultats */
resultatsCalculats = false;

/* netejar respostes dels alumnes */
await netejarRespostes();

/* passar a la següent pregunta */
indexPregunta++;

if(indexPregunta + 1 >= preguntesActivitat.length){
alert("Activitat acabada");
return;
}

/* passar a la següent pregunta */
indexPregunta++;

await updateDoc(
doc(db,"activitats",activitatId),
{
preguntaActual:indexPregunta,
estat:"pregunta"
}
);

/* netejar ranking */

const rankingDiv = document.getElementById("ranking");

if(rankingDiv){
rankingDiv.innerHTML="";
}

/* netejar resposta correcta */

const respostaDiv = document.getElementById("respostaCorrecta");

if(respostaDiv){
respostaDiv.innerText="";
}

/* reiniciar contador de respostes */

const contador = document.getElementById("contadorRespostes");

if(contador){
contador.innerText="";
}

/* mostrar nova pregunta */

mostrarPregunta();

}