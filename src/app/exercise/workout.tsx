import { getUserProfile } from "@/lib/profileService";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";
const BACKGROUND = "#F7F8F7";
const BORDER = "#E2E8E2";

const INTENSITIES = ["Low", "Medium", "High"];
const DURATIONS = [15, 30, 60, 90];

export default function Workout() {
  const { user } = useUser();
  const params = useLocalSearchParams<{
    type?: string;
  }>();

  const workoutType =
    params.type === "weight"
      ? "Weight Lifting"
      : "Cardio";

  const description =
    params.type === "weight"
      ? "Track your gym, machine or strength workout."
      : "Track running, walking, cycling and other cardio activities.";

  const [intensity, setIntensity] = useState(1);
  const [duration, setDuration] = useState<number | null>(30);
  const [manualDuration, setManualDuration] = useState("");

  function selectDuration(value: number) {
    setDuration(value);
    setManualDuration("");
  }

  function handleManualDuration(value: string) {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, "");

    setManualDuration(numericValue);

    if (numericValue) {
      setDuration(Number(numericValue));
    } else {
      setDuration(null);
    }
  }

  function calculateCaloriesBurned(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  workoutType: string,
  intensityName: string,
  durationMinutes: number
) {
  /*
   * Mifflin-St Jeor BMR
   *
   * Male:
   * 10W + 6.25H - 5A + 5
   *
   * Female:
   * 10W + 6.25H - 5A - 161
   */

  const normalizedGender =
    gender.toLowerCase();

  const bmr =
    normalizedGender === "male"
      ? 10 * weightKg +
        6.25 * heightCm -
        5 * age +
        5
      : 10 * weightKg +
        6.25 * heightCm -
        5 * age -
        161;

  /*
   * MET estimate.
   *
   * We don't have heart-rate/GPS data,
   * so intensity is represented by MET.
   */

  let met = 1;

  if (workoutType === "Cardio") {
    if (intensityName === "Low") {
      met = 4.0;
    } else if (intensityName === "Medium") {
      met = 6.0;
    } else {
      met = 8.0;
    }
  } else {
    // Weight lifting / strength training

    if (intensityName === "Low") {
      met = 3.5;
    } else if (intensityName === "Medium") {
      met = 5.0;
    } else {
      met = 6.5;
    }
  }

  /*
   * Active calories.
   *
   * BMR gives resting calories per day.
   *
   * We subtract 1 MET because the user
   * would burn those resting calories anyway.
   */

  const activeCalories =
    (bmr / 1440) *
    (met - 1) *
    durationMinutes;

  return Math.max(
    1,
    Math.round(activeCalories)
  );
}
  async function handleContinue() {
  const finalDuration =
    manualDuration
      ? Number(manualDuration)
      : duration;

  if (!finalDuration || finalDuration <= 0) {
    return;
  }

  if (!user?.id) {
    console.log("USER NOT LOGGED IN");
    return;
  }

  try {
    console.log("LOADING USER PROFILE...");

    const profile =
      await getUserProfile(user.id);

    console.log(
      "WORKOUT PROFILE:",
      JSON.stringify(profile, null, 2)
    );

    /*
     * IMPORTANT:
     * These field names must match
     * your Firebase profile document.
     */

const weightKg = Number(
  profile?.weight ??
  profile?.weightKg ??
  0
);

// Firebase stores height as:
// height: { feet: 5, inches: 7 }

const feet = Number(profile?.height?.feet ?? 0);
const inches = Number(profile?.height?.inches ?? 0);

const heightCm =
  (feet * 12 + inches) * 2.54;

// Firebase stores DOB as:
// "28-01-2001"

const birthDate = String(
  profile?.birthDate ?? ""
);

function calculateAge(birthDate: string) {
  const [day, month, year] =
    birthDate.split("-").map(Number);

  if (!day || !month || !year) {
    return 0;
  }

  const today = new Date();

  let age =
    today.getFullYear() - year;

  const birthdayThisYear =
    new Date(
      today.getFullYear(),
      month - 1,
      day
    );

  if (today < birthdayThisYear) {
    age--;
  }

  return age;
}

const age = calculateAge(birthDate);

const gender = String(
  profile?.gender ??
  profile?.sex ??
  ""
);

console.log("FITNESS VALUES:", {
  weightKg,
  feet,
  inches,
  heightCm,
  birthDate,
  age,
  gender,
});

    if (
      !weightKg ||
      !heightCm ||
      !age ||
      !gender
    ) {
      console.log(
        "INCOMPLETE FITNESS PROFILE:",
        {
          weightKg,
          heightCm,
          age,
          gender,
        }
      );

      return;
    }

    const intensityName =
      INTENSITIES[intensity];

    const calories =
      calculateCaloriesBurned(
        weightKg,
        heightCm,
        age,
        gender,
        workoutType,
        intensityName,
        finalDuration
      );

    console.log(
      "CALORIES BURNED:",
      calories
    );

    router.push({
      pathname: "/exercise/result",
      params: {
        type:
          params.type === "weight"
            ? "weight"
            : "cardio",

        intensity:
          intensityName,

        duration:
          String(finalDuration),

        calories:
          String(calories),
      },
    });

  } catch (error) {
    console.log(
      "WORKOUT CALCULATION ERROR:",
      error
    );
  }
}

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>

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

  <View style={styles.headerText}>
    <Text style={styles.headerTitle}>
      Log Exercise
    </Text>
  </View>

  <View style={styles.headerSpacer} />
