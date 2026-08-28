import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 80) / numColumns;

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
  dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
  dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = 'fr';

const COLORS = {
  walnutDark: '#2A160D',
  walnut: '#3E2415',
  walnutMid: '#563020',
  oak: '#6B4226',
  brass: '#C9A227',
  brassDark: '#8C6D1F',
  label: '#FDFBF7',
  labelSoft: '#E4D3B4',
  rust: '#A63D2F',
};

function WoodBackdrop() {
  const grainLines = [0.06, 0.18, 0.24, 0.37, 0.5, 0.55, 0.68, 0.74, 0.86, 0.93];
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={[COLORS.oak, COLORS.walnutMid, COLORS.walnut, COLORS.walnutDark]} locations={[0, 0.35, 0.7, 1]} style={StyleSheet.absoluteFill} />
      {grainLines.map((top, i) => (
        <View key={i} style={[styles.grainLine, { top: `${top * 100}%`, opacity: i % 2 === 0 ? 0.08 : 0.05, height: i % 3 === 0 ? 1.5 : 1 }]} />
      ))}
    </View>
  );
}

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [isModalVisible, setModalVisible] = useState(false);

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

  const renderSelectionItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      addOutfitToDate(selectedDate, item);
      setModalVisible(false);
    }}>
      <View style={styles.shelfItemFrameModal}>
        <Image source={{ uri: item.uri }} style={[styles.clothingImageModal, { width: itemWidth, height: itemWidth * 1.25 }]} contentFit="cover" />
        <View style={styles.plaque}>
          <Text style={styles.plaqueText} numberOfLines={1}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <WoodBackdrop />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 110 }}>
        
        <View style={styles.nameplateWrap}>
          <View style={styles.nameplate}>
            <View style={styles.nameplateRivet} />
            <Text style={styles.nameplateText}>AGENDA</Text>
            <View style={styles.nameplateRivet} />
          </View>
        </View>

        <View style={styles.calendarPaper}>
          <Calendar
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              ...Object.keys(plannedOutfits).reduce((acc, date) => {
                if (plannedOutfits[date].length > 0) acc[date] = { marked: true, dotColor: COLORS.rust };
                return acc;
              }, {}),
              [selectedDate]: { selected: true, disableTouchEvent: true },
            }}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: COLORS.walnutMid,
              selectedDayBackgroundColor: COLORS.walnutDark,
              selectedDayTextColor: COLORS.brass,
              todayTextColor: COLORS.rust,
              dayTextColor: COLORS.walnutDark,
              textDisabledColor: 'rgba(62, 36, 21, 0.25)',
              arrowColor: COLORS.walnutDark,
              monthTextColor: COLORS.walnutDark,
              textDayFontWeight: '600',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '700',
              textMonthFontFamily: 'serif',
            }}
          />
        </View>

        <View style={styles.outfitSection}>
          <View style={styles.dateRibbon}>
            <Text style={styles.dateRibbonText}>{formatDateForDisplay(selectedDate)}</Text>
          </View>

          {outfitOfTheDay.length > 0 ? (
            <View>
              <View style={styles.outfitGrid}>
                {outfitOfTheDay.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <View style={styles.hookWrap}>
                      <View style={styles.hookLine} />
                      <View style={styles.hookCircle} />
                    </View>
                    <View style={styles.shelfItemFrame}>
                      <Image source={{ uri: item.uri }} style={styles.clothingImage} contentFit="cover" />
                      <View style={styles.plaque}>
                        <Text style={styles.plaqueText} numberOfLines={1}>{item.category}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeOutfitFromDate(selectedDate, item.id)}>
                      <Ionicons name="close" size={16} color={COLORS.label} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={20} color={COLORS.brass} />
                <Text style={styles.addBtnText}>Ajouter une pièce</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyShelf} />
              <Ionicons name="calendar-outline" size={48} color={COLORS.labelSoft} />
              <Text style={styles.emptyTitle}>Rien de prévu</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={20} color={COLORS.brass} />
                <Text style={styles.addBtnText}>Planifier une tenue</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir une pièce</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={COLORS.brassDark} />
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
              <Text style={styles.emptyTextModal}>Votre armoire est vide. Ajoutez d'abord des vêtements !</Text>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.walnut },
  grainLine: { position: 'absolute', left: 0, right: 0, backgroundColor: COLORS.walnutDark },
  nameplateWrap: { alignItems: 'center', marginTop: 10, marginBottom: 15 },
  nameplate: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.walnutDark, paddingHorizontal: 22, paddingVertical: 8, borderRadius: 4, borderWidth: 1.5, borderColor: COLORS.brass, gap: 10 },
  nameplateText: { color: COLORS.label, fontWeight: '700', fontSize: 15, letterSpacing: 3, fontFamily: 'serif' },
  nameplateRivet: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.brass },
  calendarPaper: { marginHorizontal: 15, backgroundColor: COLORS.label, borderRadius: 8, paddingBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 12, borderWidth: 1, borderColor: '#D7CCC8' },
  outfitSection: { padding: 25, marginTop: 10 },
  dateRibbon: { alignSelf: 'center', backgroundColor: COLORS.walnutDark, paddingHorizontal: 20, paddingVertical: 6, borderRadius: 2, borderWidth: 1, borderColor: COLORS.brass, marginBottom: 25 },
  dateRibbonText: { color: COLORS.labelSoft, fontFamily: 'serif', fontWeight: 'bold', textTransform: 'capitalize', letterSpacing: 1 },
  outfitGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: { width: '45%', margin: 5, alignItems: 'center' },
  hookWrap: { alignItems: 'center', height: 16, marginBottom: 2 },
  hookLine: { width: 2, height: 10, backgroundColor: COLORS.brassDark },
  hookCircle: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: COLORS.brass, marginTop: -3 },
  shelfItemFrame: { backgroundColor: COLORS.label, padding: 7, paddingBottom: 22, borderRadius: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.45, shadowRadius: 6, elevation: 8 },
  clothingImage: { width: 120, aspectRatio: 0.8, borderRadius: 1 },
  plaque: { position: 'absolute', bottom: 6, alignSelf: 'center', backgroundColor: COLORS.walnutDark, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 2, maxWidth: '85%' },
  plaqueText: { fontSize: 10, color: COLORS.brass, fontWeight: '600', letterSpacing: 1 },
  removeBtn: { position: 'absolute', top: -6, right: 6, backgroundColor: COLORS.rust, padding: 4, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, elevation: 4, borderWidth: 1.5, borderColor: COLORS.walnutDark },
  addBtn: { backgroundColor: COLORS.walnutDark, paddingVertical: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25, borderWidth: 1, borderColor: COLORS.brass, elevation: 3 },
  addBtnText: { color: COLORS.label, fontSize: 15, fontWeight: '700', marginLeft: 10, letterSpacing: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  emptyShelf: { width: 140, height: 3, backgroundColor: 'rgba(201,162,39,0.35)', marginBottom: 18, borderRadius: 2 },
  emptyTitle: { fontSize: 18, color: COLORS.label, fontWeight: '700', marginTop: 12, fontFamily: 'serif' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.labelSoft, height: '80%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 20 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(62,36,21,0.25)', alignSelf: 'center', marginBottom: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.walnut, fontFamily: 'serif' },
  shelfItemFrameModal: { backgroundColor: '#FFF', padding: 5, paddingBottom: 22, borderRadius: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, elevation: 5 },
  clothingImageModal: { borderRadius: 1 },
  emptyTextModal: { textAlign: 'center', marginTop: 40, color: COLORS.walnutMid, fontStyle: 'italic' }
});