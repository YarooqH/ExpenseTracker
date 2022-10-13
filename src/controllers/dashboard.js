import { doc, getFirestore, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { app } from './firebaseInit';
// console.log(app);

let db = getFirestore(app);

// let userData;
let userEmail = sessionStorage.getItem('userEmail');
let curBalance = 0;

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

window.onload = () => {
  getData();
}

const calculateBalance = (userData) => {
  let curCash, curSaving
  userData.balance.map((i) => {
    curBalance += i.balance;
    console.log(i.method)
    if(i.method === "Cash"){
      curCash = i.balance;
    } else if (i.method === "Savings"){
      curSaving = i.balance;
    }
  })
  document.querySelector("#cur-balance").innerHTML = "PKR " + curBalance;

  document.querySelector("#cur-cash").innerHTML = curCash;
  document.querySelector("#cur-saving").innerHTML = curSaving;
  document.querySelector(".cur-cash").innerHTML = "PKR " + curCash;
  document.querySelector(".cur-saving").innerHTML = "PKR " + curSaving;

  // console.log(curBalance)
}

const addTransaction = async () => {
  let amount = document.querySelector(".transaction").value
  const newTransaction = doc(db, "user", userEmail);
  await updateDoc(newTransaction, {
  });
}



const getData = async () => {
  const docRef = doc(db, "user", userEmail);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let userData = docSnap.data();
    calculateBalance(userData);
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
}
  // console.log(userEmail)
  btn.onclick = function() {
    modal.style.display = "block";
    getData();
  }
  
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
