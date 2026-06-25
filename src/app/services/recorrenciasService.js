import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

import { app } from '../config/firebase';

const db = getFirestore(app);

export async function getRecorrencias(usuarioId) {
  const ref = collection(db, 'recorrencias');

  const q = query(ref, where('usuarioId', '==', usuarioId));

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

export async function criarRecorrencia({
  usuarioId,
  descricao,
  valor,
  tipo,
  diaDoMes,
  ativo,
}) {
  const ref = collection(db, 'recorrencias');

  const docRef = await addDoc(ref, {
    usuarioId,
    descricao: (descricao || '').trim(),
    valor: Number(valor),
    tipo,
    diaDoMes: Number(diaDoMes),
    ativo,
    criadoEm: new Date().toISOString(),
  });

  return docRef.id;
}

export async function atualizarRecorrencia(
  id,
  {
    descricao,
    valor,
    tipo,
    diaDoMes,
    ativo,
  }
) {
  const ref = doc(db, 'recorrencias', id);

  await updateDoc(ref, {
    descricao: (descricao || '').trim(),
    valor: Number(valor),
    tipo,
    diaDoMes: Number(diaDoMes),
    ativo,
    atualizadoEm: new Date().toISOString(),
  });
}

export async function excluirRecorrencia(id) {
  const ref = doc(db, 'recorrencias', id);

  await deleteDoc(ref);
}
