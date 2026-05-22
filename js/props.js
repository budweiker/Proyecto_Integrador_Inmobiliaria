// Módulo para CRUD de propiedades en Firestore
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, getDocs, doc, query, where, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

const db = getFirestore();
const storage = getStorage();

async function uploadImage(ownerId, file) {
    if (!file) return null;
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-_]/g, '_');
    const path = `propiedades/${ownerId}/${timestamp}_${safeName}`;
    const ref = storageRef(storage, path);
    // if file is a dataURL string, convert to blob
    let toUpload = file;
    if (typeof file === 'string' && file.startsWith('data:')) {
        const res = await fetch(file);
        toUpload = await res.blob();
    }
    await uploadBytes(ref, toUpload);
    const url = await getDownloadURL(ref);
    return url;
}

export const addProperty = async (ownerId, property) => {
    const data = { ownerId, createdAt: new Date() };
    // handle image file (property.file) or data URL (property.image)
    if (property.file) {
        const url = await uploadImage(ownerId, property.file);
        if (url) data.imageUrl = url;
    } else if (property.image) {
        const url = await uploadImage(ownerId, property.image);
        if (url) data.imageUrl = url;
    }
    // copy other props
    data.title = property.title || property.titulo || '';
    data.location = property.location || property.ubicacion || '';
    data.price = property.price || property.precio || 0;
    data.description = property.description || property.descripcion || '';

    const ref = await addDoc(collection(db, 'propiedades'), data);
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
