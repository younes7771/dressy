import { StyleSheet, Text, View } from 'react-native';

export default function LaundryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linge Sale</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F9F9' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' }
});