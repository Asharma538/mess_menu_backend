const {initializeApp}  = require("firebase/app");
const { initializeAuth , signInWithEmailAndPassword , createUserWithEmailAndPassword } = require("firebase/auth");
const { getFirestore, collection } = require('firebase/firestore');
const { email , password } = require('./secret_files/signin_params.json');

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG || `{}`);

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