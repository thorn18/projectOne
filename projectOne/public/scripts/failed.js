console.log("hello");
let failB = document.getElementById("goback");
if(failB) {
    console.log("hello");
}
failB.addEventListener("click",()=> {
    window.location.href = "../login.html";
},true)