import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Pressable,
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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    // Implement sign up logic
    console.log("Sign Up:", { name, email, password });
  };

  const handleSignIn = () => {
    router.back();
  };

  const handleSocialLogin = (provider: "facebook" | "google" | "instagram") => {
    console.log("Social login:", provider);
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join SayThis Community</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={colors.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name..."
                    placeholderTextColor={colors.black_text}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>

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

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password..."
                    placeholderTextColor={colors.black_text}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={colors.black_text}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={colors.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password..."
                    placeholderTextColor={colors.black_text}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color={colors.black_text}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Sign Up Button */}
              <Button
                title="Sign Up"
                onPress={handleSignUp}
                size="large"
                fullWidth
                style={styles.signUpButton}
              />
            </View>

            {/* Social Login */}
            <View style={styles.socialContainer}>
              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("facebook")}
              >
                <Ionicons name="logo-facebook" size={24} color={colors.black} />
              </Pressable>
              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("google")}
              >
                <Ionicons name="logo-google" size={24} color={colors.black} />
              </Pressable>
              <Pressable
                style={styles.socialButton}
                onPress={() => handleSocialLogin("instagram")}
              >
                <Ionicons
                  name="logo-instagram"
                  size={24}
                  color={colors.black}
                />
              </Pressable>
            </View>

            {/* Footer Links */}
            <View style={styles.footerContainer}>
              <View style={styles.signInRow}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Pressable onPress={handleSignIn}>
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
  // Header
  headerContainer: {
    height: dynamicSpacingY(22), // Increased height for better proportions
    position: "relative",
    overflow: "hidden", // Ensure the curve doesn't bleed out
  },
  headerCurve: {
    position: "absolute",
    top: 0,
    left: "-20%", // Center the 140% width
    width: "140%", // Make it wider than screen for gentle arc
    height: "100%",
    backgroundColor: colors.secondary_20,
    borderBottomLeftRadius: SCREEN_WIDTH, // Large radius for gentle curve
    borderBottomRightRadius: SCREEN_WIDTH,
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: dynamicSpacingY(2), // Move logo up slightly
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  // Content
  content: {
    flex: 1,
    paddingHorizontal: spacingX.lg,
    paddingTop: dynamicSpacingY(2),
  },
  // Title
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
  // Form
  form: {
    gap: dynamicSpacingY(2),
  },
  inputContainer: {
    gap: spacingY.xs,
  },
  inputLabel: {
    fontFamily: FONTS.primary,
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
  eyeIcon: {
    padding: spacingX.xs,
  },
  signUpButton: {
    marginTop: spacingY.md,
  },
  // Social
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacingX.md,
    marginTop: dynamicSpacingY(3),
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary10,
  },
  // Footer
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
