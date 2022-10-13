import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import app from './firebaseInit.js'

const auth = getAuth();

let signInEmail = document.querySelector("#signin-email");
let signInPassword = document.querySelector("#signin-password");
let signInBtn = document.querySelector("#signin-btn");

signInBtn.addEventListener("click", signIn);

function signIn() {
    let userEmail, userPass;

    userEmail = signInEmail.value;
    userPass = signInPassword.value;

    console.log('signin' + userEmail)
    sessionStorage.setItem('userEmail', userEmail);

    signInWithEmailAndPassword(auth, userEmail, userPass)
    .then((userCredential) => {
        location.href = './src/views/Dashboard.html';
        // alert(userCredential.user.email + " has successfully logged in.")
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("log in failed")
    });

    signInEmail.value = '';
    signInPassword.value = '';
}