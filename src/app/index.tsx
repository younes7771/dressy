import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';

const COLORS = {
  walnutDark: '#2A160D',
  walnut: '#3E2415',
  walnutMid: '#563020',
  oak: '#6B4226',
  brass: '#C9A227',
  brassDark: '#8C6D1F',
  label: '#F3E7D3',
  labelSoft: '#E4D3B4',
  rust: '#A63D2F',
};

function WardrobeBackdrop() {
  const grainLines = [0.06, 0.18, 0.24, 0.37, 0.5, 0.55, 0.68, 0.74, 0.86, 0.93];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={[COLORS.oak, COLORS.walnutMid, COLORS.walnut, COLORS.walnutDark]} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
      {grainLines.map((top, i) => (
        <View key={i} style={[styles.grainLine, { top: `${top * 100}%`, opacity: i % 2 === 0 ? 0.08 : 0.05, height: i % 3 === 0 ? 1.5 : 1 }]} />
      ))}
      <View style={[styles.hingeStrip, { left: 0 }]}>
        <View style={styles.hingeDot} />
        <View style={[styles.hingeDot, { marginTop: 160 }]} />
      </View>
      <View style={[styles.hingeStrip, { right: 0 }]}>
        <View style={styles.hingeDot} />
        <View style={[styles.hingeDot, { marginTop: 160 }]} />
      </View>
    </View>
  );
}

