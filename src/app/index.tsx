import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 45) / numColumns;

const CATEGORIES = ['Hauts', 'Bas', 'Chaussures', 'Accessoires'];

export default function WardrobeScreen() {
  const [clothes, setClothes] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Tous');
  
  // États pour les modales
  const [isSourceMenuVisible, setSourceMenuVisible] = useState(false); // Le nouveau menu Photo/Galerie
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

  // NOUVEAU : Fonction pour l'appareil photo
  const takePhoto = async () => {
    setSourceMenuVisible(false); // On ferme le menu

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("L'accès à l'appareil photo est nécessaire !");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  // Fonction existante pour la galerie
  const pickImage = async () => {
    setSourceMenuVisible(false); // On ferme le menu

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("L'accès à la galerie est nécessaire !");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 5],
      quality: 0.8,
    });

    if (!result.canceled) {
      setTempImage(result.assets[0].uri);
      setModalVisible(true);
    }
  };

  const saveClothingItem = () => {
    const newItem = { id: Date.now().toString(), uri: tempImage, category: selectedCategory };
    setClothes([newItem, ...clothes]);
    
    setModalVisible(false);
    setTempImage(null);
    setSelectedCategory(CATEGORIES[0]);
  };

  const filteredClothes = activeFilter === 'Tous' ? clothes : clothes.filter(item => item.category === activeFilter);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.uri }} style={styles.clothingImage} contentFit="cover" transition={300} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.category}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['Tous', ...CATEGORIES].map((cat) => (
            <TouchableOpacity 
              key={cat} 
              style={[styles.filterChip, activeFilter === cat && styles.filterChipActive]}
              onPress={() => setActiveFilter(cat)}
            >
              <Text style={[styles.filterText, activeFilter === cat && styles.filterTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredClothes.length > 0 ? (
        <FlatList
          data={filteredClothes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.emptyText}>Aucun vêtement dans cette catégorie.</Text>
      )}

      {/* Bouton qui ouvre maintenant le menu de choix */}
      <TouchableOpacity style={styles.fab} onPress={() => setSourceMenuVisible(true)} activeOpacity={0.8}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      {/* NOUVEAU : Modale pour choisir entre Appareil Photo et Galerie */}
      <Modal visible={isSourceMenuVisible} animationType="fade" transparent={true}>
        {/* TouchableOpacity en fond pour fermer le menu si on clique à côté */}
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSourceMenuVisible(false)}>
          <View style={styles.sourceMenuContent}>
            
            <TouchableOpacity style={styles.sourceBtn} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="white" />
              <Text style={styles.sourceBtnText}>Prendre une photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sourceBtnOutline} onPress={pickImage}>
              <Ionicons name="images" size={24} color="black" />
              <Text style={styles.sourceBtnTextDark}>Choisir dans la galerie</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modale de catégorisation (Inchangée) */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Catégoriser</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#A0A0A0" />
              </TouchableOpacity>
            </View>
            {tempImage && (
              <Image source={{ uri: tempImage }} style={styles.modalImage} contentFit="cover" />
            )}
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={saveClothingItem}>
              <Text style={styles.saveBtnText}>Ajouter à l'armoire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  filterContainer: { paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#FFF' },
  filterChip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F0F0', marginRight: 10 },
  filterChipActive: { backgroundColor: '#000' },
  filterText: { color: '#666', fontWeight: '600' },
  filterTextActive: { color: '#FFF' },
  listContainer: { padding: 15, paddingBottom: 100 },
  card: { flex: 1, margin: 7, backgroundColor: '#FFF', borderRadius: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3, overflow: 'hidden' },
  clothingImage: { width: '100%', height: itemWidth * 1.25 },
  badge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#333' },
  emptyText: { flex: 1, textAlign: 'center', textAlignVertical: 'center', fontSize: 16, color: '#A0A0A0', fontStyle: 'italic', marginTop: '50%' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#000000', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  
  // Styles des modales
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 50, shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20 },
  
  // NOUVEAU : Styles du menu de sélection (Photo / Galerie)
  sourceMenuContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, paddingBottom: 50 },
  sourceBtn: { flexDirection: 'row', backgroundColor: '#000', paddingVertical: 15, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  sourceBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  sourceBtnOutline: { flexDirection: 'row', backgroundColor: '#FFF', paddingVertical: 15, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#000' },
  sourceBtnTextDark: { color: '#000', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },

  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  modalImage: { width: 150, height: 150 * 1.25, borderRadius: 15, alignSelf: 'center', marginBottom: 20 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 30 },
  categoryBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0' },
  categoryBtnActive: { backgroundColor: '#000', borderColor: '#000' },
  categoryText: { color: '#333', fontWeight: '500' },
  categoryTextActive: { color: '#FFF' },
  saveBtn: { backgroundColor: '#000', paddingVertical: 15, borderRadius: 15, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});