</View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* =====================================
              WORKOUT TYPE
          ===================================== */}

          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons
                name={
                  params.type === "weight"
                    ? "barbell-outline"
                    : "walk-outline"
                }
                size={29}
                color={GREEN}
              />
            </View>

            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>
                {workoutType}
              </Text>

              <Text style={styles.heroDescription}>
                {description}
              </Text>
            </View>
          </View>

          {/* =====================================
              INTENSITY
          ===================================== */}

          <Text style={styles.sectionTitle}>
            Workout Intensity
          </Text>

          <View style={styles.card}>

            <View style={styles.intensityTop}>
              <View>
                <Text style={styles.cardTitle}>
                  How hard was your workout?
                </Text>

                <Text style={styles.cardSubtitle}>
                  Choose the intensity that best matches your effort.
                </Text>
              </View>

              <View style={styles.intensityBadge}>
                <Text style={styles.intensityBadgeText}>
                  {INTENSITIES[intensity]}
                </Text>
              </View>
            </View>

            {/* Slider */}

            <View style={styles.sliderContainer}>

              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    {
                      width:
                        intensity === 0
                          ? "0%"
                          : intensity === 1
                          ? "50%"
                          : "100%",
                    },
                  ]}
                />

                {[0, 1, 2].map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => setIntensity(value)}
                    style={[
                      styles.sliderPoint,
                      {
                        left:
                          value === 0
                            ? "0%"
                            : value === 1
                            ? "50%"
                            : "100%",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.sliderDot,
                        intensity === value &&
                          styles.sliderDotActive,
                      ]}
                    />
                  </Pressable>
                ))}
              </View>

              <View style={styles.sliderLabels}>
                <Text
                  style={[
                    styles.sliderLabel,
                    intensity === 0 &&
                      styles.sliderLabelActive,
                  ]}
                >
                  Low
                </Text>

                <Text
                  style={[
                    styles.sliderLabel,
                    intensity === 1 &&
                      styles.sliderLabelActive,
                  ]}
                >
                  Medium
                </Text>

                <Text
                  style={[
                    styles.sliderLabel,
                    intensity === 2 &&
                      styles.sliderLabelActive,
                  ]}
                >
                  High
                </Text>
              </View>

            </View>
          </View>

          {/* =====================================
              DURATION
          ===================================== */}

          <Text style={styles.sectionTitle}>
            Workout Duration
          </Text>

          <View style={styles.card}>

            <Text style={styles.cardTitle}>
              How long did you exercise?
            </Text>

            <Text style={styles.cardSubtitle}>
              Select a duration or enter your own.
            </Text>

            {/* Duration Chips */}

            <View style={styles.durationGrid}>
              {DURATIONS.map((value) => {
                const selected =
                  duration === value &&
                  !manualDuration;

                return (
                  <Pressable
                    key={value}
                    onPress={() =>
                      selectDuration(value)
                    }
                    style={[
                      styles.durationChip,
                      selected &&
                        styles.durationChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        selected &&
                          styles.durationTextSelected,
                      ]}
                    >
                      {value} min
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Manual Duration */}

            <Text style={styles.manualLabel}>
              Or enter manually
            </Text>

            <View style={styles.manualInputWrapper}>
              <TextInput
                value={manualDuration}
                onChangeText={
                  handleManualDuration
                }
                placeholder="Enter duration"
                placeholderTextColor="#A5AAA6"
                keyboardType="number-pad"
                style={styles.manualInput}
              />

              <Text style={styles.manualUnit}>
                min
              </Text>
            </View>

          </View>

        </ScrollView>

        {/* =====================================
            CONTINUE
        ===================================== */}

        <View style={styles.bottomContainer}>
          <Pressable
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.continueText}>
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={20}
              color={WHITE}
            />
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

  headerText: {
    flex: 1,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
  },
  backIcon: {
  fontSize: 36,
  lineHeight: 36,
  fontWeight: "300",
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
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 120,
  },

  // ==========================================
  // HERO
  // ==========================================

  heroCard: {
    backgroundColor: LIGHT_GREEN,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D9E5DA",
    marginBottom: 25,
  },

  heroIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
  },

  heroText: {
    flex: 1,
    marginLeft: 15,
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: DARK_GREEN,
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: MUTED,
    marginTop: 4,
    paddingRight: 5,
  },

  // ==========================================
  // SECTIONS
  // ==========================================

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 11,
  },

  // ==========================================
  // CARD
  // ==========================================

  card: {
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: TEXT,
  },

  cardSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: MUTED,
    marginTop: 4,
  },

  // ==========================================
  // INTENSITY
  // ==========================================

  intensityTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  intensityBadge: {
    backgroundColor: LIGHT_GREEN,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 10,
  },

  intensityBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: GREEN,
  },

  sliderContainer: {
    marginTop: 28,
    paddingHorizontal: 5,
  },

  sliderTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: "#DDE5DE",
    position: "relative",
  },

  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: 5,
    borderRadius: 3,
    backgroundColor: GREEN,
  },

  sliderPoint: {
    position: "absolute",
    width: 30,
    height: 30,
    top: -13,
    marginLeft: -15,
    alignItems: "center",
    justifyContent: "center",
  },

  sliderDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: WHITE,
    borderWidth: 3,
    borderColor: "#CBD5CC",
  },

  sliderDotActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 5,
    borderColor: GREEN,
  },

  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  sliderLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: MUTED,
  },

  sliderLabelActive: {
    color: GREEN,
    fontWeight: "800",
  },

  // ==========================================
  // DURATION
  // ==========================================

  durationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginTop: 18,
  },

  durationChip: {
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: "#F4F6F4",
    borderWidth: 1,
    borderColor: "#E1E6E1",
  },

  durationChipSelected: {
    backgroundColor: LIGHT_GREEN,
    borderColor: GREEN,
  },

  durationText: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED,
  },

  durationTextSelected: {
    color: GREEN,
  },

  manualLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
    marginTop: 20,
    marginBottom: 7,
  },

  manualInputWrapper: {
    height: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#F8FAF8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  manualInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: TEXT,
  },

  manualUnit: {
    fontSize: 13,
    fontWeight: "800",
    color: MUTED,
  },

  // ==========================================
  // BOTTOM BUTTON
  // ==========================================

  bottomContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: BACKGROUND,
    borderTopWidth: 1,
    borderTopColor: "#E8ECE8",
  },

  continueButton: {
    height: 55,
    borderRadius: 17,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,

    shadowColor: GREEN,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  continueText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});