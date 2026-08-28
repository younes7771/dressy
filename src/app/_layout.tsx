import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Design premium de la barre de navigation
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#A0A0A0',
        headerShown: false, // Cache le titre en haut de l'écran
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: -3 },
          height: 80,
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        }
      }}
    >
      {/* Onglet 1 : L'armoire (index.tsx) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Armoire',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}></Text>,
        }}
      />
      
      {/* Onglet 2 : Le Calendrier (calendar.tsx) */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendrier',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}></Text>,
        }}
      />

      {/* Onglet 3 : Le Linge (laundry.tsx) */}
      <Tabs.Screen
        name="laundry"
        options={{
          title: 'Linge',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}></Text>,
        }}
      />
    </Tabs>
  );
}