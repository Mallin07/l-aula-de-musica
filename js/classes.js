import { app } from "./firebase-config.js";

import {
getFirestore,
collection,
addDoc,
query,
where,
getDocs,
doc,
setDoc,
getDoc,
deleteDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
getAuth
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

const crearBtn = document.getElementById("crearClasse");
const container = document.getElementById("classesContainer");
const classeActualDiv = document.getElementById("classeActual");

crearBtn.addEventListener("click", crearClasse);

window.addEventListener("load", carregarClasses);

async function crearClasse(){

const nom = document.getElementById("nomClasse").value;
const user = auth.currentUser;

if(!nom) return;

await addDoc(collection(db,"classes"),{

nom: nom,
professorId: user.uid

});

document.getElementById("nomClasse").value="";

carregarClasses();

}

async function carregarClasses(){

container.innerHTML="";

const user = auth.currentUser;

const q = query(
collection(db,"classes"),
where("professorId","==",user.uid)
);

const querySnapshot = await getDocs(q);

const profRef = doc(db,"professors",user.uid);
const profSnap = await getDoc(profRef);

let classeActiva=null;

if(profSnap.exists()){
classeActiva=profSnap.data().classeActual;
}

querySnapshot.forEach((document)=>{

const data=document.data();
const id=document.id;

const card=document.createElement("div");
card.className="card";

if(id===classeActiva){

card.classList.add("activa");
classeActualDiv.innerText="Classe activa: "+data.nom;

}

card.innerHTML=`

<h3>${data.nom}</h3>

<button onclick="seleccionarClasse('${id}','${data.nom}')">
Seleccionar
</button>

<button onclick="editarClasse('${id}','${data.nom}')">
Editar
</button>

<button onclick="eliminarClasse('${id}')">
Eliminar
</button>

`;

container.appendChild(card);

});

}

window.seleccionarClasse=async function(id,nom){

const user=auth.currentUser;

await setDoc(doc(db,"professors",user.uid),{

classeActual:id

});

classeActualDiv.innerText="Classe activa: "+nom;

carregarClasses();

}

window.editarClasse=async function(id,nom){

const nouNom=prompt("Nou nom de la classe",nom);

if(!nouNom) return;

await updateDoc(doc(db,"classes",id),{

nom:nouNom

});

carregarClasses();

}

window.eliminarClasse=async function(id){

if(!confirm("Eliminar aquesta classe?")) return;

await deleteDoc(doc(db,"classes",id));

carregarClasses();

}

window.anarMenu=function(){

window.location.href="professor.html";

}