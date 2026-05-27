import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FileText, Settings, User } from "lucide-react-native";
import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, ProfileMenuItem } from "../../../../components";
import { useAuthStore } from "../../../../store/authStore";
import { userService } from "../../../../services/userService";
import {
    colors,
    dynamicSpacingY,
    FONTS,
    fontSizes,
    spacingX,
    spacingY,
} from "../../../../theme/Theme";
import { showError, showSuccess } from "../../../../utils/toast";

const avatarSize = dynamicSpacingY(14);
const headerRadius = dynamicSpacingY(5);
const headerTopPadding = dynamicSpacingY(7);

const DEFAULT_AVATAR = require("../../../../../assets/images/icon.png");

export default function ProfileScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const handlePress = (item: string) => {
    if (item === "Edit Profile") {
      router.push("/(main)/(tabs)/profile/edit-profile");
      return;
    }
    if (item === "Reports") {
      router.push("/(main)/(tabs)/profile/reports");
      return;
    }
    if (item === "App Settings") {
      router.push("/(main)/(tabs)/profile/settings");
      return;
    }
    console.log(`Pressed ${item}`);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await userService.deleteAccount();
              await logout();
              showSuccess("Account Deleted", "Your account has been deleted.");
            } catch {
              showError("Error", "Failed to delete account. Please try again.");
            }
          },
        },
      ],
    );
  };

  const avatarSource = user?.avatar_url
    ? { uri: user.avatar_url }
    : DEFAULT_AVATAR;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={avatarSource}
                style={styles.avatar}
                contentFit="cover"
                transition={1000}
              />
            </View>
            <Text style={styles.name}>{user?.full_name || "User Name"}</Text>
            <Text style={styles.handle}>{user?.email || "@username"}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {user?.role === "admin" ? "Admin" : "Member"}
              </Text>
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

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    paddingBottom: spacingY.xxl,
  },
  headerContainer: {
    backgroundColor: colors.secondary_20,
    borderBottomLeftRadius: headerRadius,
    borderBottomRightRadius: headerRadius,
    paddingTop: headerTopPadding,
    paddingBottom: spacingY.xl,
    alignItems: "center",
    marginBottom: spacingY.md,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: spacingY.xs,
    },
    shadowOpacity: 0.05,
    shadowRadius: spacingY.md,
    elevation: 2,
  },
  headerContent: {
    alignItems: "center",
  },
  content: {
    padding: spacingX.lg,
  },
  avatarContainer: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    borderWidth: spacingX.xxs,
    borderColor: colors.primary,
    marginBottom: spacingY.sm,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: avatarSize / 2,
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
    borderRadius: spacingY.lg,
  },
  badgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
  menuContainer: {
    marginBottom: spacingY.sm,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    borderColor: colors.border,
  },
});
