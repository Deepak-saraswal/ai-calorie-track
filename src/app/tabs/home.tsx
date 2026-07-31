import { useAuth, useUser } from "@clerk/expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";

import { Colors } from "../../constants/colors";
import { clearCachedUser } from "../../lib/localUser";

export default function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();

 const handleSignOut = async () => {
  try {
    await clearCachedUser();
    await signOut();

    router.replace("/");

  } catch (error) {
    console.log("SIGN OUT ERROR:", error);
  }
};

  return (
    <LinearGradient
      colors={[Colors.primaryDark, Colors.primary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.eyebrow}>YOUR PERSONAL LEDGER</Text>

        <Text style={styles.title}>
          Hello, {user?.firstName || "there"} 👋
        </Text>

        <Text style={styles.subtitle}>
          Your account is secure and your profile has been synced successfully.
        </Text>

        <Pressable style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
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
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  eyebrow: {
    color: Colors.primaryLight,
    fontWeight: "700",
    letterSpacing: 1,
    fontSize: 12,
  },

  title: {
    marginTop: 12,
    fontSize: 36,
    fontWeight: "800",
    color: Colors.white,
  },

  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.primarySoft,
  },

  button: {
    marginTop: 40,
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});