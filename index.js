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
var more_buy_lef_btn = document.getElementById("more-buy__left--btn")
var more_buy_right_btn = document.getElementById("more-buy__right--btn")
var section_more_buy = document.getElementById("section--more-buy")
var user_img_content = document.getElementById("user-img")
var heart_add = document.getElementById("heart-add")
var fav_addprod = document.getElementById("fav-addprod")
var all_products_section = document.getElementById("all_products_section")
var search_section_products = document.getElementById("search-section-products")
var search_section_users = document.getElementById("search-section-users")
var search_btn = document.getElementById("search_btn")
var light_dark = document.getElementById("light-dark")
var product_page_section = document.getElementById("product_page_section")
var close_product_page_section = document.getElementById("close_product_page_section")
var img_product_page_section = document.getElementById("img_product_page_section")
var description_product_page_section = document.getElementById("description_product_page_section")
var price_product_page_section = document.getElementById("price_product_page_section")
var likes_product_page_section = document.getElementById("likes_product_page_section")
var heart_product_page_section = document.getElementById("heart_product_page_section")
var button_product_page_section = document.getElementById("button_product_page_section")


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


const productsquerySnapshot = await getDocs(collection(db, "products"));
const querySnapshot = await getDocs(collection(db, "users"));


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
  article.id = `${doc.id}`
  article.onclick = function () {
    product_page_section.style.display = "flex"
    img_product_page_section.src = `${objdata.product_image}`
    description_product_page_section.textContent = `${objdata.product_description}`
    price_product_page_section.textContent = `R$ ${objdata.product_price}`
    likes_product_page_section.textContent = `${objdata.likes} Likes`
    function return_user() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          let uid = user.uid;
          querySnapshot.forEach((doc) => {
            let srtingdata = JSON.stringify(doc.data());
            let objdata = JSON.parse(srtingdata)
            if (objdata.email == user.email) {
              verify_you_like(article.id, objdata.email)
            }
          }
          )
        }
      }
      )
    }
    return_user()
    body.style.overflow = "hidden"
    button_product_page_section.onclick = function () {
      let product_color = document.getElementById("product-color-1").value
      let product_size = document.getElementById("product-size-1").value
      var buy_details = `https://api.whatsapp.com/send?phone=55557185538434&text=Olá gostaria de fazer um pedido baseado no produto: ${objdata.product_description}. Tamanho: ${product_size}, cor: ${product_color}. `
      finalize_buy(buy_details)
    }
    heart_product_page_section.onclick = function () {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const uid = user.uid;
          querySnapshot.forEach((doc) => {
            let srtingdata = JSON.stringify(doc.data());
            let objdata = JSON.parse(srtingdata)
            if (objdata.email == user.email) {
              like_and_dislike(article.id, objdata.email)
            }
          }
          )
        }
      }
      )
    }
  }
})


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


search_btn.onclick = function () {
  search_product_and_user()
}

function search_product_and_user() {
  search_btn.innerHTML = `<div class="loading"><div class="loading__center"></div></div>`
  search_section_products.innerHTML = ""
  search_section_users.innerHTML = ""
  let input_search = document.getElementById("input-search").value
  let search = input_search.toUpperCase()
  if (input_search != "") {
    productsquerySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      /*console.log(doc.id, " => ", doc.data());*/
      let srtingdata = JSON.stringify(doc.data());
      let objdata = JSON.parse(srtingdata)
      if (objdata.product_description.toUpperCase().includes(`${search}`)) {

        let article = document.createElement("article")
        search_section_products.insertAdjacentElement("afterbegin", article)
        article.classList.add("article--product")
        article.innerHTML = `
        <img class="product__img" src="${objdata.product_image}" alt="" id="preview_image">
        <p class="product__description" id="preview_description">${objdata.product_description}</p>
        <div class="product__div">
          <span class="product__price" id="preview_price">R$ ${objdata.product_price}</span>
          <span class="product__likes">${objdata.likes} Likes</span>
        </div>
      `
        article.id = `${doc.id}`
        article.onclick = function () {
          product_page_section.style.display = "flex"
          img_product_page_section.src = `${objdata.product_image}`
          description_product_page_section.textContent = `${objdata.product_description}`
          price_product_page_section.textContent = `R$ ${objdata.product_price}`
          likes_product_page_section.textContent = `${objdata.likes} Likes`
          body.style.overflow = "hidden"
          button_product_page_section.onclick = function () {
            let product_color = document.getElementById("product-color-1").value
            let product_size = document.getElementById("product-size-1").value
            var buy_details = `https://api.whatsapp.com/send?phone=55557185538434&text=Olá gostaria de fazer um pedido baseado no produto: ${objdata.product_description}. Tamanho: ${product_size}, cor: ${product_color}. `
            finalize_buy(buy_details)
          }
          heart_product_page_section.onclick = function () {
          }
        }
      }
    })

    querySnapshot.forEach((doc) => {
      let srtingdata = JSON.stringify(doc.data());
      let objdata = JSON.parse(srtingdata)
      if (objdata.username.toUpperCase().includes(`${search}`)) {

        let article = document.createElement("article")
        search_section_users.insertAdjacentElement("afterbegin", article)
        article.classList.add("article--user")
        article.innerHTML = `
          <img class="article--user__img" src="${objdata.user_photo}" alt="">
          <div class="article--user__div">
            <p class="article--user__username">${objdata.username}</p>
            <p class="article--user__email">${objdata.email}</p>
          </div>
        `
      }
    })
  }
  search_btn.innerHTML = "Procurar"
}

setInterval(() => {
  let input_search = document.getElementById("input-search").value
  if (input_search == "") {
    search_section_users.innerHTML = ""
    search_section_products.innerHTML = ""
  }
}, 1000);



function keyPressed(evt) {
  evt = evt || window.event;
  var key = evt.keyCode || evt.which;
  if (evt.which == 13) {
    return String.fromCharCode(key);
  }
}

document.onkeypress = function (evt) {
  var str = keyPressed(evt);
  if (str != undefined) {
    search_product_and_user()
  }
};

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
