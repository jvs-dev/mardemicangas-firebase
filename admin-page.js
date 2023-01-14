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
import { getFirestore, collection, doc, setDoc, addDoc, getDocs, query, where, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
const db = getFirestore(app);
const auth = getAuth();
const user = auth.currentUser;
var body = document.querySelector("body")
var user_img_content = document.getElementById("user-img")
var preview_image = document.getElementById("preview_image")
var preview_price = document.getElementById("preview_price")
var preview_description = document.getElementById("preview_description")
var add_product = document.getElementById("add_product")
var console_menssage = document.getElementById("console_menssage")
var section_products_added = document.getElementById("section__products-added")
var open_help_section = document.getElementById("add-product-help-btn")
var close_help_section = document.getElementById("product-help-section__close-btn")
var help_section = document.getElementById("help_section_products")
var light_dark = document.getElementById("light-dark")


if (localStorage.page_theme == "light") {
  body.classList.add("light")
  light_dark.name = "moon"
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


open_help_section.onclick = function () {
  help_section.style.display = "flex"
  body.style.overflow = "hidden"
}

close_help_section.onclick = function () {
  help_section.style.display = "none"
  body.style.overflow = "auto"
}


add_product.onclick = function () {
  add_product.innerHTML = `<div class="loading"><div class="loading__center"></div></div>`
  let product_image = document.getElementById("product_image").value
  let product_price = document.getElementById("product_price").value
  let product_description = document.getElementById("product_description").value
  let product_categorie = document.getElementById("product_categorie").value
  if (product_image != "" && product_price != "" && product_description != "") {
    const productsRef = collection(db, "products");
    setDoc(doc(productsRef), {
      product_image: `${product_image}`,
      product_price: `${product_price}`,
      product_description: `${product_description}`,
      product_categorie: `${product_categorie}`,
      likes: 0
    });
    setTimeout(() => {
      add_product.innerHTML = `Adicionar`
      console_menssage.textContent = "Produto adicionado com sucesso"
      console_menssage.classList.remove("error")
      console_menssage.classList.add("sucess")
      let article = document.createElement("article")
      section_products_added.insertAdjacentElement("afterbegin", article)
      article.classList.add("article--product")
      article.innerHTML = `
      <img class="product__img" src="${product_image}" alt="" id="preview_image">
      <p class="product__description" id="preview_description">${product_description}</p>
      <div class="product__div">
        <span class="product__price" id="preview_price">R$ ${product_price}</span>
        <span class="product__likes">0 Likes</span>
      </div>
    `
    clear_inputs()
    }, 1000);
  } else {
    setTimeout(() => {
      add_product.innerHTML = `Adicionar`
      console_menssage.textContent = "Por favor preencha todos os campos"
      console_menssage.classList.remove("sucess")
      console_menssage.classList.add("error")
    }, 1000);
  }
}

window.onload = setInterval(() => {
  let product_image = document.getElementById("product_image").value
  let product_price = document.getElementById("product_price").value
  let product_description = document.getElementById("product_description").value
  preview_image.src = `${product_image}`
  preview_price.textContent = `R$ ${product_price}`
  preview_description.textContent = product_description
}, 1000);

const querySnapshot = await getDocs(collection(db, "users"));
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
        } else {
          window.location.href = "index.html"
        }
      }
    })
  } else {
    window.location.href = "login.html"
  }
});














const productsquerySnapshot = await getDocs(collection(db, "products"));


productsquerySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  /*console.log(doc.id, " => ", doc.data());*/
  let srtingdata = JSON.stringify(doc.data());
  let objdata = JSON.parse(srtingdata)


  let article = document.createElement("article")
  let span_delete = document.createElement("span")
  span_delete.classList.add("product__span")
  section_products_added.insertAdjacentElement("afterbegin", article)
  article.classList.add("article--product")
  article.id = `${doc.id}`
  article.innerHTML = `
      <img class="product__img" src="${objdata.product_image}" alt="" id="preview_image">
      <p class="product__description" id="preview_description">${objdata.product_description}</p>
      <div class="product__div">
        <span class="product__price" id="preview_price">R$ ${objdata.product_price}</span>
        <span class="product__likes">${objdata.likes} Likes</span>
      </div>
    `
  article.insertAdjacentElement("afterbegin", span_delete)
  span_delete.innerHTML = `<ion-icon class="product__delete-icon" name="trash-outline"></ion-icon>`
  span_delete.onclick = function () {
    var this_product = this.parentNode
    let product_id = this_product.id
    deletedoc(product_id)
    this_product.classList.add("dpnone")
  }

})


function deletedoc(product_id) {
  deleteDoc(doc(db, "products", `${product_id}`));
}

function clear_inputs() {
  let product_image = document.getElementById("product_image")
  let product_price = document.getElementById("product_price")
  let product_description = document.getElementById("product_description")

  product_image.value = ""
  product_price.value = ""
  product_description.value = ""
}





window.addEventListener("load", remove_loading_window())

function remove_loading_window() {
  setTimeout(() => {
    let loading_window = document.getElementById("loading_window")
    loading_window.style.display = "none"
  }, 500);
}