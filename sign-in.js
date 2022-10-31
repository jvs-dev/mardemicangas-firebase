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
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, query, where, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
var signin_btn = document.getElementById("signin_btn")
var error_sucess_menssage = document.getElementById("error-sucess_menssage")
var view_confirm_password = document.getElementById("view_confirm-password")
var view_password = document.getElementById("view_password")

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

view_confirm_password.onclick = function () {
  let confirm_password = document.getElementById("confirm-password_input")
  if (confirm_password.type == "text") {
    confirm_password.type = "password"
    view_confirm_password.name="eye-outline"
  } else {
    confirm_password.type = "text"
    view_confirm_password.name="eye-off-outline"
  }
}


signin_btn.onclick = function () {
  if (signin_btn.innerHTML=="ENTRAR") {
    window.location.href="index.html"
  }
  signin_btn.innerHTML=`<div class="loading"><div class="loading__center"></div></div>`

  let username = document.getElementById("username_input").value
  let password = document.getElementById("password_input").value
  let email = document.getElementById("email_input").value
  let confirm_password = document.getElementById("confirm-password_input").value

  if (username != "" && password != "" && email != "") {
    if (password.length > 7) {
      if (password == confirm_password) {
        createUserWithEmailAndPassword(auth, email, password, username)
          .then((userCredential) => {
            const user = userCredential.user;
            const usersRef = collection(db, "users");
            setDoc(doc(usersRef, `${email}`), {
              email: `${email}`, username: `${username}`, user_photo: `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png`
            });
            setTimeout(() => {
              signin_btn.innerHTML="ENTRAR"
              error_sucess_menssage.classList.add("sucess")
              error_sucess_menssage.textContent = "Conta criada com sucesso"
            }, 1000);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            error_sucess_menssage.classList.add("error")
            error_sucess_menssage.textContent = "Email já registrado ou dados incorretos"
            signin_btn.innerHTML="REGISTRAR"
          })
      } else {
        error_sucess_menssage.classList.add("error")
        error_sucess_menssage.textContent = "As senhas não correspondem"
        signin_btn.innerHTML="REGISTRAR"
      }
    } else {
      error_sucess_menssage.classList.add("error")
      error_sucess_menssage.textContent = "A senha deve ter no minimo 8 caracteres"
      signin_btn.innerHTML="REGISTRAR"
    }
  } else {
    error_sucess_menssage.classList.add("error")
    error_sucess_menssage.textContent = "Por favor preencha todos os campos"
    signin_btn.innerHTML="REGISTRAR"
  }
}
