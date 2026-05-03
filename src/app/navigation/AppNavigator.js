import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListaMovimentacoesScreen from '../screens/movimentacoes/ListaMovimentacoesScreen';
import NovaMovimentacaoScreen from '../screens/movimentacoes/NovaMovimentacaoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ListaMovimentacoes" component={ListaMovimentacoesScreen} />
        <Stack.Screen name="NovaMovimentacao" component={NovaMovimentacaoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}