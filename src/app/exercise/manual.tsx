
import { addDailyLog } from "@/lib/dailyLogService";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";
const BACKGROUND = "#F7F8F7";
const BORDER = "#E2E8E2";

export default function ManualExercise() {
    const { user } = useUser();

  const [calories, setCalories] = useState("");

  const caloriesValue = Number(calories || 0);

  const handleLog = async () => {
  if (!user?.id) {
    return;
  }

  if (!caloriesValue || caloriesValue <= 0) {
    return;
  }

  try {
    const today = new Date();

    await addDailyLog(
      user.id,
      today,
      {
        type: "exercise",

        title: "Manual Exercise",

        time: today.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),

        // IMPORTANT:
        // Negative because these calories are burned.
        calories: -caloriesValue,

        protein: 0,

        fat: 0,

        carbs: 0,

        waterMl: 0,

        duration: 0,

        intensity: "Manual",
      }
    );

    console.log("MANUAL EXERCISE SAVED:", {
      caloriesBurned: caloriesValue,
    });

    router.back();
  } catch (error) {
    console.log(
      "MANUAL EXERCISE SAVE ERROR:",
      error
    );
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={
          Platform.OS === "ios" ? "padding" : undefined
        }
      >
        {/* =====================================
            HEADER
        ===================================== */}

        <View style={styles.header}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                console.log("🔥 BACK TO ADD TAB");
                router.replace("/log-exercise");
              }}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Manual Exercise
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* =====================================
            MAIN CONTENT
        ===================================== */}

        <View style={styles.content}>

          {/* Hero */}

          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons
                name="flame"
                size={31}
                color={GREEN}
              />
            </View>

            <Text style={styles.title}>
              Log Calories Burned
            </Text>

            <Text style={styles.description}>
              Enter the calories you burned during
              your workout manually.
            </Text>
          </View>

          {/* =====================================
              CALORIE CARD
          ===================================== */}

          <View style={styles.card}>

            <View style={styles.cardHeader}>
              <View style={styles.smallIcon}>
                <Ionicons
                  name="flame-outline"
                  size={21}
                  color={GREEN}
                />
              </View>

              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>
                  Calories Burned
                </Text>

                <Text style={styles.cardSubtitle}>
                  Enter your estimated calories
                </Text>
              </View>
            </View>

            {/* Input */}

            <View style={styles.inputContainer}>
              <TextInput
                value={calories}
                onChangeText={(value) =>
                  setCalories(
                    value.replace(/[^0-9]/g, "")
                  )
                }
                placeholder="0"
                placeholderTextColor="#A5AAA6"
                keyboardType="number-pad"
                style={styles.input}
                maxLength={5}
              />

              <Text style={styles.unit}>
                kcal
              </Text>
            </View>

            {/* Helper */}

            <View style={styles.helperRow}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={MUTED}
              />

              <Text style={styles.helperText}>
                Enter the total calories burned
                during your exercise.
              </Text>
            </View>

          </View>

          {/* =====================================
              PREVIEW
          ===================================== */}

          {caloriesValue > 0 && (
            <View style={styles.previewCard}>
              <View style={styles.previewIcon}>
                <Ionicons
                  name="flame"
                  size={20}
                  color={GREEN}
                />
              </View>

              <View>
                <Text style={styles.previewLabel}>
                  Calories to log
                </Text>

                <Text style={styles.previewValue}>
                  {caloriesValue} kcal
                </Text>
              </View>
            </View>
          )}

        </View>

        {/* =====================================
            BOTTOM LOG BUTTON
        ===================================== */}

        <View style={styles.bottomContainer}>
          <Pressable
            onPress={handleLog}
            disabled={!caloriesValue}
            style={({ pressed }) => [
              styles.logButton,
              !caloriesValue &&
                styles.logButtonDisabled,
              pressed &&
                caloriesValue > 0 &&
                styles.buttonPressed,
            ]}
          >
            <Ionicons
              name="flame"
              size={21}
              color={WHITE}
            />

            <Text style={styles.logButtonText}>
              Log Exercise
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  // ==========================================
  // HEADER
  // ==========================================

  header: {
    marginTop: 40,
    height: 72,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },
   backIcon: {
  fontSize: 36,
  lineHeight: 36,
  fontWeight: "300",
  color: TEXT,
},

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
  },

  headerSpacer: {
    width: 44,
  },

  pressed: {
    opacity: 0.7,
  },

  // ==========================================
  // CONTENT
  // ==========================================

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 25,
  },

  // ==========================================
  // HERO
  // ==========================================

  hero: {
    alignItems: "center",
    marginBottom: 30,
  },

  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 26,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.7,
    textAlign: "center",
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 320,
  },

  // ==========================================
  // CARD
  // ==========================================

  card: {
    backgroundColor: WHITE,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  smallIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  cardHeaderText: {
    marginLeft: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
  },

  cardSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 3,
  },

  // ==========================================
  // INPUT
  // ==========================================

  inputContainer: {
    height: 76,
    marginTop: 22,
    borderRadius: 18,
    backgroundColor: "#F7F9F7",
    borderWidth: 1.5,
    borderColor: "#DCE4DC",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  input: {
    flex: 1,
    height: 74,
    fontSize: 32,
    fontWeight: "800",
    color: TEXT,
    padding: 0,
  },

  unit: {
    fontSize: 15,
    fontWeight: "800",
    color: MUTED,
    marginLeft: 10,
  },

  // ==========================================
  // HELPER
  // ==========================================

  helperRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 13,
  },

  helperText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: MUTED,
    marginLeft: 6,
  },

  // ==========================================
  // PREVIEW
  // ==========================================

  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    backgroundColor: LIGHT_GREEN,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D8E5D9",
  },

  previewIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  previewLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "600",
    marginLeft: 12,
  },

  previewValue: {
    fontSize: 17,
    color: DARK_GREEN,
    fontWeight: "800",
    marginLeft: 12,
    marginTop: 2,
  },

  // ==========================================
  // BOTTOM
  // ==========================================

  bottomContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: "#E7EBE7",
  },

  logButton: {
    height: 56,
    borderRadius: 17,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 9,

    shadowColor: GREEN,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  logButtonDisabled: {
    backgroundColor: "#B8C5BA",
    shadowOpacity: 0,
    elevation: 0,
  },

  logButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});