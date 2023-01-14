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
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, query, where, getDoc, updateDoc, onSnapshot, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
const user = auth.currentUser;
var body = document.querySelector("body")
var user_img_content = document.getElementById("user-img")
var heart_add = document.getElementById("heart-add")
var fav_addprod = document.getElementById("fav-addprod")
var light_dark = document.getElementById("light-dark")
var product_page_section = document.getElementById("product_page_section")
var close_product_page_section = document.getElementById("close_product_page_section")
var img_product_page_section = document.getElementById("img_product_page_section")
var description_product_page_section = document.getElementById("description_product_page_section")
var price_product_page_section = document.getElementById("price_product_page_section")
var likes_product_page_section = document.getElementById("likes_product_page_section")
var heart_product_page_section = document.getElementById("heart_product_page_section")
var button_product_page_section = document.getElementById("button_product_page_section")
const productsquerySnapshot = await getDocs(collection(db, "products"));
const querySnapshot = await getDocs(collection(db, "users"));

if (localStorage.page_theme == "light") {
  body.classList.add("light")
  light_dark.name = "moon"
  localStorage.clear()
  localStorage.page_theme = "light"
} else {
  localStorage.clear()
  localStorage.page_theme = "dark"
}


light_dark.onclick = function () {
  if (body.classList.contains("light")) {
    body.classList.remove("light")
    light_dark.name = "sunny"
    localStorage.page_theme = "dark"
  } else {
    body.classList.add("light")
    light_dark.name = "moon"
    localStorage.page_theme = "light"
  }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
  
  
  
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        /*console.log(doc.id, " => ", doc.data());*/
        let srtingdata = JSON.stringify(doc.data());
        let objdata = JSON.parse(srtingdata)
        if (objdata.email == user.email) {
          user_img_content.src = `${objdata.user_photo}`
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
  

  function finalize_buy(buy_details) {
    onAuthStateChanged(auth, (user) => {
      querySnapshot.forEach((doc) => {
        let srtingdata = JSON.stringify(doc.data());
        let objdata = JSON.parse(srtingdata)
        if (objdata.email == user.email) {
          if (objdata.street_name && objdata.house_number && objdata.district_name && objdata.cep_number) {
            window.location.href = buy_details + `  CEP: ${objdata.cep_number}, Bairro: ${objdata.district_name}, Rua: ${objdata.street_name}, N°: ${objdata.house_number}`
          } else {
            window.location.href = buy_details
          }
        }
      })
    });
  }

  img_product_page_section.onclick = function () {
    img_product_page_section.classList.toggle("zoom")
  }
  
  close_product_page_section.onclick = function () {
    product_page_section.style.display = "none"
    body.style.overflow = "auto"
    img_product_page_section.classList.remove("zoom")
    heart_product_page_section.name = "heart-outline"
  }
  
  
  function verify_you_like(id, user_email) {
    if (localStorage.getItem(`${id}`)) {
      if (localStorage.getItem(`${id}`) == "liked") {
        heart_product_page_section.name = "heart"
      }
    } else {
      querySnapshot.forEach((doc) => {
        let srtingdata = JSON.stringify(doc.data());
        let objdata = JSON.parse(srtingdata)
        if (objdata.email == user_email) {
          let index_number = 0
          while (index_number != objdata.products_liked.length) {
            if (objdata.products_liked[index_number] == id) {
              heart_product_page_section.name = "heart"
              break
            }
            index_number++
          }
        }
      })
    }
  }
  
  
  function like_and_dislike(id, user_email) {
    const usersreference = doc(db, "users", `${user_email}`);
    if (heart_product_page_section.name == "heart-outline") {
      updateDoc(usersreference, {
        products_liked: arrayUnion(`${id}`)
      });
      heart_product_page_section.name = "heart"
      localStorage.setItem(`${id}`, "liked")
    } else {
      updateDoc(usersreference, {
        products_liked: arrayRemove(`${id}`)
      });
      heart_product_page_section.name = "heart-outline"
      localStorage.setItem(`${id}`, "noliked")
    }
  }