import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, dynamicSpacingX } from "../theme/Theme";

interface ChapterHeroIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
}

const OUTER = dynamicSpacingX(38);
const MIDDLE = dynamicSpacingX(27);
const INNER = dynamicSpacingX(17);

const ChapterHeroIcon: React.FC<ChapterHeroIconProps> = ({ icon, accent }) => (
  <View style={[styles.outer, { backgroundColor: accent + "1A" }]}>
    <View style={[styles.middle, { backgroundColor: accent + "33" }]}>
      <View style={[styles.inner, { backgroundColor: accent }]}>
        <Ionicons name={icon} size={30} color={colors.white} />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  outer: {
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  middle: {
    width: MIDDLE,
    height: MIDDLE,
    borderRadius: MIDDLE / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    width: INNER,
    height: INNER,
    borderRadius: INNER / 2,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChapterHeroIcon;
