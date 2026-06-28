import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import {
  SplashScreen,
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/Theme";

SplashScreen.preventAutoHideAsync();
SystemUI.setBackgroundColorAsync(colors.primary);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const [fontsLoaded, fontsError] = useFonts({
    "MyFont-Regular": require("@/src/assets/fonts/Cause-Regular.ttf"),
    "MyFont-Medium": require("@/src/assets/fonts/Cause-Medium.ttf"),
    "MyFont-Bold": require("@/src/assets/fonts/Cause-Bold.ttf"),
    "MyFont-Black": require("@/src/assets/fonts/Cause-Black.ttf"),
    "MyFont-Thin": require("@/src/assets/fonts/Cause-Thin.ttf"),
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if ((fontsLoaded || fontsError) && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsError, fontsLoaded, isHydrated]);

  const user = useAuthStore((state) => state.user);

  const hasCompletedOnboarding = useAuthStore(
    (state) => state.hasCompletedOnboarding,
  );

  useEffect(() => {
    if (!isHydrated || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isVerified = !!user?.email_verified_at;

    if (!isAuthenticated && !inAuthGroup) {
      router.replace(
        hasCompletedOnboarding ? "/(auth)/login" : "/(auth)/onboarding",
      );
    } else if (isAuthenticated && !isVerified && !inAuthGroup) {
      router.replace("/(auth)/verify-email");
    } else if (isAuthenticated && isVerified && inAuthGroup) {
      router.replace("/(main)");
    }
  }, [
    isAuthenticated,
    isHydrated,
    segments,
    rootNavigationState,
    user,
    hasCompletedOnboarding,
  ]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.primary }}>
        <SafeAreaProvider style={{ backgroundColor: colors.primary }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.primary },
              animation: "fade",
              statusBarStyle: "dark",
            }}
          />
          <Toast />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
