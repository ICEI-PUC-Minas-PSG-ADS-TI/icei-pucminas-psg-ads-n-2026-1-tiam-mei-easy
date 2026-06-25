import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

import { db } from '../config/firebase';

const COLLECTION = 'servicos';

export async function criarServico(userId, dados) {
  return await addDoc(collection(db, COLLECTION), {
    userId,
    nome: dados.nome,
    descricao: dados.descricao,
    valor: Number(dados.valor),
    createdAt: new Date(),
  });
}

export async function listarServicos(userId) {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function atualizarServico(id, dados) {
  await updateDoc(doc(db, COLLECTION, id), {
    nome: dados.nome,
    descricao: dados.descricao,
    valor: Number(dados.valor),
  });
}

export async function excluirServico(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}