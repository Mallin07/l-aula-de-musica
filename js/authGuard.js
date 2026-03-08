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
getAuth,
onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


const db = getFirestore(app);
const auth = getAuth(app);


/* Esperar a que Firebase confirme el usuario */

onAuthStateChanged(auth,(user)=>{

    if(!user){
        window.location.href="index.html";
        return;
    }

    carregarProgres(user);

});


/* Cargar progreso */

async function carregarProgres(user){

    const profSnap = await getDoc(doc(db,"professors",user.uid));

    if(!profSnap.exists()) return;

    const classeId = profSnap.data().classeActual;

    if(!classeId) return;

    const q = query(
        collection(db,"progress"),
        where("professorId","==",user.uid),
        where("classeId","==",classeId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((docSnap)=>{

        const data = docSnap.data();

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