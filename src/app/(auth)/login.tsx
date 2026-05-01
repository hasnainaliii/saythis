import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input } from "../../components";
import AuthHeader from "../../components/auth/AuthHeader";
import SocialLoginButtons from "../../components/auth/SocialLoginButtons";
import { DEV_CREDENTIALS, DEV_MODE_ENABLED } from "../../config/devCredentials";
import { parseApiError } from "../../hooks/useApiError";
import authService from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { colors, dynamicSpacingY, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import { showError, showSuccess } from "../../utils/toast";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      await login(data.user, data.access_token, data.refresh_token);
      showSuccess("Welcome Back!", `Logged in as ${data.user.full_name}`);
      router.replace("/");
    },
    onError: (err: any) => {
      const message = parseApiError(err, "Login failed. Please try again.");
      showError("Login Failed", message);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      showError("Missing Fields", "Please enter email and password");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const handleDevLogin = () => {
    setEmail(DEV_CREDENTIALS.email);
    setPassword(DEV_CREDENTIALS.password);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView behavior="height" style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <AuthHeader />

          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Sign In</Text>
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
              <Input
                label="Password"
                icon="lock-closed-outline"
                placeholder="Enter your password..."
                value={password}
                onChangeText={setPassword}
                isPassword
              />
              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={loginMutation.isPending}
                size="large"
                fullWidth
                icon={<Ionicons name="arrow-forward" size={20} color={colors.white} />}
                iconPosition="right"
                style={styles.signInButton}
              />
            </View>

            {DEV_MODE_ENABLED && (
              <Pressable style={styles.devModeContainer} onPress={handleDevLogin}>
                <Ionicons name="construct" size={14} color={colors.secondary} />
                <Text style={styles.devModeText}>Use Dev Access</Text>
              </Pressable>
            )}

            <SocialLoginButtons
              onPress={(p) => console.log("Social login:", p)}
              containerStyle={{ marginTop: dynamicSpacingY(4) }}
            />

            <View style={styles.footerContainer}>
              <View style={styles.signUpRow}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Pressable onPress={() => router.push("/(auth)/signup")}>
                  <Text style={styles.linkText}>Sign Up.</Text>
                </Pressable>
              </View>
              <Pressable onPress={() => router.push("/(auth)/forgot-password")}>
                <Text style={styles.forgotText}>Forgot Password</Text>
              </Pressable>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: spacingX.lg,
    paddingTop: dynamicSpacingY(3),
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
  form: {
    gap: dynamicSpacingY(2),
  },
  signInButton: {
    marginTop: spacingY.md,
  },
  devModeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacingX.xs,
    marginTop: dynamicSpacingY(2),
    paddingVertical: spacingY.sm,
  },
  devModeText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
  footerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingTop: spacingY.sm,
    paddingBottom: dynamicSpacingY(4),
    gap: spacingY.sm,
  },
  signUpRow: {
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
  forgotText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.secondary,
  },
});
