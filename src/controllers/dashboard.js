import { doc, setDoc, Timestamp } from "firebase/firestore";


// console.log(app);

let userEmail = sessionStorage.getItem('userEmail');


var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

console.log(userEmail)
btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
