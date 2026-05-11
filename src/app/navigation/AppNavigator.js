import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomePage from "../screens/screensMisc/HomePage.js"
import ListaMovimentacoesScreen from '../screens/movimentacoes/ListaMovimentacoesScreen';
import NovaMovimentacaoScreen from '../screens/movimentacoes/NovaMovimentacaoScreen';
import ListaCategoriasScreen from '../screens/categorias/ListaCategoriasScreen';
import FormularioCategoriaScreen from '../screens/categorias/FormularioCategoriaScreen';

import ListaRecorrenciasScreen from '../screens/recorrencias/ListaRecorrenciasScreen';
import FormularioRecorrenciaScreen from '../screens/recorrencias/FormularioRecorrenciaScreen';

const Stack = createNativeStackNavigator();

const linkingScreens = {
  Home: '',
  ListaMovimentacoes: 'movimentacoes',
  NovaMovimentacao: 'movimentacoes/nova',
  ListaCategorias: 'categorias',
  FormularioCategoria: 'categorias/nova',
  ListaRecorrencias: 'recorrencias',
  FormularioRecorrencia: 'recorrencias/nova',
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
        <Stack.Screen name="ListaCategorias" component={ListaCategoriasScreen} />
        <Stack.Screen name="FormularioCategoria" component={FormularioCategoriaScreen} />
        <Stack.Screen name="ListaRecorrencias" component={ListaRecorrenciasScreen} />
        <Stack.Screen name="FormularioRecorrencia" component={FormularioRecorrenciaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}