import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomePage from "../screens/screensMisc/HomePage.js"
import ListaMovimentacoesScreen from '../screens/movimentacoes/ListaMovimentacoesScreen';
import NovaMovimentacaoScreen from '../screens/movimentacoes/NovaMovimentacaoScreen';
import EstoqueScreen from '../screens/estoque/estoqueScreen.js'
import ListaClientesScreen from '../screens/clientes/ListaClientesScreen';
import ListaCategoriasScreen from '../screens/categorias/ListaCategoriasScreen';
import FormularioCategoriaScreen from '../screens/categorias/FormularioCategoriaScreen';

const Stack = createNativeStackNavigator();

const linkingScreens = {
  Home: '',
  ListaMovimentacoes: 'movimentacoes',
  NovaMovimentacao: 'movimentacoes/nova',
  ListaCategorias: 'categorias',
  FormularioCategoria: 'categorias/nova',
};

export default function AppNavigator() {
  const linking = useMemo(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return undefined;
    }
    return {
      prefixes: [window.location.origin],
      config: { screens: linkingScreens },
    };
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="ListaMovimentacoes" component={ListaMovimentacoesScreen} />
        <Stack.Screen name="NovaMovimentacao" component={NovaMovimentacaoScreen} />
        <Stack.Screen name="Estoque" component={EstoqueScreen} />
        <Stack.Screen name="Clientes" component={ListaClientesScreen} />
        <Stack.Screen name="ListaCategorias" component={ListaCategoriasScreen} />
        <Stack.Screen name="FormularioCategoria" component={FormularioCategoriaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}