import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useStore } from '../store'; // Connexion au store global !

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 80) / numColumns; // Plus petit pour la modale

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

export default function CalendarScreen() {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalVisible, setModalVisible] = useState(false);

  // Récupération des données globales
  const clothes = useStore(state => state.clothes);
  const plannedOutfits = useStore(state => state.plannedOutfits);
  const addOutfitToDate = useStore(state => state.addOutfitToDate);
  const removeOutfitFromDate = useStore(state => state.removeOutfitFromDate);

  const outfitOfTheDay = plannedOutfits[selectedDate] || [];

  const formatDateForDisplay = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
  };

  // Rendu d'un vêtement dans la modale de sélection
  const renderSelectionItem = ({ item }) => (
    <TouchableOpacity style={styles.selectionCard} onPress={() => {
      addOutfitToDate(selectedDate, item);
      setModalVisible(false);
    }}>
      <Image source={{ uri: item.uri }} style={styles.selectionImage} contentFit="cover" />
      <View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            ...Object.keys(plannedOutfits).reduce((acc, date) => {
              if (plannedOutfits[date].length > 0) acc[date] = { marked: true, dotColor: '#000' };
              return acc;
            }, {}),
            [selectedDate]: { selected: true, disableTouchEvent: true },
          }}
          theme={{
            backgroundColor: '#ffffff', calendarBackground: '#ffffff',
            selectedDayBackgroundColor: '#000000', selectedDayTextColor: '#ffffff',
            todayTextColor: '#000000', arrowColor: '#000000'
          }}
        />
      </View>

      <View style={styles.outfitSection}>
        <Text style={styles.outfitTitle}>Tenue du {formatDateForDisplay(selectedDate)}</Text>

        {outfitOfTheDay.length > 0 ? (
          <View>
            <View style={styles.outfitGrid}>
              {outfitOfTheDay.map((item) => (
                <View key={item.id} style={styles.outfitCard}>
                  <Image source={{ uri: item.uri }} style={styles.clothingImage} contentFit="cover" />
                  
                  {/* Bouton pour retirer le vêtement de cette date */}
                  <TouchableOpacity 
                    style={styles.removeBtn} 
                    onPress={() => removeOutfitFromDate(selectedDate, item.id)}>
                    <Ionicons name="close-circle" size={24} color="#FFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setModalVisible(true)}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.editBtnText}>Ajouter une pièce</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="shirt-outline" size={40} color="#A0A0A0" />
            </View>
            <Text style={styles.emptyText}>Aucune tenue prévue.</Text>
            <TouchableOpacity style={styles.createBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.createBtnText}>Planifier une tenue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Modale pour choisir un vêtement dans l'armoire */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir une pièce</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color="#A0A0A0" />
              </TouchableOpacity>
            </View>

            {clothes.length > 0 ? (
              <FlatList
                data={clothes}
                keyExtractor={(item) => item.id}
                renderItem={renderSelectionItem}
                numColumns={numColumns}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.emptyText}>Votre armoire est vide. Ajoutez d'abord des vêtements !</Text>
            )}
          </View>
        </View>
      </Modal>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  calendarContainer: { backgroundColor: '#FFF', paddingBottom: 15, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5, zIndex: 10 },
  outfitSection: { padding: 25 },
  outfitTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 20, textTransform: 'capitalize' },
  outfitGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  outfitCard: { width: '48%', backgroundColor: '#FFF', borderRadius: 15, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3, overflow: 'hidden' },
  clothingImage: { width: '100%', height: 200 },
  removeBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12 },
  editBtn: { backgroundColor: '#000', width: '100%', paddingVertical: 15, borderRadius: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  editBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#EAEAEA', borderStyle: 'dashed' },
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  emptyText: { fontSize: 16, color: '#A0A0A0', marginBottom: 20, textAlign: 'center' },
  createBtn: { backgroundColor: '#000', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  createBtnText: { color: '#FFF', fontWeight: 'bold' },
  
  // Styles Modale
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', height: '80%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  selectionCard: { flex: 1, margin: 5, backgroundColor: '#FFF', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#EAEAEA' },
  selectionImage: { width: '100%', height: itemWidth * 1.25 },
  badge: { position: 'absolute', bottom: 5, left: 5, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: 'bold', color: '#333' }
});