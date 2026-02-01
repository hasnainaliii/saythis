import { Image } from "expo-image";
import { Download, FileText, Settings, User, Zap } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, ProfileMenuItem } from "../../../components";
import { useAuthStore } from "../../../store/authStore";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../../theme/Theme";

export default function ProfileScreen() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handlePress = (item: string) => {
    console.log(`Pressed ${item}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image
                source="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80"
                style={styles.avatar}
                contentFit="cover"
                transition={1000}
              />
            </View>
            <Text style={styles.name}>{user?.full_name || "User Name"}</Text>
            <Text style={styles.handle}>{user?.email || "@username"}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>Pro Member</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.menuContainer}>
            <ProfileMenuItem
              icon={User}
              title="Edit Profile"
              onPress={() => handlePress("Edit Profile")}
            />
            <ProfileMenuItem
              icon={Zap}
              title="Subscription"
              onPress={() => handlePress("Subscription")}
            />
            <ProfileMenuItem
              icon={Download}
              title="Downloads"
              onPress={() => handlePress("Downloads")}
            />
            <ProfileMenuItem
              icon={FileText}
              title="Reports"
              onPress={() => handlePress("Reports")}
            />
            <ProfileMenuItem
              icon={Settings}
              title="App Settings"
              onPress={() => handlePress("App Settings")}
            />
          </View>

          <View style={styles.logoutContainer}>
            <Button
              title="Logout"
              onPress={logout}
              variant="outline"
              style={styles.logoutButton}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: colors.secondary_20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: spacingY.xl + 40,
    paddingBottom: spacingY.xl,
    alignItems: "center",
    marginBottom: spacingY.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerContent: {
    alignItems: "center",
  },
  content: {
    padding: spacingX.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.primary,
    marginBottom: spacingY.sm,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  name: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    marginBottom: spacingY.xxs,
  },
  handle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    marginBottom: spacingY.sm,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingX.xs,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
  menuContainer: {
    marginBottom: spacingY.sm,
  },
  logoutContainer: {
    // marginTop: spacingY.md,
  },
  logoutButton: {
    color: "#fff",
    backgroundColor: colors.white,
  },
});
