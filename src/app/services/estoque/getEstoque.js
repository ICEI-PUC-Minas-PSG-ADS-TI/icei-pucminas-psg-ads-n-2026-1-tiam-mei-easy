import {
  collection,
  getDocs,
} from 'firebase/firestore';

import { db } from '../../config/firebase.js';

export async function getEstoque() {

  try {

    const querySnapshot = await getDocs(
      collection(db, 'estoque')
    );

    const estoque = [];

    querySnapshot.forEach((doc) => {

      estoque.push({
        id: doc.id,
        ...doc.data(),
      });

    });

    return {
      success: true,
      data: estoque,
    };

  } catch (error) {

    console.log(error);

    return {
      success: false,
      error,
    };

  }

}