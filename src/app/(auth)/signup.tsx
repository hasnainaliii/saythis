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
import AuthHeader from "../../components/auth/AuthHeader";
import SocialLoginButtons from "../../components/auth/SocialLoginButtons";
import { Button, Input } from "../../components";
import { parseApiError } from "../../hooks/useApiError";
import authService from "../../services/authService";
import { colors, dynamicSpacingY, FONTS, fontSizes, spacingX, spacingY } from "../../theme/Theme";
import { showError, showSuccess } from "../../utils/toast";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      showSuccess("Account Created", "Your account has been created. Please log in.");
      router.push("/(auth)/login");
    },
    onError: (err: any) => {
      const message = parseApiError(err, "Registration failed. Please try again.");
      showError("Registration Failed", message);
    },
  });

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      showError("Missing Fields", "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      showError("Password Mismatch", "Passwords do not match");
      return;
    }
    if (password.length < 8) {
      showError("Weak Password", "Password must be at least 8 characters");
      return;
    }
    registerMutation.mutate({ email, full_name: name, password });
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
          <AuthHeader logoSize={80} />

          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join SayThis Community</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Full Name"
                icon="person-outline"
                placeholder="Enter your full name..."
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
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
                placeholder="Create a password..."
                value={password}
                onChangeText={setPassword}
                isPassword
              />
              <Input
                label="Confirm Password"
                icon="lock-closed-outline"
                placeholder="Confirm your password..."
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
              />
              <Button
                title="Sign Up"
                onPress={handleSignUp}
                loading={registerMutation.isPending}
                size="large"
                fullWidth
                style={styles.signUpButton}
              />
            </View>

            <SocialLoginButtons
              onPress={(p) => console.log("Social login:", p)}
              containerStyle={{ marginTop: dynamicSpacingY(3) }}
            />

            <View style={styles.footerContainer}>
              <View style={styles.signInRow}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Pressable onPress={() => router.back()}>
                  <Text style={styles.linkText}>Sign In.</Text>
                </Pressable>
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
    paddingTop: dynamicSpacingY(2),
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: dynamicSpacingY(3),
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  subtitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.medium,
    color: colors.black,
  },
  form: {
    gap: dynamicSpacingY(2),
  },
  signUpButton: {
    marginTop: spacingY.md,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: dynamicSpacingY(3),
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
