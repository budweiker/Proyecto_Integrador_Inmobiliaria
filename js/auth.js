//este es el js de la base de datos, aca estan toda las apis y lo que se requiere para que la base de datos funcione bien
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC_R9dW12aW4-1-FsOeuwXmKOqccWGl7M8",
    authDomain: "registrologininmobiliaria.firebaseapp.com",
    projectId: "registrologininmobiliaria",
    storageBucket: "registrologininmobiliaria.firebasestorage.app",
    messagingSenderId: "19537440445",
    appId: "1:19537440445:web:632de5e06471d8dfe1fd14"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const registrarUsuarioCompleto = async (email, pass, datosExtra) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    // Guarda los datos extra en la colección "usuarios"
    await setDoc(doc(db, "usuarios", user.uid), {
        nombre: datosExtra.nombre,
        cedula: datosExtra.cedula,
        fechaNacimiento: datosExtra.fecha,
        email: email
    });
    return user;
};

export const iniciarSesion = (email, pass) => {
    return signInWithEmailAndPassword(auth, email, pass);
};