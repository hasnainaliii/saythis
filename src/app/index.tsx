import { Redirect } from "expo-router";

export default function Index() {
  // Redirect to onboarding screen on app start
  return <Redirect href="/(auth)/onboarding" />;
}
