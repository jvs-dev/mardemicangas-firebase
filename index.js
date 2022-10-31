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
var more_buy_lef_btn = document.getElementById("more-buy__left--btn")
var more_buy_right_btn = document.getElementById("more-buy__right--btn")
var section_more_buy = document.getElementById("section--more-buy")
var user_img_content = document.getElementById("user-img")

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
      }
    })
  } else {
    window.location.href="login.html"
  }
});

