import { app } from "./firebase-config.js";

import {
getFirestore,
collection,
query,
where,
getDocs,
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
getAuth
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

window.addEventListener("load", carregarProgres);

async function carregarProgres(){

const user = auth.currentUser;

if(!user) return;

const profSnap = await getDoc(doc(db,"professors",user.uid));

if(!profSnap.exists()) return;

const classeId = profSnap.data().classeActual;

const q = query(
collection(db,"progress"),
where("professorId","==",user.uid),
where("classeId","==",classeId)
);

const querySnapshot = await getDocs(q);

querySnapshot.forEach((document)=>{

const data = document.data();

const btn = document.getElementById(data.activitat);

if(btn){

btn.classList.remove("pendent");

if(data.estat === "completat"){
btn.classList.add("completat");
}

if(data.estat === "progres"){
btn.classList.add("progres");
}

}

});

}

window.anarPagina=function(pagina){

window.location.href=pagina;

}