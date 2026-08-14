import {
  RunningShoesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/colors";

const GREEN = Colors.primary;
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";

export default function LogExercise() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* =========================================
            HEADER
        ========================================= */}

        <View style={styles.header}>

       <TouchableOpacity
  activeOpacity={0.7}
  onPress={() => {
    console.log("🔥 BACK PRESSED");
    
    if (router.canGoBack()) {
      console.log("➡️ Going back");
      router.push("/tabs/add"); // Navigate to the Add tab
    } //else {
      //console.log("➡️ No history, going to Add");
    //  router.back(); // This will navigate to the previous screen if available
    //}
  }}
  style={styles.backButton}
>
  <Text style={styles.backArrow}>‹</Text>
</TouchableOpacity>

          <Text style={styles.headerTitle}>
            Log Exercise
          </Text>

          {/* Keeps title centered */}
          <View style={styles.headerSpacer} />

        </View>

        {/* =========================================
            TITLE / HERO
        ========================================= */}

        <View style={styles.titleSection}>

          <View style={styles.titleIcon}>
            <HugeiconsIcon
              icon={RunningShoesIcon}
              size={27}
              color={GREEN}
            />
          </View>

          <Text style={styles.title}>
            Log Exercise
          </Text>

          <Text style={styles.subtitle}>
            Choose how you want to track your workout.
          </Text>

        </View>

        {/* =========================================
            OPTIONS
        ========================================= */}

        <View style={styles.optionsContainer}>

          {/* RUN / CARDIO */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.optionCard}
            onPress={() => {
              console.log("🏃 RUN PRESSED");

              router.push({
                pathname: "/exercise/workout",
                params: {
                  type: "cardio",
                },
              });
            }}
          >

            <View style={styles.iconContainer}>
              <HugeiconsIcon
                icon={RunningShoesIcon}
                size={27}
                color={GREEN}
              />
            </View>

            <View style={styles.optionContent}>

              <Text style={styles.optionTitle}>
                Run
              </Text>

              <Text style={styles.optionDescription}>
                Running, walking, cycling and other cardio activities.
              </Text>

            </View>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>

          {/* =========================================
              WEIGHT LIFTING
          ========================================= */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.optionCard}
            onPress={() => {
              console.log("🏋️ WEIGHT LIFTING PRESSED");

              router.push({
                pathname: "/exercise/workout",
                params: {
                  type: "weight",
                },
              });
            }}
          >

            <View style={styles.iconContainer}>
              <Text style={styles.dumbbellIcon}>
                🏋️
              </Text>
            </View>

            <View style={styles.optionContent}>

              <Text style={styles.optionTitle}>
                Weight Lifting
              </Text>

              <Text style={styles.optionDescription}>
                Gym workouts, free weights, machines and strength training.
              </Text>

            </View>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>

          {/* =========================================
              MANUAL
          ========================================= */}

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.optionCard}
            onPress={() => {
              console.log("✏️ MANUAL PRESSED");

              router.push("/exercise/manual");
            }}
          >

            <View style={styles.iconContainer}>
              <Text style={styles.manualIcon}>
                ✎
              </Text>
            </View>

            <View style={styles.optionContent}>

              <Text style={styles.optionTitle}>
                Manual
              </Text>

              <Text style={styles.optionDescription}>
                Enter the calories burned manually for your exercise.
              </Text>

            </View>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // =========================================
  // SCREEN
  // =========================================

  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F7",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  // =========================================
  // HEADER
  // =========================================

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 48,
    height: 48,
    borderRadius: 15,

    backgroundColor: WHITE,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E5E9E5",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  backArrow: {
    fontSize: 38,
    lineHeight: 40,
    fontWeight: "300",
    color: TEXT,

    marginTop: -4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
  },

  headerSpacer: {
    width: 48,
  },

  // =========================================
  // TITLE
  // =========================================

  titleSection: {
    marginTop: 24,
    marginBottom: 28,
  },

  titleIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,
  },

  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: TEXT,

    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: MUTED,

    marginTop: 8,

    maxWidth: 320,
  },

  // =========================================
  // OPTIONS
  // =========================================

  optionsContainer: {
    gap: 14,
  },

  optionCard: {
    minHeight: 112,

    backgroundColor: WHITE,

    borderRadius: 22,

    paddingHorizontal: 16,
    paddingVertical: 16,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E7EBE7",

    shadowColor: "#000",
    shadowOpacity: 0.055,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 2,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 19,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 15,
  },

  dumbbellIcon: {
    fontSize: 27,
  },

  manualIcon: {
    fontSize: 32,
    color: GREEN,
    fontWeight: "600",
  },

  optionContent: {
    flex: 1,
    paddingRight: 8,
  },

  optionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT,

    marginBottom: 5,
  },

  optionDescription: {
    fontSize: 12.5,
    lineHeight: 18,
    color: MUTED,
  },

  arrow: {
    fontSize: 28,
    fontWeight: "300",
    color: "#A0A6A1",

    marginLeft: 4,
  },
});