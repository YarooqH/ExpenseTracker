import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc, Timestamp } from "firebase/firestore";
import { app } from './firebaseInit'
// import app from './firebaseInit.js'

const auth = getAuth();

let signUpEmail = document.querySelector("#signup-email");
let signUpPassword = document.querySelector("#signup-password");
let signUpName = document.querySelector("#signup-name");
let signUpBtn = document.querySelector("#signup-btn");
let dbUserName;

signUpBtn.addEventListener("click", signUp);

function signUp() {
    let userEmail, userPass, userName;

    userEmail = signUpEmail.value;
    userName = signUpName.value;
    userPass = signUpPassword.value;

    dbUserName = userEmail

    createUserWithEmailAndPassword(auth, userEmail, userPass)
    .then((userCredential) => {
        // console.log(userCredential);
        // const user = userCredential.user;
        addUser();
        alert("Your account has been successfully created");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Signup Failed")
        console.log(error)
    });
}

const addUser = async () => {
    let db = getFirestore(app);
    await setDoc(doc(db, "user", dbUserName), {
        balance: [{method: "Cash", "balance": 0}, {method:"Savings", balance: 0}]
      });
}
