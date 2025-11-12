import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../utils/colors';

export default function ButtonPrimary({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <Text style={styles.txt}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  txt: { color: '#fff', fontWeight: 'bold' },
});