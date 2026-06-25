import React, { useMemo } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Colors from '../constants/colors';

import LoginScreen from '../screens/auth/LoginScreen';
import CadastroScreen from '../screens/auth/CadastroScreen';
import HomePage from '../screens/screensMisc/HomePage';
import ListaMovimentacoesScreen from '../screens/movimentacoes/ListaMovimentacoesScreen';
import NovaMovimentacaoScreen from '../screens/movimentacoes/NovaMovimentacaoScreen';
import EstoqueScreen from '../screens/estoque/estoqueScreen.js';
import ListaClientesScreen from '../screens/clientes/ListaClientesScreen';
import ListaCategoriasScreen from '../screens/categorias/ListaCategoriasScreen';
import FormularioCategoriaScreen from '../screens/categorias/FormularioCategoriaScreen';
import ListaContasScreen from '../screens/contas/ListaContasScreen';
import FormularioContaScreen from '../screens/contas/FormularioContaScreen';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import RelatoriosScreen from '../screens/relatorios/RelatoriosScreen';
import RelatorioFinanceiroScreen from '../screens/relatorios/RelatorioFinanceiroScreen';
import PerfilContaScreen from '../screens/contas/PerfilContaScreen';

import ListaRecorrenciasScreen from '../screens/recorrencias/ListaRecorrenciasScreen';
import FormularioRecorrenciaScreen from '../screens/recorrencias/FormularioRecorrenciaScreen';

const Stack = createNativeStackNavigator();

const authLinkingScreens = {
  Login: 'login',
  Cadastro: 'cadastro',
};

const appLinkingScreens = {
  Home: '',
  ListaMovimentacoes: 'movimentacoes',
  NovaMovimentacao: 'movimentacoes/nova',
  ListaCategorias: 'categorias',
  FormularioCategoria: 'categorias/nova',
  ListaRecorrencias: 'recorrencias',
  FormularioRecorrencia: 'recorrencias/nova',
  ListaContas: 'contas',
  FormularioConta: 'contas/nova',
  Clientes: 'clientes',
  Estoque: 'estoque',
  Dashboard: 'dashboard',
  Relatórios: 'relatorios',
  RelatorioFinanceiro: 'relatorios/financeiro',
  PerfilConta: 'perfil',
};

function AuthStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme === 'dark' ? '#121212' : Colors.primary },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Cadastro" component={CadastroScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme === 'dark' ? '#121212' : '#FFFFFF' },
      }}
    >
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="ListaMovimentacoes" component={ListaMovimentacoesScreen} />
      <Stack.Screen name="NovaMovimentacao" component={NovaMovimentacaoScreen} />
      <Stack.Screen name="Estoque" component={EstoqueScreen} />
      <Stack.Screen name="Clientes" component={ListaClientesScreen} />
      <Stack.Screen name="ListaCategorias" component={ListaCategoriasScreen} />
      <Stack.Screen name="FormularioCategoria" component={FormularioCategoriaScreen} />
      <Stack.Screen name="ListaContas" component={ListaContasScreen} />
      <Stack.Screen name="FormularioConta" component={FormularioContaScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Relatórios" component={RelatoriosScreen} />
      <Stack.Screen name="RelatorioFinanceiro" component={RelatorioFinanceiroScreen} />
      <Stack.Screen name="PerfilConta" component={PerfilContaScreen} />
      <Stack.Screen name="ListaRecorrencias" component={ListaRecorrenciasScreen} />
      <Stack.Screen name="FormularioRecorrencia" component={FormularioRecorrenciaScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  const linking = useMemo(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }
    return {
      prefixes: [window.location.origin],
      config: { screens: user ? appLinkingScreens : authLinkingScreens },
    };
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
