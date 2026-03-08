import { app } from "./firebase-config.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
doc,
setDoc,
getDoc,
deleteDoc,
updateDoc
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

const crearBtn = document.getElementById("crearClasse");
const container = document.getElementById("classesContainer");
const classeActualDiv = document.getElementById("classeActual");

crearBtn.addEventListener("click", crearClasse);


/* Esperar a que Firebase confirme el usuario */

onAuthStateChanged(auth, (user) => {

if(user){
carregarClasses();
}

});


/* Crear clase */

async function crearClasse(){

const nom = document.getElementById("nomClasse").value.trim();
const user = auth.currentUser;

if(!user){
alert("Usuari no autenticat");
return;
}

if(!nom) return;

await addDoc(
collection(db,"professors",user.uid,"classes"),
{
nom: nom,
createdAt: Date.now()
}
);

document.getElementById("nomClasse").value="";

carregarClasses();

}


/* Cargar clases */

async function carregarClasses(){

container.innerHTML="";

const user = auth.currentUser;

if(!user) return;

const classesRef = collection(db,"professors",user.uid,"classes");
const querySnapshot = await getDocs(classesRef);

const profRef = doc(db,"professors",user.uid);
const profSnap = await getDoc(profRef);

let classeActiva = null;

if(profSnap.exists()){
classeActiva = profSnap.data().classeActual;
}

querySnapshot.forEach((docSnap)=>{

const data = docSnap.data();
const id = docSnap.id;

const card = document.createElement("div");
card.className="card";

if(id === classeActiva){

card.classList.add("activa");
classeActualDiv.innerText = "Classe activa: " + data.nom;

}

card.innerHTML = `

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


/* Seleccionar clase */

window.seleccionarClasse = async function(id,nom){

const user = auth.currentUser;

if(!user) return;

await setDoc(doc(db,"professors",user.uid),{
classeActual:id
});

/* avisar al header */

window.dispatchEvent(new CustomEvent("classeCanviada",{
detail:{nom:nom}
}));

classeActualDiv.innerText = "Classe activa: " + nom;

carregarClasses();

}


/* Editar clase */

window.editarClasse = async function(id,nom){

const user = auth.currentUser;

if(!user) return;

const nouNom = prompt("Nou nom de la classe",nom);

if(!nouNom) return;

await updateDoc(doc(db,"professors",user.uid,"classes",id),{

nom:nouNom

});

carregarClasses();

}


/* Eliminar clase */

window.eliminarClasse = async function(id){

const user = auth.currentUser;

if(!user) return;

if(!confirm("Eliminar aquesta classe?")) return;

await deleteDoc(doc(db,"professors",user.uid,"classes",id));

carregarClasses();

}


/* Ir al menú */

window.anarMenu = function(){

window.location.href="professor.html";

}