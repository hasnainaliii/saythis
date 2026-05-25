import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components";
import authService from "../../services/authService";
import { userService } from "../../services/userService";
import { useAuthStore } from "../../store/authStore";
import {
  colors,
  dynamicSpacingY,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../theme/Theme";
import { showError, showSuccess } from "../../utils/toast";

export default function VerifyEmailScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);

  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  const handleCheckVerification = async () => {
    setChecking(true);
    try {
      const freshUser = await userService.getProfile();
      await updateUser(freshUser);

      if (freshUser.email_verified_at) {
        showSuccess("Verified!", "Your email has been verified.");
        router.replace("/");
      } else {
        showError("Not Verified", "Please check your inbox and verify your email first.");
      }
    } catch {
      showError("Error", "Could not check verification status. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    try {
      await authService.resendVerificationEmail();
      showSuccess("Email Sent", "A new verification link has been sent to your inbox.");
    } catch {
      showError("Error", "Failed to resend email. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const maskedEmail = user?.email
    ? user.email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + b.replace(/./g, "•") + c)
    : "";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />

      {/* top-right logout */}
      <View style={styles.topBar}>
        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color={colors.textMuted} />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="mail-unread-outline" size={48} color={colors.white} />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>

        <Text style={styles.description}>
          We've sent a confirmation link to
        </Text>
        <Text style={styles.email}>{maskedEmail}</Text>
        <Text style={styles.description}>
          Please check your inbox and click the link to activate your account.
        </Text>

        <View style={styles.buttonGroup}>
          <Button
            title="I've Verified"
            onPress={handleCheckVerification}
            loading={checking}
            size="large"
            fullWidth
          />

          <Button
            title="Resend Email"
            onPress={handleResendEmail}
            loading={resending}
            variant="outline"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.xs,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  logoutText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.textMuted,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacingX.xl,
    paddingBottom: dynamicSpacingY(8),
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary_20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY.lg,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.textDark,
    marginBottom: spacingY.md,
    textAlign: "center",
  },
  description: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },
  email: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.textDark,
    marginVertical: spacingY.xs,
    textAlign: "center",
  },
  buttonGroup: {
    width: "100%",
    gap: spacingY.sm,
    marginTop: dynamicSpacingY(4),
  },
});
