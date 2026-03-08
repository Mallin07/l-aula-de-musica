import { app } from "./firebase-config.js";

import {
getFirestore,
doc,
onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const db = getFirestore(app);

const activitatId = localStorage.getItem("activitatId");

if(!activitatId){

window.location.href="alumne.html";

}

onSnapshot(
doc(db,"activitats",activitatId),
(docSnap)=>{

const data = docSnap.data();

if(data.estat === "pregunta"){

window.location.href="resposta.html";

}

}
);