import { Tabs } from "expo-router";
import { BookOpen, Home, Stethoscope, User } from "lucide-react-native";
import { colors, FONTS } from "../../../theme/Theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 0,
          height: 80, // Increased height
          paddingBottom: 20, // Added padding for text
          paddingTop: 10,
          borderTopLeftRadius: 24, // Rounded top corners
          borderTopRightRadius: 24,
          position: "absolute", // Needed for radius to show if background is behind
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.primary20,
        tabBarLabelStyle: {
          fontFamily: FONTS.primary,
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="therapy"
        options={{
          title: "Therapy",
          tabBarIcon: ({ color, size }) => (
            <Stethoscope size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
