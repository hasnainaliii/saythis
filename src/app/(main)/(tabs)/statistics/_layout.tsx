import { Stack } from "expo-router";
import { colors } from "../../../../theme/Theme";

export default function StatisticsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.primary },
      }}
    />
  );
}
