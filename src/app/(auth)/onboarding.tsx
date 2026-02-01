import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components";
import {
  colors,
  dynamicSpacingX,
  dynamicSpacingY,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../theme/Theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL_PAGES = 4;

// Animated Dot - stable when stationary, animates on change
const AnimatedDot = ({ isActive }: { isActive: boolean }) => {
  const width = useSharedValue(isActive ? 10 : 8);
  const opacity = useSharedValue(isActive ? 1 : 0.5);

  // Only animate when isActive changes
  React.useEffect(() => {
    width.value = withSpring(isActive ? 10 : 8, {
      damping: 20,
      stiffness: 200,
    });
    opacity.value = withSpring(isActive ? 1 : 0.5, {
      damping: 20,
      stiffness: 200,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    opacity: opacity.value,
    backgroundColor: isActive ? colors.secondary : colors.primary10,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

// Animated Page wrapper for fade/scale effects
const AnimatedPage = ({
  index,
  scrollX,
  children,
}: {
  index: number;
  scrollX: { value: number };
  children: React.ReactNode;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      "clamp",
    );
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      "clamp",
    );
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-30, 0, 30],
      "clamp",
    );

    return {
      opacity,
      transform: [{ scale }, { translateX }],
    };
  });

  return (
    <Animated.View
      style={[styles.page, { width: SCREEN_WIDTH }, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
};

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [currentPage, setCurrentPage] = useState(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleSkip = () => {
    router.push("/(auth)/login");
  };

  const handleGetStarted = () => {
    scrollViewRef.current?.scrollTo({ x: SCREEN_WIDTH, animated: true });
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />

      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page 1: Welcome */}
        <AnimatedPage index={0} scrollX={scrollX}>
          {/* Logo/Icon at top */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="chatbubbles" size={28} color={colors.white} />
            </View>
          </View>

          {/* Welcome Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to SayThis</Text>
            <Text style={styles.subtitle}>
              Your personal stuttering therapy companion{"\n"}
              for everyone, anywhere 🌱
            </Text>
          </View>

          {/* Main Illustration */}
          <View style={styles.imageContainerCircle}>
            <View style={styles.imageBackground}>
              <Image
                source={require("../../assets/images/onboarding-1-personSpeaking.png")}
                style={styles.illustrationCircle}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomContainer}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              size="large"
              fullWidth
              icon={
                <Ionicons name="arrow-forward" size={20} color={colors.white} />
              }
              iconPosition="right"
              style={styles.button}
            />
          </View>
        </AnimatedPage>

        {/* Page 2: Did You Know */}
        <AnimatedPage index={1} scrollX={scrollX}>
          {/* Skip Button */}
          <View style={styles.header}>
            <View style={{ flex: 1 }} />
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          {/* Main Illustration */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/onboarding-2-strongmind.png")}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons
                name="bulb-outline"
                size={20}
                color={colors.secondary}
              />
              <Text style={styles.cardLabel}>DID YOU KNOW?</Text>
            </View>
            <Text style={styles.cardTitle}>Fluency is a Muscle</Text>
            <Text style={styles.cardDescription}>
              Just like going to the gym, daily micro-practices rewire neural
              pathways. 85% of our users feel more confident after just 2 weeks.
            </Text>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <Text style={styles.bottomTitle}>Proven Techniques</Text>
            <Text style={styles.bottomSubtitle}>
              Backed by speech pathology research.
            </Text>
          </View>
        </AnimatedPage>

        {/* Page 3: Progress */}
        <AnimatedPage index={2} scrollX={scrollX}>
          {/* Skip Button */}
          <View style={styles.header}>
            <View style={{ flex: 1 }} />
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          {/* Title Section */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>See Your Progress</Text>
            <Text style={styles.subtitle}>
              Visualize your journey from anxiety to{"\n"}confidence.
            </Text>
          </View>

          {/* Progress Card */}
          <View style={styles.progressCard}>
            <View style={styles.scoreHeader}>
              <View>
                <Text style={styles.scoreLabel}>CONFIDENCE SCORE</Text>
                <View style={styles.scoreRow}>
                  <Text style={styles.scoreValue}>92%</Text>
                  <Ionicons
                    name="trending-up"
                    size={24}
                    color={colors.secondary}
                  />
                </View>
              </View>
              <View style={styles.weekBadge}>
                <Text style={styles.weekBadgeText}>+14% this week</Text>
              </View>
            </View>

            {/* Progress Illustration */}
            <View style={styles.illustrationContainer}>
              <Image
                source={require("../../assets/images/onboarding-3-progress.png")}
                style={styles.progressIllustration}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Feature Buttons */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureButton}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.secondary_20 },
                ]}
              >
                <Ionicons
                  name="mic-outline"
                  size={24}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.featureText}>Record</Text>
            </View>

            <View style={styles.featureButton}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.primary10 },
                ]}
              >
                <Ionicons name="stats-chart" size={24} color={colors.black} />
              </View>
              <Text style={styles.featureText}>Track</Text>
            </View>

            <View style={styles.featureButton}>
              <View
                style={[
                  styles.featureIcon,
                  { backgroundColor: colors.secondary_20 },
                ]}
              >
                <MaterialCommunityIcons
                  name="yoga"
                  size={24}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.featureText}>Grow</Text>
            </View>
          </View>
        </AnimatedPage>

        {/* Page 4: Community */}
        <AnimatedPage index={3} scrollX={scrollX}>
          {/* Skip Button */}
          <View style={styles.header}>
            <View style={{ flex: 1 }} />
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>SKIP</Text>
            </Pressable>
          </View>

          {/* Avatars Row */}
          <View style={styles.avatarsContainer}>
            <View style={styles.avatarSmall}>
              <Image
                source={require("../../assets/images/onboarding-4-yournotalone-pic1.png")}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.avatarLarge}>
              <Image
                source={require("../../assets/images/onboarding-4-yournotalone-pic2.png")}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.avatarSmall}>
              <Image
                source={require("../../assets/images/onboarding-4-yournotalone-pic3.png")}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Title Section */}
          <View style={styles.communityTextContainer}>
            <Text style={styles.communityTitle}>You Are Not Alone</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFB800" />
              <Ionicons name="star" size={16} color="#FFB800" />
              <Ionicons name="star" size={16} color="#FFB800" />
              <Ionicons name="star" size={16} color="#FFB800" />
              <Ionicons name="star-half" size={16} color="#FFB800" />
              <Text style={styles.ratingText}>4.9/5</Text>
            </View>
            <Text style={styles.communitySubtitle}>
              Join <Text style={styles.highlightText}>50,000+ others</Text>{" "}
              finding their voice in our community.
            </Text>
          </View>

          {/* Testimonial Card */}
          <View style={styles.testimonialCard}>
            <Text style={styles.testimonialText}>
              "This app completely changed how I approach my presentations at
              work. I feel in control again."
            </Text>
            <View style={styles.testimonialAuthor}>
              <Image
                source={require("../../assets/images/onboarding-4-yournotalone-pic1.png")}
                style={styles.testimonialAvatar}
                resizeMode="cover"
              />
              <View>
                <Text style={styles.authorName}>Sarah J.</Text>
                <Text style={styles.authorSince}>Member since 2024</Text>
              </View>
            </View>
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Next Button */}
          <View style={styles.bottomContainer}>
            <Button
              title="Next"
              onPress={handleSkip}
              size="large"
              fullWidth
              style={styles.button}
            />
          </View>
        </AnimatedPage>
      </Animated.ScrollView>

      {/* Fixed Pagination - Outside ScrollView */}
      <View style={styles.fixedPaginationContainer}>
        <View style={styles.pagination}>
          {Array.from({ length: TOTAL_PAGES }).map((_, index) => (
            <AnimatedDot key={index} isActive={currentPage === index} />
          ))}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: dynamicSpacingY(4), // Reduced from 10
  },
  page: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacingX.lg,
    paddingTop: spacingY.sm,
  },
  skipButton: {
    paddingVertical: spacingY.xs,
    paddingHorizontal: spacingX.md,
  },
  skipText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.secondary,
  },
  // Page 1 Styles
  logoContainer: {
    alignItems: "center",
    marginTop: dynamicSpacingY(2), // Reduced from 4
  },
  logoCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  textContainer: {
    alignItems: "center",
    marginTop: dynamicSpacingY(3),
    paddingHorizontal: spacingX.lg,
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.black,
    textAlign: "center",
    marginBottom: spacingY.sm,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    textAlign: "center",
    lineHeight: 24,
  },
  imageContainerCircle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: dynamicSpacingY(1), // Reduced from 2
    paddingHorizontal: spacingX.lg,
  },
  imageBackground: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  illustrationCircle: {
    width: "85%",
    height: "85%",
  },
  bottomContainer: {
    paddingBottom: dynamicSpacingY(2), // Reduced from 4
    paddingHorizontal: spacingX.lg,
  },
  button: {
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Page 2 Styles
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacingX.lg,
  },
  illustration: {
    width: "80%",
    height: "80%",
  },
  card: {
    marginHorizontal: spacingX.lg,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: dynamicSpacingX(5),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
    marginBottom: spacingY.sm,
  },
  cardLabel: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.secondary,
    letterSpacing: 1,
  },
  cardTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  cardDescription: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    lineHeight: 22,
  },
  bottomSection: {
    alignItems: "center",
    paddingVertical: dynamicSpacingY(3),
    paddingHorizontal: spacingX.lg,
  },
  bottomTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
    marginBottom: spacingY.xxs,
  },
  bottomSubtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    marginBottom: spacingY.md,
  },
  // Page 3 Styles
  titleContainer: {
    paddingHorizontal: spacingX.lg,
    marginTop: dynamicSpacingY(2),
  },
  progressCard: {
    flex: 1,
    marginHorizontal: spacingX.lg,
    marginTop: dynamicSpacingY(2),
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: dynamicSpacingX(5),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  scoreLabel: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.black_text,
    letterSpacing: 1,
    marginBottom: spacingY.xxs,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.xs,
  },
  scoreValue: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.secondary,
  },
  weekBadge: {
    backgroundColor: "#E8F5E9",
    paddingVertical: spacingY.xxs,
    paddingHorizontal: spacingX.sm,
    borderRadius: 20,
  },
  weekBadgeText: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: "#4CAF50",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressIllustration: {
    width: "100%",
    height: "100%",
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: spacingX.lg,
    marginVertical: dynamicSpacingY(2),
  },
  featureButton: {
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: spacingY.sm,
    paddingHorizontal: dynamicSpacingX(5),
    borderRadius: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacingY.xs,
  },
  featureText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black,
  },
  // Fixed Pagination Container
  fixedPaginationContainer: {
    position: "absolute",
    bottom: dynamicSpacingY(2), // Moved much lower
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm, // Increased gap slightly
  },
  dot: {
    height: 8,
    borderRadius: 4, // Fully rounded
    backgroundColor: colors.primary10,
  },
  activeDot: {
    width: 10, // Small circle/dot (just slightly larger than 8)
    backgroundColor: colors.secondary,
  },
  // Page 4 Styles
  avatarsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: dynamicSpacingY(4),
  },
  avatarSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.white,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: colors.primary,
    marginHorizontal: -10,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLarge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.white,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: colors.primary,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  communityTextContainer: {
    alignItems: "center",
    marginTop: dynamicSpacingY(3),
    paddingHorizontal: spacingX.lg,
  },
  communityTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: colors.black,
    textAlign: "center",
    marginBottom: spacingY.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: spacingY.sm,
  },
  ratingText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    marginLeft: spacingX.xs,
  },
  communitySubtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    textAlign: "center",
    lineHeight: 24,
  },
  highlightText: {
    fontFamily: FONTS.primaryBold,
    color: colors.secondary,
  },
  testimonialCard: {
    marginHorizontal: spacingX.lg,
    marginTop: dynamicSpacingY(3),
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: dynamicSpacingX(5),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  testimonialText: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black,
    lineHeight: 24,
    marginBottom: spacingY.md,
  },
  testimonialAuthor: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  authorName: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.small,
    color: colors.black,
  },
  authorSince: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.tiny,
    color: colors.secondary,
  },
});
