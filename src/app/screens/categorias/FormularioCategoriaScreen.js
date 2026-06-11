import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { criarCategoria, atualizarCategoria } from '../../services/categoriasService';
import { showAlert } from '../../utils/alert';

const USUARIO_ID = 'usuario_teste';

export default function FormularioCategoriaScreen({ navigation, route }) {
  const edicao = route?.params?.categoria || null;
  const tipoInicial = route?.params?.tipoInicial || 'receita';

  const [tipo, setTipo] = useState(edicao?.tipo || tipoInicial);
  const [descricao, setDescricao] = useState(edicao?.descricao || '');
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    const nome = (descricao || '').trim();
    if (!nome) {
      showAlert('Atenção', 'Informe o nome da categoria.');
      return;
    }

    setCarregando(true);
    try {
      if (edicao) {
        await atualizarCategoria(edicao.id, { tipo, descricao: nome });
        showAlert('Sucesso', 'Categoria atualizada!');
      } else {
        await criarCategoria({
          usuarioId: USUARIO_ID,
          tipo,
          descricao: nome,
        });
        showAlert('Sucesso', 'Categoria criada!');
      }
      navigation.goBack();
    } catch (e) {
      showAlert('Erro', 'Não foi possível salvar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnVoltar}
        >
          <Text style={styles.btnVoltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitulo}>
          MEI <Text style={styles.headerDestaque}>EASY</Text>
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.titulo}>
          {edicao ? 'Editar categoria' : 'Nova categoria'}
        </Text>

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.tipoRow}>
          <TouchableOpacity
            style={[styles.btnTipo, tipo === 'receita' && styles.btnTipoAtivo]}
            onPress={() => setTipo('receita')}
          >
            <Text style={styles.btnTipoIcone}>↑</Text>
            <Text style={styles.btnTipoTexto}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnTipo, tipo === 'despesa' && styles.btnTipoAtivo]}
            onPress={() => setTipo('despesa')}
          >
            <Text style={styles.btnTipoIcone}>↓</Text>
            <Text style={styles.btnTipoTexto}>Despesa</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Material de escritório"
          placeholderTextColor="#aac"
          value={descricao}
          onChangeText={setDescricao}
        />

        <TouchableOpacity
          style={styles.btnSalvar}
          onPress={salvar}
          disabled={carregando}
        >
          <Text style={styles.btnSalvarTexto}>
            {carregando ? 'Salvando...' : 'Salvar'}
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: AZUL_ESCURO,
  },
  btnVoltar: { padding: 4 },
  btnVoltarTexto: { color: BRANCO, fontSize: 22 },
  headerTitulo: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
  headerDestaque: { color: '#4fc3f7' },
  body: { padding: 20, paddingBottom: 40 },
  titulo: {
    color: BRANCO,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: { color: BRANCO, fontSize: 14, fontWeight: '600', marginBottom: 8 },
  tipoRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  btnTipo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AZUL_MEDIO,
    borderRadius: 10,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  btnTipoAtivo: { borderColor: '#4fc3f7', backgroundColor: AZUL_CLARO },
  btnTipoIcone: { color: BRANCO, fontSize: 18, fontWeight: 'bold' },
  btnTipoTexto: { color: BRANCO, fontSize: 15, fontWeight: '600' },
  input: {
    backgroundColor: AZUL_MEDIO,
    color: BRANCO,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 8,
  },
  btnSalvar: {
    backgroundColor: AZUL_MEDIO,
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  btnSalvarTexto: { color: BRANCO, fontSize: 16, fontWeight: 'bold' },
});
