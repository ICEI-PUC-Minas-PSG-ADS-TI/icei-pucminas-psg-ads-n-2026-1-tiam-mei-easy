import {
  doc,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';

export async function updateEstoque(id, data) {

  try {

    const docRef = doc(db, 'estoque', id);

    await updateDoc(docRef, {
      nome: data.nome,
      fabricante: data.fabricante,
      valor: data.valor,
    });

    return {
      success: true,
    };

  } catch (error) {

    console.log('ERRO AO ATUALIZAR');

    console.log(error);

    return {
      success: false,
      error,
    };

  }

}