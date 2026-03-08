async function loadHeader(){

let paths = [
"header.html",
"../header.html",
"../../header.html"
];

let headerHTML = null;

for(const path of paths){

try{

const response = await fetch(path);

if(response.ok){
headerHTML = await response.text();
break;
}

}catch(e){}

}

if(!headerHTML){
console.error("Header no encontrado");
return;
}

document.getElementById("header").innerHTML = headerHTML;

/* cargar script header */

let script = document.createElement("script");
script.type = "module";
script.src = "/js/header.js";
document.body.appendChild(script);

}

loadHeader();