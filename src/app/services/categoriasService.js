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
import { getMovimentacoes } from './movimentacoesService';

const db = getFirestore(app);

export async function getCategorias(usuarioId, tipo) {
  const ref = collection(db, 'categorias');
  const condicoes = [where('usuarioId', '==', usuarioId)];
  if (tipo) condicoes.push(where('tipo', '==', tipo));
  const q = query(ref, ...condicoes);
  const snap = await getDocs(q);
  const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return lista.sort((a, b) =>
    (a.descricao || '').localeCompare(b.descricao || '', 'pt-BR')
  );
}

export async function criarCategoria({ usuarioId, tipo, descricao }) {
  const ref = collection(db, 'categorias');
  const docRef = await addDoc(ref, {
    usuarioId,
    tipo,
    descricao: (descricao || '').trim(),
    criadoEm: new Date().toISOString(),
  });
  return docRef.id;
}

export async function atualizarCategoria(id, { tipo, descricao }) {
  const ref = doc(db, 'categorias', id);
  await updateDoc(ref, {
    tipo,
    descricao: (descricao || '').trim(),
    atualizadoEm: new Date().toISOString(),
  });
}

export async function excluirCategoria(id) {
  const ref = doc(db, 'categorias', id);
  await deleteDoc(ref);
}

export async function categoriaEmUso(usuarioId, categoriaId) {
  const movs = await getMovimentacoes(usuarioId);
  return movs.some((m) => m.categoria?.id === categoriaId);
}
