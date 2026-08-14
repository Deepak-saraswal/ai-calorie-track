import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useUser } from "@clerk/expo";

import { addDailyLog } from "@/lib/dailyLogService";

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";
const BACKGROUND = "#F7F8F7";
const BORDER = "#E2E8E2";

export default function ExerciseResult() {
  const { user } = useUser();

  const params = useLocalSearchParams<{
    type?: string;
    intensity?: string;
    duration?: string;
    calories?: string;
  }>();

  const [saving, setSaving] = useState(false);

  const workoutType =
    params.type === "weight"
      ? "Weight Lifting"
      : "Cardio";

  const intensity =
    params.intensity || "Medium";

  const duration =
    Number(params.duration || 0);

  const calories =
    Math.round(Number(params.calories || 0));

  async function handleLogWorkout() {
    if (!user?.id || !calories || saving) {
      return;
    }

    try {
      setSaving(true);

      const today = new Date();

      await addDailyLog(
        user.id,
        today,
        {
          type: "exercise",

          title: workoutType,

          time: today.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),

          // Negative because exercise burns calories
          calories: -calories,

          protein: 0,
          fat: 0,
          carbs: 0,
          waterMl: 0,

          duration,

          intensity,
        }
      );

      console.log("EXERCISE SAVED:", {
        workoutType,
        intensity,
        duration,
        caloriesBurned: calories,
      });

      // Go back to Home tab
      router.replace("/tabs/home");
    } catch (error) {
      console.log(
        "EXERCISE SAVE ERROR:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>

        {/* =====================================
            HEADER
        ===================================== */}

        <View style={styles.header}>

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color={TEXT}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Workout Complete
          </Text>

          <View style={styles.headerSpacer} />

        </View>

        {/* =====================================
            RESULT
        ===================================== */}

        <View style={styles.content}>

          <View style={styles.resultContainer}>

            {/* FIRE ICON */}

            <View style={styles.fireCircle}>
              <Ionicons
                name="flame"
                size={58}
                color={GREEN}
              />
            </View>

            <Text style={styles.resultLabel}>
              Your workout burned
            </Text>

            <View style={styles.calorieRow}>

              <Text style={styles.calorieNumber}>
                {calories}
              </Text>

              <Text style={styles.calorieUnit}>
                cals
              </Text>

            </View>

            {/* DETAILS */}

            <View style={styles.detailsCard}>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Workout
                </Text>

                <Text style={styles.detailValue}>
                  {workoutType}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Intensity
                </Text>

                <Text style={styles.detailValue}>
                  {intensity}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  Duration
                </Text>

                <Text style={styles.detailValue}>
                  {duration} min
                </Text>
              </View>

            </View>

          </View>

        </View>

        {/* =====================================
            LOG BUTTON
        ===================================== */}

        <View style={styles.bottomContainer}>

          <Pressable
            disabled={saving}
            onPress={handleLogWorkout}
            style={({ pressed }) => [
              styles.logButton,
              pressed && !saving && styles.buttonPressed,
              saving && styles.buttonDisabled,
            ]}
          >

            {saving ? (
              <ActivityIndicator
                color={WHITE}
              />
            ) : (
              <>
                <Ionicons
                  name="flame"
                  size={21}
                  color={WHITE}
                />

                <Text style={styles.logButtonText}>
                  Log Workout
                </Text>
              </>
            )}

          </Pressable>

        </View>

      </View>
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

  header: {
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

  content: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: "center",
  },

  resultContainer: {
    alignItems: "center",
  },

  fireCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  resultLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: MUTED,
    marginBottom: 5,
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },

  calorieNumber: {
    fontSize: 64,
    lineHeight: 72,
    fontWeight: "900",
    color: DARK_GREEN,
    letterSpacing: -2,
  },

  calorieUnit: {
    fontSize: 20,
    fontWeight: "800",
    color: GREEN,
    marginLeft: 8,
  },

  detailsCard: {
    width: "100%",
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 18,
    marginTop: 35,
    borderWidth: 1,
    borderColor: BORDER,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  detailLabel: {
    fontSize: 13,
    color: MUTED,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
  },

  separator: {
    height: 1,
    backgroundColor: "#EDF0ED",
    marginVertical: 14,
  },

  bottomContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: "#E8ECE8",
  },

  logButton: {
    height: 56,
    borderRadius: 17,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

  buttonDisabled: {
    opacity: 0.65,
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