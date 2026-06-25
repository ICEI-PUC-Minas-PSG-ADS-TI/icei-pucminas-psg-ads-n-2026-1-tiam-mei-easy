import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../config/firebase.js';

export async function addEstoque(data, usuarioId) {
  try {
    const docRef = await addDoc(collection(db, 'estoque'), {
      nome: data.nome,
      fabricante: data.fabricante,
      quantidade: Number(data.quantidade),
      valor: data.valor,
      usuarioId,
      createdAt: serverTimestamp(),
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.log('ERRO FIREBASE', error);
    return { success: false, error };
  }
}
