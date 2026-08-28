import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../store';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 45) / numColumns;

export default function LaundryScreen() {
  // On récupère tous les vêtements et la fonction pour les laver
  const clothes = useStore(state => state.clothes);
  const markAsClean = useStore(state => state.markAsClean);

  // On filtre pour ne garder que le linge sale
  const dirtyClothes = clothes.filter(item => item.isDirty);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.uri }} style={styles.clothingImage} contentFit="cover" />
      
      <View style={styles.overlay}>
        <Text style={styles.dirtyText}>Au sale</Text>
      </View>

      {/* Bouton pour laver le vêtement */}
      <TouchableOpacity 
        style={styles.washBtn} 
        onPress={() => markAsClean(item.id)}
        activeOpacity={0.8}
      >
        <Ionicons name="water" size={18} color="#FFF" />
        <Text style={styles.washBtnText}>Laver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panier à linge</Text>
        <Text style={styles.subtitle}>{dirtyClothes.length} article(s) à laver</Text>
      </View>

      {dirtyClothes.length > 0 ? (
        <FlatList
          data={dirtyClothes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="sparkles" size={60} color="#A0A0A0" />
          <Text style={styles.emptyText}>Votre linge est tout propre !</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#FFF', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 5 },
  listContainer: { padding: 15, paddingBottom: 100 },
  card: { flex: 1, margin: 7, backgroundColor: '#FFF', borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3, overflow: 'hidden' },
  clothingImage: { width: '100%', height: itemWidth * 1.25, opacity: 0.6 }, // Image un peu transparente pour faire "sale"
  overlay: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  dirtyText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  washBtn: { position: 'absolute', bottom: 10, alignSelf: 'center', backgroundColor: '#007AFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  washBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#A0A0A0', marginTop: 15, fontStyle: 'italic' }
  
});