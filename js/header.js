import { app } from "./firebase-config.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

function initHeader(){

  const classeTop = document.getElementById("classeActualTop");
  const userEmail = document.getElementById("userEmail");

  if(!classeTop || !userEmail){
    setTimeout(initHeader,100);
    return;
  }

  /* escuchar cambio de clase en tiempo real desde classes.js */

  window.addEventListener("classeCanviada",(e)=>{

    if(classeTop){
      classeTop.innerText = e.detail.nom;
    }

  });


  onAuthStateChanged(auth, async (user)=>{

    if(!user){
      classeTop.innerText="Cap";
      return;
    }

    userEmail.innerText = user.email;

    try{

      const profRef = doc(db,"professors",user.uid);
      const profSnap = await getDoc(profRef);

      if(!profSnap.exists()){
        classeTop.innerText="Cap";
        return;
      }

      const classeId = profSnap.data().classeActual;

      if(!classeId){
        classeTop.innerText="Cap";
        return;
      }

      const classeRef = doc(db,"professors",user.uid,"classes",classeId);
      const classeSnap = await getDoc(classeRef);

      if(classeSnap.exists()){
        const data = classeSnap.data();
        classeTop.innerText = data.nom || "Cap";
      }else{
        classeTop.innerText="Cap";
      }

    }catch(error){
      console.error("Error cargando clase:",error);
      classeTop.innerText="Cap";
    }

  });

}

initHeader();


/* logout */

window.logout = function(){
  signOut(auth);
  window.location.href="index.html";
};