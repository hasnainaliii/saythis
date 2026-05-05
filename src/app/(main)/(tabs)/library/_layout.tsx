import { Stack } from "expo-router";
import { colors } from "../../../../theme/Theme";

export default function LibraryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.libraryBg },
      }}
    />
  );
}
