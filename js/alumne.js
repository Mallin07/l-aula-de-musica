import { app } from "./firebase-config.js";

import { getFirestore, doc, getDoc } 
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore(app);

document.getElementById("entrarClasse").addEventListener("click", entrarClasse);

async function entrarClasse(){

const codi = document.getElementById("codiClasse").value;

const docRef = doc(db,"classes",codi);
const docSnap = await getDoc(docRef);

if(docSnap.exists()){

window.location.href="espera.html";

}else{

document.getElementById("error").innerText="Codi incorrecte";

}

}