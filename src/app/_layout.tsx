import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

const COLORS = {
  walnutDark: '#2A160D',
  brass: '#C9A227',
  brassDark: '#8C6D1F',
};

export default function TabLayout() {
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
          height: 75,
          paddingBottom: 12,
          paddingTop: 12,
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.6,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 11,
          letterSpacing: 1.5,
          marginTop: 4,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ARMOIRE',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'shirt' : 'shirt-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'AGENDA',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="laundry"
        options={{
          title: 'PANIER',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'basket' : 'basket-outline'} size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}