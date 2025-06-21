import { Tabs } from 'expo-router';
import { MessageSquare, BookOpen, Info } from 'lucide-react-native';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.secondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView
              tint="light"
              intensity={95}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(255, 255, 255, 0.95)' },
              ]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[styles.iconWrapper, focused && styles.activeIconWrapper]}
            >
              <MessageSquare
                size={size - 2}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[styles.iconWrapper, focused && styles.activeIconWrapper]}
            >
              <BookOpen
                size={size - 2}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 0,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginTop: 2,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 2,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(0, 112, 240, 0.1)',
  },
});