export default function WardrobeScreen() {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const numColumns = 2;
  const itemWidth = (screenWidth - 45) / numColumns;

  const clothes = useStore((state) => state.clothes);
  const categories = useStore((state) => state.categories);
  const addClothing = useStore((state) => state.addClothing);
  const markAsDirty = useStore((state) => state.markAsDirty);
  const addCategory = useStore((state) => state.addCategory);
  const updateClothingCategory = useStore((state) => state.updateClothingCategory);
  const deleteClothing = useStore((state) => state.deleteClothing);

  const [activeFilter, setActiveFilter] = useState('Tous');
  const [isSourceMenuVisible, setSourceMenuVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // États pour le CRUD (Mise à jour / Suppression)
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editCategory, setEditCategory] = useState('');

  const takePhoto = async () => {
    setSourceMenuVisible(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted) {
      let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 5], quality: 0.8 });
      if (!result.canceled) {
        setTempImage(result.assets[0].uri);
        setSelectedCategory(categories[0]);
        setModalVisible(true);
      }
    }
  };

  const pickImage = async () => {
    setSourceMenuVisible(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: 0.8 });
      if (!result.canceled) {
        setTempImage(result.assets[0].uri);
        setSelectedCategory(categories[0]);
        setModalVisible(true);
      }
    }
  };

  const saveClothingItem = () => {
    addClothing({ id: Date.now().toString(), uri: tempImage, category: selectedCategory });
    setModalVisible(false);
    setTempImage(null);
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const capitalized = newCategoryName.trim().charAt(0).toUpperCase() + newCategoryName.trim().slice(1);
      addCategory(capitalized);
      setSelectedCategory(capitalized);
    }
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const saveEditedClothing = () => {
    if (itemToEdit) {
      updateClothingCategory(itemToEdit.id, editCategory);
      setEditModalVisible(false);
      setItemToEdit(null);
    }
  };

  const handleDeleteClothing = () => {
    Alert.alert(
      "Jeter ce vêtement ?",
      "Il sera retiré de votre armoire et de votre agenda.",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive",
          onPress: () => {
            deleteClothing(itemToEdit.id);
            setEditModalVisible(false);
            setItemToEdit(null);
          }
        }
      ]
    );
  };

  const filteredClothes = clothes.filter(item => !item.isDirty && (activeFilter === 'Tous' || item.category === activeFilter));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={{ alignItems: 'center' }}
        onLongPress={() => {
          setItemToEdit(item);
          setEditCategory(item.category);
          setEditModalVisible(true);
        }}
      >
        <View style={styles.hookWrap}>
          <View style={styles.hookLine} />
          <View style={styles.hookCircle} />
        </View>
        <View style={styles.shelfItemFrame}>
          <Image source={{ uri: item.uri }} style={[styles.clothingImage, { width: itemWidth - 14, height: (itemWidth - 14) * 1.25 }]} contentFit="cover" transition={300} />
          <View style={styles.plaque}>
            <Text style={styles.plaqueText} numberOfLines={1}>{item.category}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.dirtyBtn} onPress={() => markAsDirty(item.id)}>
        <Ionicons name="basket" size={16} color={COLORS.label} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <WardrobeBackdrop />

      <View style={[styles.safeAreaWrapper, { paddingTop: insets.top }]}>
        <View style={styles.nameplateWrap}>
          <View style={styles.nameplate}>
            <View style={styles.nameplateRivet} />
            <Text style={styles.nameplateText}>MA GARDE-ROBE</Text>
            <View style={styles.nameplateRivet} />
          </View>
        </View>

        <View style={styles.rodWrap}>
          <View style={styles.rod} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rodScroll}>
            {['Tous', ...categories].map((cat) => (
              <TouchableOpacity key={cat} style={styles.tagWrap} onPress={() => setActiveFilter(cat)}>
                <View style={styles.tagPeg} />
                <View style={[styles.tagChip, activeFilter === cat && styles.tagChipActive]}>
                  <Text style={[styles.tagText, activeFilter === cat && styles.tagTextActive]}>{cat}</Text>
                </View>
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
            ItemSeparatorComponent={() => <View style={styles.shelfPlank} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyShelf} />
            <Ionicons name="shirt-outline" size={48} color={COLORS.labelSoft} />
            <Text style={styles.emptyTitle}>L'étagère est vide</Text>
            <Text style={styles.emptyText}>Touchez la clé pour ranger votre premier vêtement.</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => setSourceMenuVisible(true)} activeOpacity={0.85}>
        <View style={styles.fabInner}>
          <Ionicons name="key" size={28} color={COLORS.walnutDark} />
        </View>
      </TouchableOpacity>

      {/* Modale Choix Source Photo */}
      <Modal visible={isSourceMenuVisible} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setSourceMenuVisible(false)}>
          <View style={styles.sourceMenuContent}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Nouveau vêtement</Text>
            <TouchableOpacity style={styles.sourceBtn} onPress={takePhoto}>
              <Ionicons name="camera" size={22} color={COLORS.label} />
              <Text style={styles.sourceBtnText}>Prendre une photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sourceBtnOutline} onPress={pickImage}>
              <Ionicons name="images" size={22} color={COLORS.walnutDark} />
              <Text style={styles.sourceBtnTextDark}>Choisir dans la galerie</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modale Catégoriser (Create) */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ranger le vêtement</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setTempImage(null); setIsAddingCategory(false); }}>
                <Ionicons name="close-circle" size={26} color={COLORS.brassDark} />
              </TouchableOpacity>
            </View>

            {tempImage && (
              <View style={styles.modalImageFrame}>
                <Image source={{ uri: tempImage }} style={styles.modalImage} contentFit="cover" />
              </View>
            )}

            <Text style={styles.sectionLabel}>ÉTAGÈRE</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat} style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]} onPress={() => setSelectedCategory(cat)}>
                  <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}

              {isAddingCategory ? (
                <View style={styles.newCategoryInputContainer}>
                  <TextInput style={styles.newCategoryInput} placeholder="Ex: Sport..." placeholderTextColor="#A08A76" value={newCategoryName} onChangeText={setNewCategoryName} autoFocus onSubmitEditing={handleCreateCategory} />
                  <TouchableOpacity onPress={handleCreateCategory} style={styles.newCategoryCheck}>
                    <Ionicons name="checkmark" size={18} color={COLORS.walnutDark} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.addCategoryBtn} onPress={() => setIsAddingCategory(true)}>
                  <Ionicons name="add" size={16} color={COLORS.walnutDark} />
                  <Text style={styles.categoryText}>Nouveau</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveClothingItem}>
              <Text style={styles.saveBtnText}>Ranger dans l'armoire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modale Édition & Suppression (Update & Delete) */}
      <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier le vêtement</Text>
              <TouchableOpacity onPress={() => { setEditModalVisible(false); setItemToEdit(null); }}>
                <Ionicons name="close-circle" size={26} color={COLORS.brassDark} />
              </TouchableOpacity>
            </View>

            {itemToEdit && (
              <View style={styles.modalImageFrame}>
                <Image source={{ uri: itemToEdit.uri }} style={styles.modalImage} contentFit="cover" />
              </View>
            )}

            <Text style={styles.sectionLabel}>CHANGER D'ÉTAGÈRE</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity key={cat} style={[styles.categoryBtn, editCategory === cat && styles.categoryBtnActive]} onPress={() => setEditCategory(cat)}>
                  <Text style={[styles.categoryText, editCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={saveEditedClothing}>
              <Text style={styles.saveBtnText}>Enregistrer les modifications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveBtn, { backgroundColor: COLORS.rust, marginTop: 12, borderColor: '#7A2A20' }]} onPress={handleDeleteClothing}>
              <Text style={styles.saveBtnText}>Supprimer le vêtement</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.walnut },
  safeAreaWrapper: { flex: 1 },
  grainLine: { position: 'absolute', left: 0, right: 0, backgroundColor: COLORS.walnutDark },
  hingeStrip: { position: 'absolute', top: 100, width: 14, backgroundColor: 'rgba(0,0,0,0.25)' },
  hingeDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.brass, marginLeft: 2, borderWidth: 1, borderColor: COLORS.brassDark },
  nameplateWrap: { alignItems: 'center', marginTop: 10, marginBottom: 6 },
  nameplate: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.walnutDark, paddingHorizontal: 22, paddingVertical: 8, borderRadius: 4, borderWidth: 1.5, borderColor: COLORS.brass, gap: 10 },
  nameplateText: { color: COLORS.label, fontWeight: '700', fontSize: 15, letterSpacing: 3, fontFamily: 'serif' },
  nameplateRivet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.brass },
  rodWrap: { paddingTop: 14, paddingBottom: 14, paddingHorizontal: 15 },
  rod: { position: 'absolute', top: 4, left: 15, right: 15, height: 3, backgroundColor: COLORS.brass, borderRadius: 2, opacity: 0.9 },
  rodScroll: { paddingTop: 4 },
  tagWrap: { alignItems: 'center', marginRight: 14 },
  tagPeg: { width: 4, height: 10, backgroundColor: COLORS.brassDark },
  tagChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 3, backgroundColor: 'rgba(243,231,211,0.12)', borderWidth: 1, borderColor: 'rgba(201,162,39,0.5)' },
  tagChipActive: { backgroundColor: COLORS.label, borderColor: COLORS.label },
  tagText: { color: COLORS.labelSoft, fontWeight: '600', fontSize: 13 },
  tagTextActive: { color: COLORS.walnutDark },
  listContainer: { paddingHorizontal: 15, paddingBottom: 110 },
  shelfPlank: { height: 14, marginVertical: 6, borderTopWidth: 2, borderTopColor: 'rgba(0,0,0,0.35)', borderBottomWidth: 1, borderBottomColor: 'rgba(201,162,39,0.25)' },
  card: { flex: 1, margin: 7, alignItems: 'center' },
  hookWrap: { alignItems: 'center', height: 16, marginBottom: 2 },
  hookLine: { width: 2, height: 10, backgroundColor: COLORS.brassDark },
  hookCircle: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.brass, marginTop: -3 },
  shelfItemFrame: { backgroundColor: COLORS.label, padding: 7, paddingBottom: 22, borderRadius: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.45, shadowRadius: 6, elevation: 8 },
  clothingImage: { borderRadius: 1 },
  plaque: { position: 'absolute', bottom: 6, alignSelf: 'center', backgroundColor: COLORS.walnutDark, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 2, maxWidth: '85%' },
  plaqueText: { fontSize: 10, color: COLORS.brass, fontWeight: '600', letterSpacing: 1 },
  dirtyBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: COLORS.rust, padding: 7, borderRadius: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 4, borderWidth: 1.5, borderColor: COLORS.walnutDark },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyShelf: { width: 140, height: 3, backgroundColor: 'rgba(201,162,39,0.35)', marginBottom: 18, borderRadius: 2 },
  emptyTitle: { fontSize: 18, color: COLORS.label, fontWeight: '700', marginTop: 12, fontFamily: 'serif' },
  emptyText: { fontSize: 13, color: COLORS.labelSoft, marginTop: 6, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 66, height: 66, borderRadius: 33, backgroundColor: COLORS.walnutDark, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 10, borderWidth: 2, borderColor: COLORS.brass },
  fabInner: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.brass, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.brassDark },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.label, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, paddingBottom: 50 },
  sourceMenuContent: { backgroundColor: COLORS.label, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, paddingBottom: 50 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(62,36,21,0.25)', alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: COLORS.walnut, textAlign: 'center', marginBottom: 18, fontFamily: 'serif' },
  sourceBtn: { flexDirection: 'row', backgroundColor: COLORS.walnutDark, paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: COLORS.brass, gap: 10 },
  sourceBtnText: { color: COLORS.label, fontSize: 15, fontWeight: '700' },
  sourceBtnOutline: { flexDirection: 'row', backgroundColor: 'transparent', paddingVertical: 15, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.walnutDark, gap: 10 },
  sourceBtnTextDark: { color: COLORS.walnutDark, fontSize: 15, fontWeight: '700' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.walnut, fontFamily: 'serif' },
  modalImageFrame: { alignSelf: 'center', marginBottom: 18, padding: 6, backgroundColor: '#FFF', borderRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, elevation: 5 },
  modalImage: { width: 140, aspectRatio: 0.8, borderRadius: 2 },
  sectionLabel: { fontSize: 11, color: COLORS.brassDark, fontWeight: '700', letterSpacing: 2, marginBottom: 10, textAlign: 'center' },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 28 },
  categoryBtn: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 3, borderWidth: 1, borderColor: COLORS.oak, backgroundColor: '#FFF' },
  categoryBtnActive: { backgroundColor: COLORS.walnutDark, borderColor: COLORS.brass },
  categoryText: { color: COLORS.walnut, fontWeight: '600' },
  categoryTextActive: { color: COLORS.label },
  addCategoryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 3, borderWidth: 1, borderColor: COLORS.oak, backgroundColor: 'rgba(107,66,38,0.08)', borderStyle: 'dashed', gap: 4 },
  newCategoryInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 3, borderWidth: 1, borderColor: COLORS.walnutDark, paddingLeft: 12, paddingRight: 4, height: 40 },
  newCategoryInput: { flex: 1, minWidth: 80, color: COLORS.walnut },
  newCategoryCheck: { backgroundColor: COLORS.brass, borderRadius: 15, width: 26, height: 26, justifyContent: 'center', alignItems: 'center' },
  saveBtn: { backgroundColor: COLORS.walnutDark, paddingVertical: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.brass },
  saveBtnText: { color: COLORS.label, fontSize: 15, fontWeight: '700', letterSpacing: 1 },
});