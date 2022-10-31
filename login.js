import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyCxtHiu-P3I0Sx7RhEW0Ozo1SRxo1oCe7A",
  authDomain: "simpl3-chat.firebaseapp.com",
  projectId: "simpl3-chat",
  storageBucket: "simpl3-chat.appspot.com",
  messagingSenderId: "680152036805",
  appId: "1:680152036805:web:4e2cd11039d5cf423747ac"
};
const app = initializeApp(firebaseConfig);
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, query, where, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
var view_password = document.getElementById("view_password")
var login_btn = document.getElementById("login_btn")
var error_sucess_menssage = document.getElementById("error-sucess_menssage")

view_password.onclick = function () {
  let password = document.getElementById("password_input")
  if (password.type == "text") {
    password.type = "password"
    view_password.name="eye-outline"
  } else {
    password.type = "text"
    view_password.name="eye-off-outline"
  }
}


login_btn.onclick = function () {
  login_btn.innerHTML=`<div class="loading"><div class="loading__center"></div></div>`
    let password = document.getElementById("password_input").value
    let email = document.getElementById("email_input").value
    if (password != "" && email != "") {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        error_sucess_menssage.textContent = "Login feito com sucesso"
        error_sucess_menssage.classList.add("sucess")
        window.location.href="index.html"
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        error_sucess_menssage.textContent = "Email ou senha incorreta"
        error_sucess_menssage.classList.add("error")
        login_btn.innerHTML="ENTRAR"
      });
    } else {
      error_sucess_menssage.textContent = "Por favor preencha todos os campos"
      error_sucess_menssage.classList.add("error")
      login_btn.innerHTML="ENTRAR"
    }
}