import {
  doc,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '../../config/firebase';

export async function deleteEstoque(id) {

  try {

    const docRef = doc(db, 'estoque', id);

    await deleteDoc(docRef);

    return {
      success: true,
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      error,
    };

  }

}