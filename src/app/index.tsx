import { Text, View } from "react-native";
import { StyleSheet } from 'react-native-unistyles';
import { FONTS } from "../theme/Theme";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Text style={styles.container}>Edit app/index.tsx to edit thisawdad screenssssss.</Text>
    </View>
  );
}
const styles = StyleSheet.create({
   container: {
     backgroundColor: 'red',
     padding:50,
     fontFamily:FONTS.primaryBlack
   }
})