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

// Busca todas as movimentações do usuário com filtros opcionais
export async function getMovimentacoes(usuarioId, filtros = {}) {
  const ref = collection(db, 'movimentacoes');
  const condicoes = [where('usuarioId', '==', usuarioId)];

  if (filtros.tipo) condicoes.push(where('tipo', '==', filtros.tipo));

  const q = query(ref, ...condicoes);
  const snap = await getDocs(q);

  let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  docs.sort((a, b) => new Date(b.data) - new Date(a.data));

  if (filtros.dataInicio) {
    docs = docs.filter((m) => new Date(m.data) >= new Date(filtros.dataInicio));
  }
  if (filtros.dataFim) {
    docs = docs.filter((m) => new Date(m.data) <= new Date(filtros.dataFim));
  }

  return docs;
}

// Cria nova movimentação
export async function criarMovimentacao(dados) {
  const ref = collection(db, 'movimentacoes');
  const docRef = await addDoc(ref, {
    ...dados,
    data: dados.data || new Date().toISOString().slice(0,10),
    criadoEm: new Date().toISOString(),
  });
  return docRef.id;
}

// Edita uma movimentação existente
export async function editarMovimentacao(id, dados) {
  const ref = doc(db, 'movimentacoes', id);
  await updateDoc(ref, { ...dados, atualizadoEm: new Date().toISOString() });
}

// Exclui uma movimentação
export async function excluirMovimentacao(id) {
  const ref = doc(db, 'movimentacoes', id);
  await deleteDoc(ref);
}

// Busca categorias do usuário
export async function getCategorias(usuarioId, tipo) {
  const ref = collection(db, 'categorias');
  const condicoes = [where('usuarioId', '==', usuarioId)];
  if (tipo) condicoes.push(where('tipo', '==', tipo));
  const q = query(ref, ...condicoes);
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}