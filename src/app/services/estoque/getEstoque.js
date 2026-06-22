import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../../config/firebase.js';

export async function getEstoque(usuarioId) {
  try {
    const q = query(
      collection(db, 'estoque'),
      where('usuarioId', '==', usuarioId)
    );
    const querySnapshot = await getDocs(q);

    const estoque = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    return { success: true, data: estoque };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}
