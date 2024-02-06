const {initializeApp}  = require("firebase/app");
const { initializeAuth , signInWithEmailAndPassword , createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, collection } = require('firebase/firestore');
const { email , password } = require('./secret_files/signin_params.json');

const firebaseConfig = {
  apiKey: "AIzaSyAoCygpXSFmbCHJGwQVgGJMwqkXLXTvIXE",
  authDomain: "iitj-menu-2507.firebaseapp.com",
  projectId: "iitj-menu-2507",
  storageBucket: "iitj-menu-2507.appspot.com",
  messagingSenderId: "691003196896",
  appId: "1:691003196896:web:738dd783745be2caf91785",
  measurementId: "G-5TPRW5W4CW",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);

signInWithEmailAndPassword(auth,email,password)
.then((result) => {
  console.log("Signed in with email:",email);
  console.log("Your uid is:",result.user.uid);
}).catch((err) => {
  console.log(err);
});


const db = getFirestore();
const Menu = collection(db,'Menu');
module.exports = Menu;