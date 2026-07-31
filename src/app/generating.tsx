import { Colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function Generating() {
  return (
    <LinearGradient
      colors={[
        Colors.gradientStart,
        Colors.gradientMiddle,
        Colors.gradientEnd,
      ]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <ActivityIndicator
            size="large"
            color={Colors.primary}
          />

          <Text style={styles.title}>
            Creating Your Fitness Plan
          </Text>

          <Text style={styles.subtitle}>
            Please wait...
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },

  safeArea:{
    flex:1
  },

  content:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:30
  },

  title:{
    fontSize:30,
    fontWeight:"800",
    marginTop:25,
    textAlign:"center"
  },

  subtitle:{
    marginTop:15,
    fontSize:18,
    color:"#666",
    textAlign:"center"
  }
});