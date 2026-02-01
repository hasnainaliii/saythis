import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/Theme";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const [fontsLoaded, fontsError] = useFonts({
    "MyFont-Regular": require("@/src/assets/fonts/Cause-Regular.ttf"),
    "MyFont-Bold": require("@/src/assets/fonts/Cause-Bold.ttf"),
    "MyFont-Black": require("@/src/assets/fonts/Cause-Black.ttf"),
    "MyFont-Thin": require("@/src/assets/fonts/Cause-Thin.ttf"),
  });

  // Hydrate auth state on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if ((fontsLoaded || fontsError) && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsError, fontsLoaded, isHydrated]);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.primary },
              animation: "fade",
            }}
          />
          <Toast />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
