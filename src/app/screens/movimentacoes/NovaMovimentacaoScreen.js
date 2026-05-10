import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, Platform,
} from 'react-native';
import { criarMovimentacao, editarMovimentacao } from '../../services/movimentacoesService';
import { getCategorias } from '../../services/categoriasService';
// Usuário fixo por enquanto — trocar pelo auth real quando login estiver pronto
const USUARIO_ID = 'usuario_teste';

export default function NovaMovimentacaoScreen({ navigation, route }) {
  const edicao = route?.params?.movimentacao || null;

  const [tipo, setTipo] = useState(edicao?.tipo || 'receita');
  const [valor, setValor] = useState(edicao?.valor?.toString() || '');
  const [descricao, setDescricao] = useState(edicao?.descricao || '');
  const [data, setData] = useState(edicao?.data ? edicao.data.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [categorias, setCategorias] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(edicao?.categoria || null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, [tipo]);

  async function carregarCategorias() {
    try {
      const lista = await getCategorias(USUARIO_ID, tipo);
      setCategorias(lista);
    } catch (e) {
      setCategorias([]);
    }
  }

  async function salvar() {
    if (!valor || isNaN(parseFloat(valor))) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }
    if (!data) {
      Alert.alert('Atenção', 'Informe a data.');
      return;
    }

    setCarregando(true);
    try {
      const dados = {
        tipo,
        valor: parseFloat(valor),
        descricao,
        data,
        usuarioId: USUARIO_ID,
        categoria: categoriaSelecionada || null,
      };

      if (edicao) {
        await editarMovimentacao(edicao.id, dados);
        Alert.alert('Sucesso', 'Movimentação atualizada!');
      } else {
        await criarMovimentacao(dados);
        Alert.alert('Sucesso', 'Movimentação salva!');
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnVoltar}>
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>MEI <Text style={styles.headerDestaque}>EASY</Text></Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.titulo}>{edicao ? 'Editar Movimentação' : 'Nova Movimentação'}</Text>

        {/* Tipo */}
        <Text style={styles.label}>Valor:</Text>
        <View style={styles.tipoRow}>
          <TouchableOpacity
            style={[styles.btnTipo, tipo === 'receita' && styles.btnTipoAtivo]}
            onPress={() => { setTipo('receita'); setCategoriaSelecionada(null); }}
          >
            <Text style={styles.btnTipoIcone}>↑</Text>
            <Text style={styles.btnTipoTexto}>Entrada</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnTipo, tipo === 'despesa' && styles.btnTipoAtivo]}
            onPress={() => { setTipo('despesa'); setCategoriaSelecionada(null); }}
          >
            <Text style={styles.btnTipoIcone}>↓</Text>
            <Text style={styles.btnTipoTexto}>Saída</Text>
          </TouchableOpacity>
        </View>

        {/* Valor */}
        <TextInput
          style={styles.input}
          placeholder="R$ 0,00"
          placeholderTextColor="#aac"
          keyboardType="decimal-pad"
          value={valor}
          onChangeText={setValor}
        />

        {/* Categoria */}
        <Text style={styles.label}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll}>
          {categorias.length === 0 && (
            <Text style={styles.semCategoria}>Nenhuma categoria cadastrada</Text>
          )}
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.btnCategoria, categoriaSelecionada?.id === cat.id && styles.btnCategoriaAtiva]}
              onPress={() => setCategoriaSelecionada(cat)}
            >
              <Text style={styles.btnCategoriaTexto}>{cat.descricao}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Descrição */}
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Pagamento de serviço"
          placeholderTextColor="#aac"
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* Data */}
        <Text style={styles.label}>Data</Text>
        <TextInput
          style={styles.input}
          placeholder="AAAA-MM-DD"
          placeholderTextColor="#aac"
          value={data}
          onChangeText={setData}
          keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
        />

        {/* Botão Salvar */}
        <TouchableOpacity style={styles.btnSalvar} onPress={salvar} disabled={carregando}>
          <Text style={styles.btnSalvarTexto}>{carregando ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const AZUL_ESCURO = '#1a2a5e';
const AZUL_MEDIO = '#2d5be3';
const AZUL_CLARO = '#3a6ff0';
const BRANCO = '#ffffff';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AZUL_ESCURO },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: AZUL_ESCURO,
  },
  btnVoltar: { padding: 4 },
  btnVoltarTexto: { color: BRANCO, fontSize: 22 },
  headerTitulo: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
  headerDestaque: { color: '#4fc3f7' },
  body: { padding: 20, paddingBottom: 40 },
  titulo: { color: BRANCO, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { color: BRANCO, fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  tipoRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  btnTipo: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: AZUL_MEDIO, borderRadius: 10, paddingVertical: 14, gap: 8,
    borderWidth: 2, borderColor: 'transparent',
  },
  btnTipoAtivo: { borderColor: '#4fc3f7', backgroundColor: AZUL_CLARO },
  btnTipoIcone: { color: BRANCO, fontSize: 18, fontWeight: 'bold' },
  btnTipoTexto: { color: BRANCO, fontSize: 15, fontWeight: '600' },
  input: {
    backgroundColor: AZUL_MEDIO, color: BRANCO, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 12, fontSize: 15,
  },
  categoriasScroll: { marginBottom: 4 },
  btnCategoria: {
    backgroundColor: AZUL_MEDIO, borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 8, marginRight: 8, borderWidth: 2, borderColor: 'transparent',
  },
  btnCategoriaAtiva: { borderColor: '#4fc3f7' },
  btnCategoriaTexto: { color: BRANCO, fontSize: 13 },
  semCategoria: { color: '#aac', fontSize: 13, marginTop: 8 },
  btnSalvar: {
    backgroundColor: AZUL_MEDIO, borderRadius: 10, paddingVertical: 16,
    alignItems: 'center', marginTop: 32,
  },
  btnSalvarTexto: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
});