import { doc, getFirestore, updateDoc, setDoc, getDoc, arrayUnion, Timestamp, query, where, increment, getDocs, collection } from "firebase/firestore";
import { app } from './firebaseInit';
import DonutChart from 'donut-chart-js';

let db = getFirestore(app);

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
var transactBtn = document.getElementById("transact-btn");
var usernameTxt = document.getElementById("username");
var newAccountName = document.getElementById("account-name");
var newAccountAmount = document.getElementById("account-amount");
var newAccountBtn = document.getElementById("new-account-btn");

let userEmail = sessionStorage.getItem('userEmail');
let staticUserData;
console.log(userEmail)
let curBalance = 0;
let totalExpense = 0;
let totalIncome = 0;

window.onload = () => {
  getData();
  usernameTxt.innerText = userEmail;
}

transactBtn.addEventListener("click", () => {
  let objAmount = document.querySelector("#transaction").value;
  let objType = document.querySelector('input[name="payment"]:checked').value;
  let objCategory = document.querySelector('input[name="category"]:checked').value;
  
  var e = document.getElementById("transaction-dd");
  var objMethod = e.options[e.selectedIndex].text;

  if(objAmount != "" || objType != "" || objCategory != "" || objMethod != ""){
    addTransaction();
    createChart();
  } else {
    alert("Please Select All Fields");
  }

})

const calculateBalance = (userData) => {
  let curCash = 0;
  let curSaving = 0;
  let curBank = 0;

  userData.history.map((item) => {
    if(item.method == "Cash"){
      if(item.type == "Income"){
        curCash += parseInt(item.amount);
        totalIncome += parseInt(item.amount);
      } else if (item.type == "Expense"){
        curCash -= parseInt(item.amount);
        totalExpense += parseInt(item.amount);
      }
    } else if(item.method == "Savings"){
      if(item.type == "Income"){
        curSaving += parseInt(item.amount);
        totalIncome += parseInt(item.amount);
      } else if (item.type == "Expense"){
        curSaving -= parseInt(item.amount);
        totalExpense += parseInt(item.amount);
      }
    } else {
      if(item.type == "Income"){
        curSaving += parseInt(item.amount);
        curBank += parseInt(item.amount);
        totalIncome += parseInt(item.amount);
      } else if (item.type == "Expense"){
        curSaving -= parseInt(item.amount);
        curBank -= parseInt(item.amount);
        totalExpense += parseInt(item.amount);
      }
    }
  })

  let bankBalance = 0;

  if(userData.bank.length > 2) {
    userData.bank.forEach((bank) => {
      if(bank.bankName !== "Cash" && bank.bankName !== "Savings"){
        bankBalance += parseInt(bank.bankAmount);
      }
    })
  }

  curBalance = (curCash) + (curSaving) + (bankBalance);
  
  document.querySelector("#cur-cash").innerHTML = curCash;
  document.querySelector("#cur-savings").innerHTML = curSaving;
  document.querySelector("#cur-balance").innerHTML = "PKR " + curBalance;
  document.querySelector(".cur-cash").innerHTML = "PKR " + curCash;
  document.querySelector("#cur-bank").innerHTML =  bankBalance;
  document.querySelector(".cur-savings").innerHTML = "PKR " + curSaving;
  createChart();
  setBalances(userData, curCash, curSaving);
}

newAccountBtn.addEventListener("click", () => {
  addBank();
})

const setBalances = async (userData, curCash, curSaving) => {
  let bankDetails = []
  userData.bank.forEach((bank) => {
    let newName = bank.bankName
    let newBal = bank.bankAmount
    if(newName == "Cash"){
      bankDetails.push({bankName: "Cash", bankAmount: curCash})
    } else if(newName == "Savings"){
      bankDetails.push({bankName: "Savings", bankAmount: curSaving})
    } else {
      bankDetails.push({bankName: newName, bankAmount: newBal})
    }
  })

  const newTransaction = doc(db, "user", userEmail);
  await updateDoc(newTransaction, {
    bank: (bankDetails)
  });

  
}

