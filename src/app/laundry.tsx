import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { responsive } from '../responsive';
import { useStore } from '../store';

const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const itemWidth = (screenWidth - 45) / numColumns;

const COLORS = {
  walnutDark: '#2A160D',
  walnut: '#3E2415',
  walnutMid: '#563020',
  oak: '#6B4226',
  brass: '#C9A227',
  brassDark: '#8C6D1F',
  label: '#F3E7D3',
  labelSoft: '#E4D3B4',
  water: '#4A6D7C',
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

export default function LaundryScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const numColumns = responsive.isTablet ? 3 : responsive.isLargeTablet ? 4 : 2;
  const itemWidth = responsive.getItemWidth(numColumns);

  const clothes = useStore((state) => state.clothes);
  const markAsClean = useStore((state) => state.markAsClean);

  const dirtyClothes = clothes.filter((item: { isDirty: boolean }) => item.isDirty);

  const renderItem = ({ item, index }: { item: { id: string; uri: string; category: string; isDirty: boolean }; index: number }) => {
    const rotation = index % 2 === 0 ? '-2deg' : '3deg';

    return (
      <View style={[styles.card, { transform: [{ rotate: rotation }] }]}>
        <View style={styles.shelfItemFrame}>
          <Image
            source={{ uri: item.uri }}
            style={[styles.clothingImage, { width: itemWidth - responsive.scaleSpacing(20), height: (itemWidth - responsive.scaleSpacing(20)) * 1.25 }]}
            contentFit="cover"
          />
          <View style={styles.plaque}>
            <Text style={styles.plaqueText} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.washBtn} onPress={() => markAsClean(item.id)} activeOpacity={0.8}>
          <Ionicons name="water" size={16} color={COLORS.label} />
          <Text style={styles.washBtnText}>{t('wash')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <WoodBackdrop />

      <View style={[styles.safeAreaWrapper, { paddingTop: insets.top }]}>
        <View style={styles.nameplateWrap}>
          <View style={styles.nameplate}>
            <View style={styles.nameplateRivet} />
            <Text style={styles.nameplateText}>{t('laundry')}</Text>
            <View style={styles.nameplateRivet} />
          </View>
          <Text style={styles.subtitle}>
            {dirtyClothes.length} {t('waitingPieces')}
          </Text>
        </View>

        {dirtyClothes.length > 0 ? (
          <FlatList
            data={dirtyClothes}
            keyExtractor={(item: { id: string }) => item.id}
            renderItem={renderItem}
            numColumns={numColumns}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="sparkles-outline" size={54} color={COLORS.labelSoft} />
            <Text style={styles.emptyTitle}>{t('emptyLaundry')}</Text>
            <Text style={styles.emptyText}>{t('emptyLaundryText')}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.walnut },
  safeAreaWrapper: { flex: 1 },
  grainLine: { position: 'absolute', left: 0, right: 0, backgroundColor: COLORS.walnutDark },
  nameplateWrap: {
    alignItems: 'center',
    marginTop: responsive.scaleSpacing(10),
    marginBottom: responsive.scaleSpacing(20),
  },
  nameplate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.walnutDark,
    paddingHorizontal: responsive.scaleSpacing(22),
    paddingVertical: responsive.scaleSpacing(8),
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.brass,
    gap: responsive.scaleSpacing(10),
  },
  nameplateText: {
    color: COLORS.label,
    fontWeight: '700',
    fontSize: responsive.scaleFont(15),
    letterSpacing: 3,
    fontFamily: 'serif',
  },
  nameplateRivet: {
    width: responsive.scaleSpacing(6),
    height: responsive.scaleSpacing(6),
    borderRadius: responsive.scaleSpacing(3),
    backgroundColor: COLORS.brass,
  },
  subtitle: { fontSize: responsive.scaleFont(13), color: COLORS.labelSoft, marginTop: responsive.scaleSpacing(10), fontFamily: 'serif', fontStyle: 'italic' },
  listContainer: { paddingHorizontal: responsive.scaleSpacing(15), paddingBottom: responsive.scaleSpacing(110), paddingTop: responsive.scaleSpacing(10) },
  card: {
    flex: 1,
    margin: responsive.scaleSpacing(10),
    alignItems: 'center',
  },
  shelfItemFrame: {
    backgroundColor: '#EFEBE9',
    padding: responsive.scaleSpacing(7),
    paddingBottom: responsive.scaleSpacing(22),
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  clothingImage: {
    borderRadius: 1,
    opacity: 0.75,
  },
  plaque: {
    position: 'absolute',
    bottom: responsive.scaleSpacing(6),
    alignSelf: 'center',
    backgroundColor: COLORS.walnutDark,
    paddingHorizontal: responsive.scaleSpacing(10),
    paddingVertical: responsive.scaleSpacing(2),
    borderRadius: 2,
    maxWidth: '85%',
  },
  plaqueText: { fontSize: responsive.scaleFont(10), color: COLORS.brass, fontWeight: '600', letterSpacing: 1 },
  washBtn: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: COLORS.water,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.scaleSpacing(15),
    paddingVertical: responsive.scaleSpacing(8),
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.walnutDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    elevation: 6,
  },
  washBtnText: { color: COLORS.label, fontWeight: '700', letterSpacing: 1, marginLeft: responsive.scaleSpacing(6), fontSize: responsive.scaleFont(11) },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: responsive.scaleSpacing(40), marginTop: -50 },
  emptyTitle: { fontSize: responsive.scaleFont(18), color: COLORS.label, fontWeight: '700', marginTop: responsive.scaleSpacing(16), fontFamily: 'serif' },
  emptyText: { fontSize: responsive.scaleFont(13), color: COLORS.labelSoft, marginTop: responsive.scaleSpacing(6), textAlign: 'center' },
});