// Módulo para CRUD de propiedades en Firestore
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, getDocs, doc, query, where, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

function comprimirImagen(file, maxWidth = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
        if (typeof file === 'string' && file.startsWith('data:')) {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const scale = Math.min(maxWidth / img.width, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return resolve(file);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(blob => resolve(blob || file), 'image/jpeg', quality);
                } catch (e) {
                    resolve(file);
                }
            };
            img.onerror = () => resolve(file);
            img.src = file;
            return;
        }
        if (!file || !file.type.startsWith('image/')) return resolve(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    const scale = Math.min(maxWidth / img.width, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return resolve(file);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob(blob => resolve(blob || file), 'image/jpeg', quality);
                } catch (e) {
                    resolve(file);
                }
            };
            img.onerror = () => resolve(file);
            img.src = e.target.result;
        };
        reader.onerror = () => resolve(file);
        reader.readAsDataURL(file);
    });
}

async function uploadImage(ownerId, file) {
    if (!file) return null;
    console.log('[props] comprimiendo imagen...', file.name, (file.size / 1024).toFixed(1) + 'KB');
    const compressed = await comprimirImagen(file);
    const compressedSize = compressed.size ? (compressed.size / 1024).toFixed(1) + 'KB' : 'N/A';
    console.log('[props] imagen comprimida:', compressedSize);
    const timestamp = Date.now();
    const safeName = (file.name || 'imagen.jpg').replace(/[^a-zA-Z0-9.-_]/g, '_');
    const path = `propiedades/${ownerId}/${timestamp}_${safeName}`;
    const ref = storageRef(storage, path);
    let toUpload = compressed;
    if (typeof compressed === 'string' && compressed.startsWith('data:')) {
        const res = await fetch(compressed);
        toUpload = await res.blob();
    }
    console.log('[props] subiendo a Storage...');
    await uploadBytes(ref, toUpload);
    console.log('[props] subida completa, obteniendo URL...');
    const url = await getDownloadURL(ref);
    console.log('[props] URL obtenida:', url ? 'OK' : 'sin URL');
    return url;
}

export const addProperty = async (ownerId, property) => {
    const data = { ownerId, createdAt: new Date() };
    try {
        if (property.file) {
            console.log('[props] subiendo imagen...');
            const url = await uploadImage(ownerId, property.file);
            if (url) data.imageUrl = url;
            console.log('[props] imagen subida:', url ? 'OK' : 'sin url');
        } else if (property.image) {
            const url = await uploadImage(ownerId, property.image);
            if (url) data.imageUrl = url;
        }
    } catch (e) {
        console.error('[props] error al subir imagen:', e);
        throw new Error('Error al subir la imagen: ' + (e.message || 'desconocido'));
    }
    data.title = property.title || property.titulo || '';
    data.location = property.location || property.ubicacion || '';
    data.price = property.price || property.precio || 0;
    data.type = property.type || property.tipo || '';
    data.description = property.description || property.descripcion || '';

    console.log('[props] guardando en Firestore...', data);
    const ref = await addDoc(collection(db, 'propiedades'), data);
    console.log('[props] documento creado:', ref.id);
    return ref.id;
};

export const updateProperty = async (id, updates) => {
    const docRef = doc(db, 'propiedades', id);
    const payload = { updatedAt: new Date() };
    if (updates.file) {
        const url = await uploadImage(updates.ownerId || 'unknown', updates.file);
        if (url) payload.imageUrl = url;
    } else if (updates.image) {
        const url = await uploadImage(updates.ownerId || 'unknown', updates.image);
        if (url) payload.imageUrl = url;
    }
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.location !== undefined) payload.location = updates.location;
    if (updates.price !== undefined) payload.price = updates.price;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.description !== undefined) payload.description = updates.description;

    await updateDoc(docRef, payload);
};

export const deleteProperty = async (id) => {
    const docRef = doc(db, 'propiedades', id);
    try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
            const data = snap.data();
            if (data && data.imageUrl) {
                try {
                    const imgRef = storageRef(storage, data.imageUrl);
                    await deleteObject(imgRef);
                } catch (err) {
                    console.warn('No se pudo eliminar imagen en Storage:', err);
                }
            }
        }
    } catch (e) {
        console.warn('Error leyendo documento antes de borrar:', e);
    }
    await deleteDoc(docRef);
};

export const listPropertiesByUser = async (ownerId) => {
    const q = query(collection(db, 'propiedades'), where('ownerId', '==', ownerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
