// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-_Nr84eAHwvxPunSbXMdnnRPuTiPJ2aU",
    authDomain: "bird-gallery-d63ac.firebaseapp.com",
    projectId: "bird-gallery-d63ac",
    storageBucket: "bird-gallery-d63ac.appspot.com",
    messagingSenderId: "811063083063",
    appId: "1:811063083063:web:17ec7ffbacdb018178bfb2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
// Sign Up Function
function signUp() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Sign Up Successful");
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Log In Function
function logIn() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            alert("Log In Successful");
        })
        .catch((error) => {
            alert(error.message);
        });
}
