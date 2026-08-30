import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import '../i18n';

const COLORS = {
  walnutDark: '#2A160D',
  brass: '#C9A227',
  brassDark: '#8C6D1F',
};

export default function TabLayout() {
  const { t } = useI18nTranslation();
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallDevice = width < 375;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brass,
        tabBarInactiveTintColor: 'rgba(228, 211, 180, 0.4)',
        tabBarStyle: {
          backgroundColor: COLORS.walnutDark,
          borderTopWidth: 2,
          borderTopColor: COLORS.brassDark,
          height: isTablet ? 85 : isSmallDevice ? 65 : 75,
          paddingBottom: isTablet ? 15 : isSmallDevice ? 8 : 12,
          paddingTop: isTablet ? 15 : isSmallDevice ? 8 : 12,
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.6,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: isTablet ? 14 : isSmallDevice ? 9 : 11,
          letterSpacing: isTablet ? 2 : isSmallDevice ? 1 : 1.5,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: isSmallDevice ? -3 : 0,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('wardrobe'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'shirt' : 'shirt-outline'} 
              size={isTablet ? 32 : isSmallDevice ? 22 : 26} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('calendar'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'calendar' : 'calendar-outline'} 
              size={isTablet ? 32 : isSmallDevice ? 22 : 26} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="laundry"
        options={{
          title: t('laundry'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'basket' : 'basket-outline'} 
              size={isTablet ? 32 : isSmallDevice ? 22 : 26} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}