const addBank = async () => {
  let newAccountNameTxt = newAccountName.value;
  let newAccountBal = newAccountAmount.value;

  const newTransaction = doc(db, "user", userEmail);
  await updateDoc(newTransaction, {
    bank: arrayUnion({bankName: newAccountNameTxt, bankAmount: newAccountBal})
  });

  location.reload();
}

const getBank = async () => {
  const docRef = doc(db, "user", userEmail);
  const docSnap = await getDoc(docRef);

  let bankContainer = document.querySelector(".body");
  let transactionDropBox = document.querySelector("#transaction-dd");

  if (docSnap.exists()) {
    let userData = docSnap.data();
    let bankData = userData.bank

    if(bankData.length > 0){
      let html = '';
      bankData.forEach((bank) => {
        html += `
        <div class="sub-body">
        <h3>${bank.bankName}</h3>
        <h3 class="cur-${bank.bankName.toLowerCase()}">${'PKR ' + bank.bankAmount}</h3>
    </div>`
      })
      bankContainer.innerHTML = html;
    }

    if(bankData.length > 0) {
      let html = '';
      bankData.forEach((bank) => {
        html += `
        <option value="${bank.bankName}">${bank.bankName}</option>
        `
      })

      transactionDropBox.innerHTML = html;
    }
  }
}

const addTransaction = async () => {
  let dataObj = getTransactionData();

  console.log(dataObj);

  const newTransaction = doc(db, "user", userEmail);
  await updateDoc(newTransaction, {
    history: arrayUnion(dataObj)
  });

  const docRef = doc(db, "user", userEmail);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let userData = docSnap.data();
    getTransactionHistory(userData);
    calculateBalance(userData);
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }

  

}

const getTransactionHistory = async (userData) => {
  let html = ''
  userData.history.forEach((transaction) => {
    if(transaction.type == "Income"){
      html += `
      <ul>
      <li> <strong>${transaction.category}</strong> </li>
      <li> ${transaction.method} </li>
      <li> ${transaction.timestamp} </li>
      <li class="green"> ${"PKR " + transaction.amount} </li>
      </ul>
      `
    } else if (transaction.type == "Expense"){
      html += `
      <ul>
      <li> <strong>${transaction.category}</strong> </li>
      <li> ${transaction.method} </li>
      <li> ${transaction.timestamp} </li>
      <li class="red"> ${"PKR " + transaction.amount} </li>
      </ul>
      `
    }
  })
  document.querySelector(".transaction-ul").innerHTML = html;
}

const getTransactionData = () => {
  let objAmount = document.querySelector("#transaction").value;
  let objType = document.querySelector('input[name="payment"]:checked').value;
  let objCategory = document.querySelector('input[name="category"]:checked').value;
  
  var e = document.getElementById("transaction-dd");
  var objMethod = e.options[e.selectedIndex].text;

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;
  let objTimestamp = today;

  let obj = {
    category: objCategory,
    type: objType,
    method: objMethod,
    timestamp: objTimestamp,
    amount: objAmount
  }

  return obj
}

const getData = async () => {
  const docRef = doc(db, "user", userEmail);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let userData = docSnap.data();
    staticUserData = userData;
    calculateBalance(userData);
    expandCategory(userData);
    getTransactionHistory(userData);
    getBank();
    console.log("Document data:", docSnap.data());
  } else {
    console.log("No such document!");
  }
}

const expandCategory = (userData) => {
  let html = '';
  userData.category.forEach((data) => {
    html += `<input type="radio" id="${data.toLowerCase()}" name="category" value="${data}">
    <label for="${data}">${data}</label><br>`
  })
  document.querySelector('.cat-container').innerHTML = html;
}

const createChart = () => {
  new DonutChart(document.getElementById('myChart'), {
    data: [
      { label: 'red', value: totalExpense, color: '#FD5151ED' },
      { label: 'green', value: totalIncome, color: '#1A9E57' },
    ],
    holeSize: 0.6,
    animationSpeed: 0.5,
  });
}

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
