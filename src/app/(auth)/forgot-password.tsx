import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components";
import {
  colors,
  dynamicSpacingY,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../theme/Theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Forgot Password Screen
export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    // Simulation
    Alert.alert(
      "Reset Link Sent",
      `We have sent a password reset link to ${email}. Check your inbox!`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  const handleBackToLogin = () => {
    router.back();
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
          {/* Header with curved background */}
          <View style={styles.headerContainer}>
            <View style={styles.headerCurve} />
            <View style={styles.logoContainer}>
              <Image
                source={require("../../../assets/images/saythis-high-resolution-logo-transparent.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Don't worry! It happens. Please enter the address associated
                with your account.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={colors.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email..."
                    placeholderTextColor={colors.black_text}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <View style={styles.footerContainer}>
                <Button
                  title="Send Reset Link"
                  onPress={handleResetPassword}
                  size="large"
                  fullWidth
                />

                {/* Back Link */}
                <View style={styles.signInRow}>
                  <Text style={styles.footerText}>
                    Remember your password?{" "}
                  </Text>
                  <Text onPress={handleBackToLogin} style={styles.linkText}>
                    Log In
                  </Text>
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
  // Header
  headerContainer: {
    height: dynamicSpacingY(22), // Match Login
    position: "relative",
    overflow: "hidden",
  },
  headerCurve: {
    position: "absolute",
    top: 0,
    left: "-20%",
    width: "140%",
    height: "100%",
    backgroundColor: colors.secondary_20,
    borderBottomLeftRadius: SCREEN_WIDTH,
    borderBottomRightRadius: SCREEN_WIDTH,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: dynamicSpacingY(2),
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
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
  inputContainer: {
    gap: spacingY.xs,
  },
  inputLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.black,
    marginLeft: spacingX.xs,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary10,
    paddingHorizontal: spacingX.md,
    height: dynamicSpacingY(6.5),
  },
  inputIcon: {
    marginRight: spacingX.sm,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black,
    paddingVertical: 0,
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
