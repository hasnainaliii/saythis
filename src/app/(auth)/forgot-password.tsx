import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthHeader from "../../components/auth/AuthHeader";
import { Button, Input } from "../../components";
import { parseApiError } from "../../hooks/useApiError";
import authService from "../../services/authService";
import { colors, dynamicSpacingY, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import { showError, showSuccess } from "../../utils/toast";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      showSuccess(
        "Reset Link Sent",
        "If an account with that email exists, a password reset link has been sent.",
      );
    },
    onError: (err: any) => {
      const message = parseApiError(err, "Something went wrong. Please try again.");
      showError("Error", message);
    },
  });

  const handleResetPassword = () => {
    if (!email) {
      showError("Missing Email", "Please enter your email address.");
      return;
    }
    forgotPasswordMutation.mutate(email.toLowerCase().trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <AuthHeader />

          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Don't worry! It happens. Please enter the address associated
                with your account.
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Email Address"
                icon="mail-outline"
                placeholder="Enter your email..."
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <View style={styles.footerContainer}>
                <Button
                  title="Send Reset Link"
                  onPress={handleResetPassword}
                  loading={forgotPasswordMutation.isPending}
                  size="large"
                  fullWidth
                />
                <View style={styles.signInRow}>
                  <Text style={styles.footerText}>Remember your password? </Text>
                  <Pressable onPress={() => router.back()}>
                    <Text style={styles.linkText}>Log In</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacingY.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.xxl,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: dynamicSpacingY(4),
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    gap: spacingY.md,
  },
  footerContainer: {
    marginTop: dynamicSpacingY(4),
    alignItems: "center",
    gap: spacingY.md,
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
  },
  linkText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
});
