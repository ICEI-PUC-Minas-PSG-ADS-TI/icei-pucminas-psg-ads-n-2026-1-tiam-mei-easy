import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Colors from '../constants/colors';

export function FilterChip({ label, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipAtivo]}
      onPress={onPress}
    >
      <Text style={[styles.chipTexto, selected && styles.chipTextoAtivo]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function ChipGroup({ options, value, onChange, horizontal = true }) {
  const content = options.map((opt) => (
    <FilterChip
      key={opt.value ?? opt.label}
      label={opt.label}
      selected={value === opt.value}
      onPress={() => onChange(opt.value)}
    />
  ));

  if (horizontal) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.row}>{content}</View>
      </ScrollView>
    );
  }

  return <View style={styles.wrap}>{content}</View>;
}

const styles = StyleSheet.create({
  scroll: { marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: {
    backgroundColor: Colors.primaryMedium,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipAtivo: { borderColor: Colors.accent },
  chipTexto: { color: Colors.textSoft, fontSize: 12 },
  chipTextoAtivo: { color: Colors.white, fontWeight: '600' },
});
