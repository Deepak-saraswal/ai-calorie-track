import { useAuth, useSSO, useUser } from "@clerk/expo";
import { useSignIn, useSignUp } from "@clerk/expo/legacy";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { UserSync } from "../components/UserSync";
import { clearCachedUser, getCachedUser } from "../lib/localUser";

type AuthMode = "signIn" | "signUp";

function errorMessage(error: unknown) {
  const clerkError = error as { errors?: { longMessage?: string; message?: string }[] };
  return clerkError.errors?.[0]?.longMessage ?? clerkError.errors?.[0]?.message ?? "Something went wrong. Please try again.";
}

function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();
  const { startSSOFlow } = useSSO();
  const clerkReady = Boolean(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);

  const resetForm = (nextMode: AuthMode) => {
  setMode(nextMode);
  setAwaitingVerification(false);
  setCode("");
  setFirstName("");
  setLastName("");
};

  const submitEmailAuth = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email address and password to continue.");
      return;
    }
    if (!clerkReady) {
      Alert.alert("Clerk needs a key", "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file, then restart Expo.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "signIn") {
        if (!signIn || !setActiveSignIn) throw new Error("Authentication is still loading. Please try again.");
        const result = await signIn.create({
          identifier: email.trim(),
          password,
        });

        console.log(result);

        if (result.status === "complete") {
          await setActiveSignIn({ session: result.createdSessionId });
        } else {
          console.log("Sign in status:", result.status);
          console.log("Next step:", result);
        }
        return;
      }

      if (awaitingVerification) {
        if (!signUp || !setActiveSignUp) throw new Error("Authentication is still loading. Please try again.");
        const result = await signUp.attemptEmailAddressVerification({ code });
        if (result.status === "complete") {
          await setActiveSignUp({ session: result.createdSessionId });
        } else {
          Alert.alert("Verification incomplete", "Please check the code and try again.");
        }
        return;
      }

      if (!signUp) throw new Error("Authentication is still loading. Please try again.");
      if (
  mode === "signUp" &&
  (!firstName.trim() || !lastName.trim())
) {
  Alert.alert(
    "Missing details",
    "Please enter your first and last name."
  );
  return;
}

     await signUp.create({
  emailAddress: email.trim(),
  password,
  firstName: firstName.trim(),
  lastName: lastName.trim(),
});

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setAwaitingVerification(true);
    } catch (error) {
      Alert.alert("Couldn’t continue", errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!clerkReady) {
      Alert.alert("Clerk needs a key", "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to your .env file, then restart Expo.");
      return;
    }
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });
      if (createdSessionId && setActive) await setActive({ session: createdSessionId });
    } catch (error) {
      Alert.alert("Google sign-in failed", errorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#F4F7FF", "#FFFFFF", "#EEFDF7"]} style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
  style={styles.flex}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 25}
>
          <KeyboardAwareScrollView
  style={{ flex: 1 }}
  contentContainerStyle={styles.scrollContent}
  keyboardShouldPersistTaps="handled"
  enableOnAndroid={true}
  enableAutomaticScroll={true}
  extraScrollHeight={80}
  extraHeight={120}
  showsVerticalScrollIndicator={false}
>
            <View style={styles.topRow}><View style={styles.brandMark}><Image source={require("../../assets/images/logo-glow.png")} style={styles.logo} contentFit="contain" /></View><Text style={styles.brand}>Pennywise</Text></View>
            <View style={styles.hero}><View style={styles.heroIcon}><Text style={styles.heroEmoji}>✦</Text></View><Text style={styles.title}>{mode === "signIn" ? "Welcome back" : awaitingVerification ? "Check your inbox" : "Start spending smarter"}</Text><Text style={styles.subtitle}>{awaitingVerification ? `We sent a verification code to ${email.trim()}.` : mode === "signIn" ? "Your money story is ready when you are." : "A calmer, clearer way to manage every rupee."}</Text></View>
            <View style={styles.card}>
              {!awaitingVerification && <View style={styles.tabs}><Pressable onPress={() => resetForm("signIn")} style={[styles.tab, mode === "signIn" && styles.tabActive]}><Text style={[styles.tabText, mode === "signIn" && styles.tabTextActive]}>Sign in</Text></Pressable><Pressable onPress={() => resetForm("signUp")} style={[styles.tab, mode === "signUp" && styles.tabActive]}><Text style={[styles.tabText, mode === "signUp" && styles.tabTextActive]}>Create account</Text></Pressable></View>}
              {awaitingVerification ? <><Field label="Verification code" value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="Enter 6-digit code" /><Pressable onPress={() => setAwaitingVerification(false)}><Text style={styles.backLink}>← Use a different email</Text></Pressable></> : <>
  {mode === "signUp" && (
    <>
      <Field
        label="First name"
        value={firstName}
        onChangeText={setFirstName}
        placeholder="John"
      />

      <Field
        label="Last name"
        value={lastName}
        onChangeText={setLastName}
        placeholder="Doe"
      />
    </>
  )}

  <Field
    label="Email address"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
    placeholder="you@example.com"
  />

  <Field
    label="Password"
    value={password}
    onChangeText={setPassword}
    secureTextEntry
    placeholder="At least 8 characters"
  />

  <Pressable>
    <Text style={styles.forgot}>Forgot password?</Text>
  </Pressable>
</>}
              <Pressable disabled={loading} onPress={submitEmailAuth} style={({ pressed }) => [styles.primaryButton, (pressed || loading) && styles.buttonPressed]}><Text style={styles.primaryButtonText}>{loading ? "Please wait…" : awaitingVerification ? "Verify email" : mode === "signIn" ? "Sign in" : "Create account"}</Text>{loading && <ActivityIndicator color="#FFFFFF" size="small" />}</Pressable>
              {!awaitingVerification && <><View style={styles.divider}><View style={styles.line} /><Text style={styles.dividerText}>or continue with</Text><View style={styles.line} /></View><Pressable disabled={loading} onPress={signInWithGoogle} style={styles.googleButton}><Text style={styles.googleG}>G</Text><Text style={styles.googleText}>Google</Text></Pressable></>}
            </View>
            <Text style={styles.terms}>By continuing, you agree to our Terms of Service and Privacy Policy.</Text>
          </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, ...inputProps } = props;
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...inputProps} style={styles.input} placeholderTextColor="#9BA7B8" /></View>;
}

