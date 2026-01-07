import { Text, View } from "react-native";
import { FONTS } from "../constants/Theme";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Text style={{fontFamily:FONTS.primaryBlack}}>Edit app/index.tsx to edit thisawdad screenssssss.</Text>
    </View>
  );
}
