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
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, query, where, getDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
const user = auth.currentUser;
var body = document.querySelector("body")
var more_buy_lef_btn = document.getElementById("more-buy__left--btn")
var more_buy_right_btn = document.getElementById("more-buy__right--btn")
var section_more_buy = document.getElementById("section--more-buy")
var user_img_content = document.getElementById("user-img")
var heart_add = document.getElementById("heart-add")
var fav_addprod = document.getElementById("fav-addprod")
var all_products_section = document.getElementById("all_products_section")
var search_section = document.getElementById("search-section")
var search_btn = document.getElementById("search_btn")
var light_dark = document.getElementById("light-dark")

light_dark.onclick = function () {
  if (body.classList.contains("dark")) {
    body.classList.remove("dark")
    light_dark.name="sunny" 
  } else {
    body.classList.add("dark")
    light_dark.name="moon" 
  }
}


const productsquerySnapshot = await getDocs(collection(db, "products"));


productsquerySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  /*console.log(doc.id, " => ", doc.data());*/
  let srtingdata = JSON.stringify(doc.data());
  let objdata = JSON.parse(srtingdata)


  let article = document.createElement("article")
  all_products_section.insertAdjacentElement("afterbegin", article)
  article.classList.add("article--product")
  article.innerHTML = `
      <img class="product__img" src="${objdata.product_image}" alt="" id="preview_image">
      <p class="product__description" id="preview_description">${objdata.product_description}</p>
      <div class="product__div">
        <span class="product__price" id="preview_price">R$ ${objdata.product_price}</span>
        <span class="product__likes">${objdata.likes} Likes</span>
      </div>
    `
})



var scroll_x = 0

more_buy_lef_btn.onclick = function () {
  if (scroll_x > 0) {
    scroll_x = scroll_x - 400
    section_more_buy.scroll(scroll_x, 0)
  }
}
more_buy_right_btn.onclick = function () {
  if (scroll_x < 2600) {
    scroll_x = scroll_x + 400
    section_more_buy.scroll(scroll_x, 0)
  }
}

const querySnapshot = await getDocs(collection(db, "users"));
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;



    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      /*console.log(doc.id, " => ", doc.data());*/
      var srtingdata = JSON.stringify(doc.data());
      var objdata = JSON.parse(srtingdata)
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


search_btn.onclick = function () {
  search_btn.innerHTML=`<div class="loading"><div class="loading__center"></div></div>`
  search_section.innerHTML=""
  let input_search = document.getElementById("input-search").value
  let search = input_search.toUpperCase()
  if (input_search != "") {
    productsquerySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      /*console.log(doc.id, " => ", doc.data());*/
      let srtingdata = JSON.stringify(doc.data());
      let objdata = JSON.parse(srtingdata)
      if (objdata.product_description.includes(`${search}`)) {
        console.log("foi");

        let article = document.createElement("article")
        search_section.insertAdjacentElement("afterbegin", article)
        article.classList.add("article--product")
        article.innerHTML = `
        <img class="product__img" src="${objdata.product_image}" alt="" id="preview_image">
        <p class="product__description" id="preview_description">${objdata.product_description}</p>
        <div class="product__div">
          <span class="product__price" id="preview_price">R$ ${objdata.product_price}</span>
          <span class="product__likes">${objdata.likes} Likes</span>
        </div>
      `
      }
    })
  }
  search_btn.innerHTML="Procurar"
}

setInterval(() => {
  let input_search = document.getElementById("input-search").value
  if (input_search == "") {
    search_section.innerHTML=""
  }
}, 1000);