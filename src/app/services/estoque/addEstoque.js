import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../../config/firebase.js';

export async function addEstoque(data) {

  try {

    const docRef = await addDoc(
      collection(db, 'estoque'),
      {
        nome: data.nome,
        fabricante: data.fabricante,
        quantidade: Number(data.quantidade),
        valor: data.valor,

        /*
          futuramente:
          userId: auth.currentUser.uid
        */

        createdAt: serverTimestamp(),
      }
    );

    return {
      success: true,
      id: docRef.id,
    };

  } catch (error) {

  console.log('ERRO FIREBASE');

  console.log(error);

  return {
    success: false,
    error,
  };

}

}