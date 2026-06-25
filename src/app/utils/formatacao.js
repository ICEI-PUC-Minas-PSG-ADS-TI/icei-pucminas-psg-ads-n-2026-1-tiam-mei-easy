export function formatarMoedaExibicao(valor) {
  const num = parseFloat(valor || 0);
  return `R$ ${Math.abs(num).toFixed(2).replace('.', ',')}`;
}

export function formatarMoedaInput(valor) {
  const num = String(valor).replace(/\D/g, '');
  if (!num) return '';
  const inteiro = parseInt(num, 10);
  return (inteiro / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function extrairNumeroMoeda(valorFormatado) {
  const num = String(valorFormatado).replace(/\D/g, '');
  if (!num) return 0;
  return parseInt(num, 10) / 100;
}

export function formatarDataBR(data) {
  if (!data) return '';
  const d = String(data).includes('T') ? new Date(data) : new Date(`${data}T00:00:00`);
  return d.toLocaleDateString('pt-BR');
}