function Home() {
  const { user } = useUser();
  const { signOut } = useAuth();
  return <LinearGradient colors={["#112A46", "#14596D"]} style={styles.home}><SafeAreaView style={styles.homeSafe}><Text style={styles.homeEyebrow}>YOUR PERSONAL LEDGER</Text><Text style={styles.homeTitle}>Hello, {user?.firstName || "there"}.</Text><Text style={styles.homeText}>Your account is secure and your basic profile is synced to Firestore.</Text><Pressable onPress={async () => { await clearCachedUser(); await signOut(); }} style={styles.signOut}><Text style={styles.signOutText}>Sign out</Text></Pressable></SafeAreaView></LinearGradient>;
}

function AuthenticatedIndex() {
  const { isLoaded, isSignedIn } = useAuth();
  const [hasCachedUser, setHasCachedUser] = useState(false);

  useEffect(() => {
    getCachedUser().then((cachedUser) => setHasCachedUser(Boolean(cachedUser)));
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clearCachedUser().catch(() => undefined);
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return <View style={styles.loadingScreen}><ActivityIndicator size="large" color="#236BFE" /><Text style={styles.loadingText}>{hasCachedUser ? "Restoring your secure session…" : "Preparing Pennywise…"}</Text></View>;
  return isSignedIn ? <><UserSync /><Home /></> : <AuthScreen />;
}

function SetupRequired() {
  return <LinearGradient colors={["#F4F7FF", "#FFFFFF", "#EEFDF7"]} style={styles.screen}><SafeAreaView style={styles.setup}><View style={styles.brandMark}><Image source={require("../../assets/images/logo-glow.png")} style={styles.logo} contentFit="contain" /></View><Text style={styles.setupTitle}>Pennywise is ready.</Text><Text style={styles.setupText}>Copy .env.example to .env and add your Clerk publishable key to enable email and Google sign-in.</Text></SafeAreaView></LinearGradient>;
}

export default function Index() {
  return process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ? <AuthenticatedIndex /> : <SetupRequired />;
}

const styles = StyleSheet.create<any>({
  screen: { flex: 1 }, safeArea: { flex: 1 }, flex: { flex: 1 }, scrollContent: { padding: 24, paddingBottom: 120, flexGrow: 1 }, topRow: { flexDirection: "row", alignItems: "center", gap: 9 }, brandMark: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#122C4B", overflow: "hidden" }, logo: { width: "100%", height: "100%" }, brand: { color: "#163353", fontSize: 18, fontWeight: "800", letterSpacing: -0.5 }, hero: { marginTop: 43, marginBottom: 27 }, heroIcon: { backgroundColor: "#DFF8ED", width: 46, height: 46, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 17 }, heroEmoji: { color: "#0D9570", fontSize: 24 }, title: { color: "#102C4A", fontSize: 31, lineHeight: 37, fontWeight: "800", letterSpacing: -1.2 }, subtitle: { color: "#6D7C8E", fontSize: 15, lineHeight: 22, marginTop: 9, maxWidth: 300 }, card: { backgroundColor: "#FFFFFF", borderRadius: 28, padding: 18, shadowColor: "#264D67", shadowOpacity: 0.11, shadowRadius: 25, shadowOffset: { width: 0, height: 12 }, elevation: 5 }, tabs: { flexDirection: "row", backgroundColor: "#F2F5F8", borderRadius: 13, padding: 4, marginBottom: 20 }, tab: { flex: 1, paddingVertical: 11, alignItems: "center", borderRadius: 10 }, tabActive: { backgroundColor: "#FFFFFF", shadowColor: "#40546A", shadowOpacity: 0.12, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 2 }, tabText: { color: "#718094", fontWeight: "700", fontSize: 13 }, tabTextActive: { color: "#173553" }, field: { marginBottom: 15 }, label: { color: "#38516B", fontWeight: "700", fontSize: 13, marginBottom: 7 }, input: { backgroundColor: "#F7F9FC", borderWidth: 1, borderColor: "#E7ECF2", borderRadius: 14, paddingHorizontal: 15, height: 52, color: "#163353", fontSize: 15 }, forgot: { alignSelf: "flex-end", color: "#236BFE", fontWeight: "700", fontSize: 13, marginTop: -5, marginBottom: 17 }, backLink: { color: "#236BFE", fontWeight: "700", fontSize: 13, marginTop: 0, marginBottom: 17 }, primaryButton: { backgroundColor: "#236BFE", height: 54, borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, shadowColor: "#236BFE", shadowOpacity: 0.25, shadowRadius: 11, shadowOffset: { width: 0, height: 6 } }, buttonPressed: { opacity: 0.78 }, primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" }, divider: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 21 }, line: { height: 1, backgroundColor: "#E8EDF3", flex: 1 }, dividerText: { color: "#8B99A9", fontSize: 12, fontWeight: "600" }, googleButton: { height: 53, borderWidth: 1, borderColor: "#DFE6EE", borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 11 }, googleG: { color: "#4285F4", fontSize: 20, fontWeight: "800" }, googleText: { color: "#334C66", fontSize: 15, fontWeight: "700" }, terms: { color: "#8A97A7", fontSize: 11, lineHeight: 16, textAlign: "center", marginTop: 20, paddingHorizontal: 16 }, loadingScreen: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#F7F9FF" }, loadingText: { color: "#6D7C8E", fontSize: 14, fontWeight: "600", marginTop: 13 }, setup: { flex: 1, padding: 28, justifyContent: "center" }, setupTitle: { color: "#102C4A", fontSize: 32, fontWeight: "800", marginTop: 18, letterSpacing: -1 }, setupText: { color: "#6D7C8E", fontSize: 16, lineHeight: 24, marginTop: 10, maxWidth: 300 }, home: { flex: 1 }, homeSafe: { flex: 1, padding: 28, justifyContent: "center" }, homeEyebrow: { color: "#9CE9D0", fontSize: 12, fontWeight: "800", letterSpacing: 1.4 }, homeTitle: { color: "#FFFFFF", fontSize: 40, fontWeight: "800", marginTop: 13, letterSpacing: -1.3 }, homeText: { color: "#C9E2E8", fontSize: 16, lineHeight: 24, marginTop: 12, maxWidth: 290 }, signOut: { marginTop: 32, borderWidth: 1, borderColor: "#84C7D0", borderRadius: 14, alignSelf: "flex-start", paddingHorizontal: 20, paddingVertical: 13 }, signOutText: { color: "#FFFFFF", fontWeight: "800" },
});
