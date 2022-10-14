import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from './firebaseInit';
// import app from './firebaseInit.js'

const auth = getAuth(app);

let signUpEmail = document.querySelector("#signup-email");
let signUpPassword = document.querySelector("#signup-password");
let signUpName = document.querySelector("#signup-name");
let signUpBtn = document.querySelector("#signup-btn");
// let dbUserName;

signUpBtn.addEventListener("click", signUp);

function signUp() {
    let userEmail, userPass, userName;

    userEmail = signUpEmail.value;
    userName = signUpName.value;
    userPass = signUpPassword.value;

    createUserWithEmailAndPassword(auth, userEmail, userPass)
    .then((userCredential) => {
        addUser(userEmail);
        signUpEmail.value = '';
        signUpName.value = '';
        signUpPassword.value = '';
        alert("Your account has been successfully created");
        // location.href = '../index.html';
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Signup Failed")
    });
}

const addUser = async (userEmail) => {
    let db = getFirestore(app);
    await setDoc(doc(db, "user", userEmail), {
        balance: [{method: "Cash", balance: 0}, {method:"Savings", balance: 0}],
        category: ["Home", "Shopping", "Gifts", "Mobile", "Family"],
        history: [],
        bank: [{bankName: "Cash", bankAmount: 0}, {bankName: "Savings", bankAmount: 0}]
    });
    console.log("created");
}
