import { Colors } from "@/constants/colors";
import { generateFitnessPlan } from "@/lib/gemini";
import { saveUserProfile } from "@/lib/profileService";

import { useUser } from "@clerk/expo";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function GeneratingPlan() {
  const { user } = useUser();
  const { profile } = useLocalSearchParams();

  useEffect(() => {
  if (!user || !profile) return;

  generatePlan();
}, [user, profile]);

  async function generatePlan() {
  if (!user) {
    return;
    
  }

  try {
    const userProfile = JSON.parse(profile as string);

    const aiPlan = await generateFitnessPlan(userProfile);

    await saveUserProfile(user.id, {
      clerkId: user.id,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.primaryEmailAddress?.emailAddress,
      imageUrl: user.imageUrl,

      gender: userProfile.gender,
      goal: userProfile.goal,
      workout: userProfile.workout,
      birthDate: userProfile.birthDate,
      height: userProfile.height,
      weight: userProfile.weight,

      aiPlan,
    });

    router.replace("/report");
  } catch (error) {
    console.log(error);
  }
}

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
            AI is calculating your calories,
            macros, BMI, workout plan and
            nutrition...
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 25,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 15,
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    lineHeight: 28,
  },
});