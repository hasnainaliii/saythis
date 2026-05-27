import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import * as Linking from "expo-linking";
import { AudioModule } from "expo-audio";
import { Mic, Settings as SettingsIcon } from "lucide-react-native";

import { colors, spacingX, spacingY, FONTS, fontSizes, dynamicSpacingY } from "../../../../theme/Theme";
import { Button, ScreenHeader } from "../../../../components";

export default function AppSettingsScreen() {
  const [micGranted, setMicGranted] = useState<boolean>(false);

  const checkPermissions = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setMicGranted(status.granted);
    } catch (e) {
      console.log("Error checking mic permissions", e);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const openSystemSettings = () => {
    Linking.openSettings();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader title="App Settings" />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          <Text style={styles.sectionDescription}>
            Manage what access you've granted to the app. Note that toggling these permissions must be done in your device settings.
          </Text>

          <View style={styles.permissionItem}>
            <View style={styles.permissionIconContainer}>
              <Mic size={24} color={colors.primary} />
            </View>
            <View style={styles.permissionTextContainer}>
              <Text style={styles.permissionTitle}>Microphone</Text>
              <Text style={styles.permissionStatus}>
                {micGranted ? "Granted" : "Denied"}
              </Text>
            </View>
            <Switch
              value={micGranted}
              onValueChange={openSystemSettings}
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>

        <View style={styles.actionContainer}>
          <Button
            title="Manage Permissions in Settings"
            onPress={openSystemSettings}
            variant="primary"
            icon={<SettingsIcon size={20} color={colors.secondary} />}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContent: {
    padding: spacingX.lg,
    paddingBottom: spacingY.xxl,
  },
  section: {
    marginBottom: spacingY.xl,
  },
  sectionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.xl,
    color: colors.black,
    marginBottom: spacingY.xs,
  },
  sectionDescription: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.medium,
    color: colors.black_text,
    marginBottom: spacingY.md,
    lineHeight: fontSizes.medium * 1.5,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary_20,
    padding: spacingX.md,
    borderRadius: spacingY.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissionIconContainer: {
    width: dynamicSpacingY(6),
    height: dynamicSpacingY(6),
    borderRadius: dynamicSpacingY(3),
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacingX.md,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontFamily: FONTS.primaryBold,
    fontSize: fontSizes.large,
    color: colors.black,
  },
  permissionStatus: {
    fontFamily: FONTS.primary,
    fontSize: fontSizes.small,
    color: colors.black_text,
    marginTop: 2,
  },

  actionContainer: {
    marginTop: spacingY.md,
  },
});
