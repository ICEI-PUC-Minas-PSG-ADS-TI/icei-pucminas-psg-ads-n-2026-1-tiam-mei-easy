const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const PERIODOS = [
  { id: 'mes_atual', label: 'Este mês' },
  { id: 'mes_anterior', label: 'Mês anterior' },
  { id: 'ultimos_3_meses', label: 'Últimos 3 meses' },
  { id: 'ano_atual', label: 'Ano atual' },
];

function inicioDoMes(ano, mes) {
  return new Date(ano, mes, 1);
}

function fimDoMes(ano, mes) {
  return new Date(ano, mes + 1, 0, 23, 59, 59, 999);
}

export function getIntervaloPeriodo(periodoId) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  switch (periodoId) {
    case 'mes_anterior': {
      const mesRef = mes === 0 ? 11 : mes - 1;
      const anoRef = mes === 0 ? ano - 1 : ano;
      return { dataInicio: inicioDoMes(anoRef, mesRef), dataFim: fimDoMes(anoRef, mesRef) };
    }
    case 'ultimos_3_meses':
      return { dataInicio: inicioDoMes(ano, mes - 2), dataFim: fimDoMes(ano, mes) };
    case 'ano_atual':
      return { dataInicio: inicioDoMes(ano, 0), dataFim: fimDoMes(ano, 11) };
    case 'mes_atual':
    default:
      return { dataInicio: inicioDoMes(ano, mes), dataFim: fimDoMes(ano, mes) };
  }
}

export function formatarIntervalo(dataInicio, dataFim) {
  const inicio = dataInicio.toLocaleDateString('pt-BR');
  const fim = dataFim.toLocaleDateString('pt-BR');
  return `${inicio} — ${fim}`;
}

export function calcularResumo(movimentacoes) {
  const receitas = movimentacoes
    .filter((m) => m.tipo === 'receita')
    .reduce((acc, m) => acc + parseFloat(m.valor || 0), 0);

  const despesas = movimentacoes
    .filter((m) => m.tipo === 'despesa')
    .reduce((acc, m) => acc + parseFloat(m.valor || 0), 0);

  return { receitas, despesas, resultado: receitas - despesas };
}

function chaveSemana(data) {
  const d = new Date(data);
  const inicio = new Date(d);
  inicio.setDate(d.getDate() - d.getDay());
  return inicio.toISOString().slice(0, 10);
}

function labelSemana(chave) {
  const d = new Date(chave);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function chaveMes(data) {
  const d = new Date(data);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function labelMes(chave) {
  const [, mes] = chave.split('-');
  return MESES[parseInt(mes, 10) - 1];
}

export function agruparComparativo(movimentacoes, dataInicio, dataFim) {
  const diffDias = Math.ceil((dataFim - dataInicio) / (1000 * 60 * 60 * 24)) + 1;
  const porMes = diffDias > 45;

  const mapa = new Map();

  movimentacoes.forEach((m) => {
    const chave = porMes ? chaveMes(m.data) : chaveSemana(m.data);
    if (!mapa.has(chave)) {
      mapa.set(chave, { chave, receitas: 0, despesas: 0 });
    }
    const grupo = mapa.get(chave);
    const valor = parseFloat(m.valor || 0);
    if (m.tipo === 'receita') grupo.receitas += valor;
    else if (m.tipo === 'despesa') grupo.despesas += valor;
  });

  return Array.from(mapa.values())
    .sort((a, b) => a.chave.localeCompare(b.chave))
    .map((g) => ({
      label: porMes ? labelMes(g.chave) : labelSemana(g.chave),
      receitas: g.receitas,
      despesas: g.despesas,
    }));
}

import { formatarMoedaExibicao } from '../utils/formatacao';

export { formatarMoedaExibicao as formatarMoeda };
