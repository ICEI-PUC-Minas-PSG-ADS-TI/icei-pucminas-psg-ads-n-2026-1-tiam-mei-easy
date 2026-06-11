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

// Busca contas do usuário, com filtros opcionais por tipo (pagar/receber) e status (pendente/pago)
export async function getContas(usuarioId, filtros = {}) {
  const ref = collection(db, 'contas');
  const condicoes = [where('usuarioId', '==', usuarioId)];

  if (filtros.tipo) condicoes.push(where('tipo', '==', filtros.tipo));
  if (filtros.status) condicoes.push(where('status', '==', filtros.status));

  const q = query(ref, ...condicoes);
  const snap = await getDocs(q);

  let docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Ordena por data de vencimento (mais próximas primeiro)
  docs.sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento));

  return docs;
}

// Cria nova conta (a pagar ou a receber)
export async function criarConta(dados) {
  const ref = collection(db, 'contas');
  const docRef = await addDoc(ref, {
    ...dados,
    status: dados.status || 'pendente',
    criadoEm: new Date().toISOString(),
  });
  return docRef.id;
}

// Edita uma conta existente
export async function atualizarConta(id, dados) {
  const ref = doc(db, 'contas', id);
  await updateDoc(ref, { ...dados, atualizadoEm: new Date().toISOString() });
}

// Exclui uma conta
export async function excluirConta(id) {
  const ref = doc(db, 'contas', id);
  await deleteDoc(ref);
}

// Alterna o status entre 'pendente' e 'pago'
export async function alternarStatusConta(id, statusAtual) {
  const novoStatus = statusAtual === 'pago' ? 'pendente' : 'pago';
  const ref = doc(db, 'contas', id);
  await updateDoc(ref, {
    status: novoStatus,
    atualizadoEm: new Date().toISOString(),
  });
  return novoStatus;
}