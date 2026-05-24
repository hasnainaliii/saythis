import { Image } from "expo-image";
import { useMutation } from "@tanstack/react-query";
import { Pencil } from "lucide-react-native";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, ScreenHeader } from "../../../../components";
import { useAuthStore } from "../../../../store/authStore";
import { userService } from "../../../../services/userService";
import { parseApiError } from "../../../../hooks/useApiError";
import {
    colors,
    dynamicSpacingY,
    FONTS,
    fontSizes,
    spacingX,
    spacingY
} from "../../../../theme/Theme";
import { showError, showSuccess } from "../../../../utils/toast";

const avatarSize = dynamicSpacingY(14);
const editBadgeSize = dynamicSpacingY(4.2);

const DEFAULT_AVATAR = require("../../../../../assets/images/icon.png");

export default function EditProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [name, setName] = useState(user?.full_name ?? "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const avatarSource = user?.avatar_url
    ? { uri: user.avatar_url }
    : DEFAULT_AVATAR;

  const updateProfileMutation = useMutation({
    mutationFn: (fullName: string) => userService.updateProfile(fullName),
    onSuccess: async (updatedUser) => {
      await updateUser(updatedUser);
      showSuccess("Profile Updated", "Your name has been updated.");
    },
    onError: (err: any) => {
      const message = parseApiError(err, "Failed to update profile.");
      showError("Update Failed", message);
    },
  });

  const handlePhotoPress = async () => {
    try {
      setIsUploadingAvatar(true);
      const imageResult = await userService.pickImage();
      const updatedUser = await userService.uploadAvatar(imageResult);
      if (updatedUser) {
        await updateUser(updatedUser);
        showSuccess("Avatar Updated", "Your profile photo has been changed.");
      }
    } catch (error: any) {
      if (error.message === "Permission to access photos was denied") {
        showError("Permission Denied", "Please allow access to your photos in Settings.");
      } else {
        showError("Upload Failed", error.message || "Failed to upload avatar.");
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      showError("Invalid Name", "Name cannot be empty.");
      return;
    }
    if (trimmedName.length < 3 || trimmedName.length > 100) {
      showError("Invalid Name", "Name must be between 3 and 100 characters.");
      return;
    }
    if (trimmedName === user?.full_name) {
      showSuccess("No Changes", "Your name is already up to date.");
      return;
    }
    updateProfileMutation.mutate(trimmedName);
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
            disabled={isUploadingAvatar}
          >
            <Image
              source={avatarSource}
              style={styles.avatar}
              contentFit="cover"
              transition={300}
            />
            <View style={styles.pencilBadge}>
              {isUploadingAvatar ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Pencil size={fontSizes.medium} color={colors.white} />
              )}
            </View>
          </Pressable>
          <Text style={styles.helperText}>
            {isUploadingAvatar ? "Uploading..." : "Tap to change photo"}
          </Text>
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
            loading={updateProfileMutation.isPending}
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
