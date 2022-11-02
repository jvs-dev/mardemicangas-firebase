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
import { getAuth, setPersistence, browserSessionPersistence, signInAnonymously, onAuthStateChanged, deleteUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, query, where, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
const user = auth.currentUser;

var body = document.querySelector("body")
var user_img_content = document.getElementById("user-img")
var edit_perfil_img = document.getElementById("edit-perfil__img")
var form_edit_perfil_img = document.getElementById("form--edit-perfil__img")
var edit_perfil_username = document.getElementById("edit-perfil__username")
var edit_data_email = document.getElementById("edit-data__email")
var delet_account = document.getElementById("delet-account")
var button_disconnect = document.getElementById("button__disconnect")
var form_edit_perfil_username = document.getElementById("form--edit-perfil__username")
var form_edit_perfil_close_form = document.getElementById("form--edit-perfil__close--form")
var form_edit_perfil = document.querySelector(".form--edit-perfil")
var edit_perfil = document.getElementById("edit-perfil")
var form_edit_perfil_button_save = document.getElementById("form--edit-perfil__button--save")
var address = document.getElementById("address")
var phone_number = document.getElementById("phone_number")
var write_alert = document.getElementById("write_alert")
var heart_add = document.getElementById("heart-add")
var fav_addprod = document.getElementById("fav-addprod")


const querySnapshot = await getDocs(collection(db, "users"));

edit_perfil.onclick = function () {
  body.style.overflow = "hidden"
  form_edit_perfil.classList.add("active")
}
form_edit_perfil_close_form.onclick = function () {
  form_edit_perfil.classList.remove("active")
  body.style.overflow = "auto"
}



onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;



    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      /*console.log(doc.id, " => ", doc.data());*/
      function address_exist() {
        if (objdata.street_name && objdata.house_number && objdata.district_name && objdata.cep_number) {
          return `${objdata.district_name}, ${objdata.street_name}, Nº${objdata.house_number}<br>${objdata.cep_number}`
        } else {
          return "Endereço não registrado"
        }
      }
      function phone_number_exist() {
        if (objdata.phone_number) {
          return objdata.phone_number
        } else {
          return "Número não registrado"
        }
      }

      var srtingdata = JSON.stringify(doc.data());
      var objdata = JSON.parse(srtingdata)
      if (objdata.email == user.email) {
        user_img_content.src = `${objdata.user_photo}`
        edit_perfil_img.src = `${objdata.user_photo}`
        form_edit_perfil_img.src = `${objdata.user_photo}`
        edit_perfil_username.textContent = `${objdata.username}`
        edit_data_email.value = `${objdata.email}`
        form_edit_perfil_username.value = `${objdata.username}`
        phone_number.textContent = `${phone_number_exist()}`
        address.innerHTML = `${address_exist()}`
        if (objdata.admin == true) {
          heart_add.name = "add-circle"
          fav_addprod.href = "admin-page.html"
        }
      }
    })
  } else {
    window.location.href = "login.html"
  }
});

button_disconnect.onclick = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html"
  }).catch((error) => {
    alert("erro")
  });

}
delet_account.onclick = function () {
  deleteUser(user).then(() => {
    console.log("User deleted");
  }).catch((error) => {
    console.log("error");
  });
}

form_edit_perfil_button_save.onclick = function () {
  if (form_edit_perfil_button_save.innerHTML == "Reiniciar") {
    window.location.href=""
  }
  form_edit_perfil_button_save.innerHTML=`<div class="loading"><div class="loading__center"></div></div>`
  onAuthStateChanged(auth, (user) => {
    let form_edit_perfil_username = document.getElementById("form--edit-perfil__username").value
    let phone_number = document.getElementById("add-phone_number").value
    let house_number = document.getElementById("add-house_number").value
    let street_name = document.getElementById("add-street_name").value
    let district_name = document.getElementById("add-district_name").value
    let cep_number = document.getElementById("add-cep_number").value
    let choose_img_url = document.getElementById("choose_img_url").value

    if (user) {
      const usersRef = doc(db, "users", `${user.email}`);

      if (phone_number != "") {
        updateDoc(usersRef, {
          phone_number: `${phone_number}`
        });
      }
      if (street_name != "") {
        updateDoc(usersRef, {
          street_name: `${street_name}`
        });
      }
      if (house_number != "") {
        updateDoc(usersRef, {
          house_number: `${house_number}`
        });
      }
      if (district_name != "") {
        updateDoc(usersRef, {
          district_name: `${district_name}`
        });
      }
      if (cep_number != "") {
        updateDoc(usersRef, {
          cep_number: `${cep_number}`
        });
      }
      if (form_edit_perfil_username != "") {
        updateDoc(usersRef, {
          username: `${form_edit_perfil_username}`
        });
      }
      if (choose_img_url != "") {
        updateDoc(usersRef, {
          user_photo: `${choose_img_url}`
        });
      }
      setTimeout(() => {
        form_edit_perfil_button_save.innerHTML="Reiniciar"
        write_alert.textContent = "Alterações salvas. Por favor reinicie a página"
      }, 1000);
    }
  })
}