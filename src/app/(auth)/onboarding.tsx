import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedDot from "../../components/onboarding/AnimatedDot";
import AnimatedPage from "../../components/onboarding/AnimatedPage";
import CommunityPage from "../../components/onboarding/CommunityPage";
import FactPage from "../../components/onboarding/FactPage";
import ProgressPage from "../../components/onboarding/ProgressPage";
import WelcomePage from "../../components/onboarding/WelcomePage";
import { useAuthStore } from "../../store/authStore";
import { colors, dynamicSpacingY, spacingX } from "../../theme/Theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOTAL_PAGES = 4;

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
    useAuthStore.getState().setOnboardingCompleted();
    router.replace("/(auth)/login");
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
        <AnimatedPage index={0} scrollX={scrollX}>
          <WelcomePage onGetStarted={handleGetStarted} />
        </AnimatedPage>

        <AnimatedPage index={1} scrollX={scrollX}>
          <FactPage onSkip={handleSkip} />
        </AnimatedPage>

        <AnimatedPage index={2} scrollX={scrollX}>
          <ProgressPage onSkip={handleSkip} />
        </AnimatedPage>

        <AnimatedPage index={3} scrollX={scrollX}>
          <CommunityPage onSkip={handleSkip} onNext={handleSkip} />
        </AnimatedPage>
      </Animated.ScrollView>

      <View style={styles.paginationContainer}>
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
    paddingBottom: dynamicSpacingY(4),
  },
  paginationContainer: {
    position: "absolute",
    bottom: dynamicSpacingY(4),
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX.sm,
  },
});
