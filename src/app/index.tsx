import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/Theme";

export default function Index() {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const hasCompletedOnboarding = useAuthStore(
    (state) => state.hasCompletedOnboarding,
  );

  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (isAuthenticated) {
    if (!user?.email_verified_at) {
      return <Redirect href="/(auth)/verify-email" />;
    }
    return <Redirect href="/(main)" />;
  }

  if (!hasCompletedOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  return <Redirect href="/(auth)/login" />;
}
