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

// Log Out Function
function logOut() {
    auth.signOut().then(() => {
        alert("Logged Out");
    });
}
// Upload Image Function
function uploadImage() {
    const file = document.getElementById("image-upload").files[0];
    const storageRef = storage.ref('images/' + file.name);
    const uploadTask = storageRef.put(file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            // Progress function
        }, 
        (error) => {
            alert(error.message);
        }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                db.collection("images").add({
                    url: downloadURL,
                    user: auth.currentUser.email,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                displayGallery();
            });
        }
    );
}

// Display Gallery Function
function displayGallery() {
    db.collection("images").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";
        snapshot.forEach((doc) => {
            const image = document.createElement("img");
            image.src = doc.data().url;
            const commentSection = document.createElement("div");
            commentSection.className = "comment-section";
            const commentInput = document.createElement("input");
            commentInput.type = "text";
            commentInput.placeholder = "Add a comment";
            const commentButton = document.createElement("button");
            commentButton.textContent = "Comment";
            commentButton.onclick = () => addComment(doc.id, commentInput.value);
            commentSection.appendChild(commentInput);
            commentSection.appendChild(commentButton);

            const comments = document.createElement("div");
            comments.className = "comments";
            db.collection("images").doc(doc.id).collection("comments").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
                comments.innerHTML = "";
                snapshot.forEach((commentDoc) => {
                    const comment = document.createElement("div");
                    comment.className = "comment";
                    comment.textContent = commentDoc.data().text;
                    comments.appendChild(comment);
                });
            });

            gallery.appendChild(image);
            gallery.appendChild(commentSection);
            gallery.appendChild(comments);
        });
    });
}

auth.onAuthStateChanged((user) => {
    if (user) {
        displayGallery();
    }
});
// Profanity Filter
const profanityList = ["badword1", "badword2", "badword3"]; // Add more words as needed

function containsProfanity(text) {
    const words = text.split(" ");
    for (const word of words) {
        if (profanityList.includes(word.toLowerCase())) {
            return true;
        }
    }
    return false;
}

// Add Comment Function
function addComment(imageId, text) {
    if (containsProfanity(text)) {
        alert("Please avoid using offensive language.");
    } else {
        db.collection("images").doc(imageId).collection("comments").add({
            text: text,
            user: auth.currentUser.email,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
}
