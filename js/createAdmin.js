// js/createAdmin.js — EJECUTAR UNA SOLA VEZ, luego eliminar el import
// ⚠️ ADVERTENCIA: Este script crea el usuario administrador en Firebase.
// Eliminalo de admin.html después de ejecutarlo exitosamente.

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Misma config que auth.js
const firebaseConfig = {
    apiKey: "AIzaSyC_R9dW12aW4-1-FsOeuwXmKOqccWGl7M8",
    authDomain: "registrologininmobiliaria.firebaseapp.com",
    projectId: "registrologininmobiliaria",
    storageBucket: "registrologininmobiliaria.firebasestorage.app",
    messagingSenderId: "19537440445",
    appId: "1:19537440445:web:632de5e06471d8dfe1fd14"
};

// Inicializar Firebase solo si no hay instancias previas
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = 'lajuveeselpapadelinter@gmail.com';
const ADMIN_PASS  = 'me_gustan_los_salchicones';

const adminData = {
    nombre: 'Administrador Principal',
    cedula: '0000000000',
    fechaNacimiento: '1990-01-01',
    email: 'lajuveeselpapadelinter@gmail.com',
    rol: 'Admin',
    activo: true,
    fechaRegistro: new Date().toISOString().split('T')[0]
};

const crearAdmin = async () => {
    try {
        // Paso 1: Cerrar sesión activa para no bloquear createUserWithEmailAndPassword
        console.log('[createAdmin] Cerrando sesión activa...');
        await signOut(auth);
        console.log('[createAdmin] Sesión cerrada correctamente.');

        let uid = null;

        try {
            // Paso 2: Intentar crear usuario en Firebase Auth
            console.log('[createAdmin] Intentando crear usuario en Firebase Auth...');
            const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
            uid = userCredential.user.uid;
            console.log('[createAdmin] Usuario Auth creado. UID:', uid);
        } catch (authError) {
            if (authError.code === 'auth/email-already-in-use') {
                console.warn('[createAdmin] El usuario ya existe en Auth. Verificando Firestore...');
                // Obtener UID del usuario existente iniciando sesión
                const existingCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASS);
                uid = existingCredential.user.uid;
                console.log('[createAdmin] UID del admin existente:', uid);

                // Verificar si ya existe en Firestore
                const docSnap = await getDoc(doc(db, 'usuarios', uid));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('[createAdmin] Documento ya existe en Firestore:', data);
                    alert(
                        ' El admin ya existe en Auth Y en Firestore.\n\n' +
                        'UID: ' + uid + '\n' +
                        'Nombre: ' + (data.nombre || 'N/A') + '\n' +
                        'Rol: ' + (data.rol || 'N/A') + '\n\n' +
                        'No es necesario recrearlo. Elimina este script.'
                    );
                    return;
                }
                // Si existe en Auth pero NO en Firestore, continuamos a crear el doc
                console.log('[createAdmin] Doc NO existe en Firestore. Creando documento...');
            } else if (authError.code === 'auth/network-request-failed') {
                alert(' Error de red. Asegúrate de usar Live Server, no file://\n\nURL debe empezar con http://localhost:...');
                console.error('[createAdmin] Error de red:', authError);
                return;
            } else if (authError.code === 'auth/configuration-not-found') {
                alert(' Firebase no está configurado. Verifica la config en el script.');
                console.error('[createAdmin] Config error:', authError);
                return;
            } else {
                alert(' Error de Auth:\nCódigo: ' + authError.code + '\nMensaje: ' + authError.message);
                console.error('[createAdmin] Error desconocido en Auth:', authError);
                return;
            }
        }

        // Paso 3: Guardar documento en Firestore
        console.log('[createAdmin] Guardando documento en Firestore...');
        await setDoc(doc(db, 'usuarios', uid), adminData);
        console.log('[createAdmin]  Admin creado exitosamente. UID:', uid);

        alert(
            ' Admin creado exitosamente!\n\n' +
            'UID: ' + uid + '\n' +
            'Email: ' + ADMIN_EMAIL + '\n' +
            'Rol: Admin\n\n' +
            ' IMPORTANTE: Elimina el <script type="module" src="js/createAdmin.js"></script> de admin.html ahora.'
        );

    } catch (e) {
        console.error('[createAdmin]  Error inesperado:', e);
        alert(' Error inesperado:\nCódigo: ' + (e.code || 'N/A') + '\nMensaje: ' + e.message);
    }
};

crearAdmin();

/*
  INSTRUCCIONES DE USO:
  1. Abre VS Code
  2. Instala la extensión "Live Server" si no la tienes
  3. Click derecho sobre admin.html → "Open with Live Server"
  4. La URL debe ser http://localhost:XXXX/admin.html (NO file://)
  5. Agrega temporalmente en admin.html antes de </body>:
     <script type="module" src="js/createAdmin.js"></script>
  6. Recarga la página y abre la Consola del browser (F12 → Console)
  7. Espera el alert de confirmación
  8. ELIMINA el script tag del admin.html inmediatamente
*/
