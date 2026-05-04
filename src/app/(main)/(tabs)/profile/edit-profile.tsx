import { Image } from "expo-image";
import { Pencil } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, ScreenHeader } from "../../../../components";
import { useAuthStore } from "../../../../store/authStore";
import {
    colors,
    dynamicSpacingY,
    FONTS,
    fontSizes,
    spacingX,
    spacingY
} from "../../../../theme/Theme";

const avatarSize = dynamicSpacingY(14);
const editBadgeSize = dynamicSpacingY(4.2);

const avatarUrl =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80";

export default function EditProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const [name, setName] = useState(user?.full_name ?? "");

  const handlePhotoPress = () => {
    console.log("Select profile photo");
  };

  const handleSave = () => {
    console.log("Save profile changes");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Edit Profile" />

        <View style={styles.avatarSection}>
          <Pressable
            style={styles.avatarWrapper}
            onPress={handlePhotoPress}
            accessibilityRole="button"
          >
            <Image
              source={avatarUrl}
              style={styles.avatar}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.pencilBadge}>
              <Pencil size={fontSizes.medium} color={colors.white} />
            </View>
          </Pressable>
          <Text style={styles.helperText}>Tap to change photo</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="User Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <Button
            title="Save Changes"
            onPress={handleSave}
            size="large"
            fullWidth
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
    paddingHorizontal: spacingX.lg,
    paddingBottom: spacingY.xxl,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacingY.lg,
  },
  avatarWrapper: {
    width: avatarSize,
    height: avatarSize,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: avatarSize / 2,
    borderWidth: 4,
    borderColor: colors.primary,
  },
  pencilBadge: {
    position: "absolute",
    width: editBadgeSize,
    height: editBadgeSize,
    borderRadius: editBadgeSize / 2,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    bottom: spacingY.xxs,
    right: spacingX.xxs,
  },
  helperText: {
    marginTop: spacingY.xs,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  form: {
    gap: spacingY.md,
  },
});
