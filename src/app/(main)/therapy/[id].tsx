import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import {
  colors,
  FONTS,
  fontSizes,
  spacingX,
  spacingY,
} from "../../../theme/Theme";

export default function ChapterDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Back"
          onPress={() => router.back()}
          variant="outline"
          size="small"
          icon={
            <Ionicons name="arrow-back" size={16} color={colors.secondary} />
          }
          iconPosition="left"
          style={{ alignSelf: "flex-start" }}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Chapter {id}</Text>
        <Text style={styles.subtitle}>
          Details including objectives and exercise list will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: spacingX.lg,
  },
  header: {
    marginBottom: spacingY.md,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xxl,
    color: "#1A2B49",
    marginBottom: spacingY.sm,
  },
  subtitle: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: "#5A6B89",
    textAlign: "center",
  },
});
