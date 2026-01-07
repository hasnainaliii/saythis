import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
 
  const [fontsLoaded,fontsError]= useFonts({
    'MyFont-Regular': require('@/src/assets/fonts/Cause-Regular.ttf'),
    'MyFont-Bold': require('@/src/assets/fonts/Cause-Bold.ttf'),
    'MyFont-Black': require('@/src/assets/fonts/Cause-Black.ttf'),
    'MyFont-Thin': require('@/src/assets/fonts/Cause-Thin.ttf'),
  })



  useEffect(() => {
    if(fontsLoaded || fontsError){
        SplashScreen.hideAsync()
    }
  }, [fontsError,fontsLoaded]); 

if (!fontsLoaded && !fontsError) {
    return null; 
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "#ffffff" } // match splash bg
      }}
    />
  );
}
