import { useUser } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { addDailyLog } from "@/lib/dailyLogService";

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";
const BACKGROUND = "#F7F8F7";
const BORDER = "#E5EAE5";

// ==================================================
// Glass configuration
// ==================================================

// Every + adds 125ml
const ML_PER_STEP = 125;

// Maximum = 4 full glasses = 1000ml
const MAX_ML = 1000;

export default function WaterIntake() {
  const { user } = useUser();

  const [waterMl, setWaterMl] = useState(0);
  const [saving, setSaving] = useState(false);

  // ==================================================
  // Increase water
  // ==================================================

  function increaseWater() {
    setWaterMl((current) => {
      if (current >= MAX_ML) {
        return current;
      }

      return Math.min(
        current + ML_PER_STEP,
        MAX_ML
      );
    });
  }

  // ==================================================
  // Decrease water
  // ==================================================

  function decreaseWater() {
    setWaterMl((current) => {
      if (current <= 0) {
        return 0;
      }

      return Math.max(
        current - ML_PER_STEP,
        0
      );
    });
  }

  // ==================================================
  // Get glass images
  //
  // 0ml     -> empty
  // 125ml   -> half
  // 250ml   -> full
  // 375ml   -> full + half
  // 500ml   -> full + full
  // ...
  // 1000ml  -> 4 full
  // ==================================================

  function getGlassImages() {
    const fullGlasses = Math.floor(
      waterMl / 250
    );

    const remainder = waterMl % 250;

    const images: any[] = [];

    // Full glasses
    for (let i = 0; i < fullGlasses; i++) {
      images.push(
        require("@/assets/images/full_glass.png")
      );
    }

    // Half glass
    if (remainder === 125) {
      images.push(
        require("@/assets/images/half_glass.png")
      );
    }

    // Empty state
    if (waterMl === 0) {
      images.push(
        require("@/assets/images/empty_glass.png")
      );
    }

    return images;
  }

  // ==================================================
  // Save water
  // ==================================================

  async function handleLogWater() {
    if (!user?.id) {
      console.log("No Clerk user found");
      return;
    }

    if (waterMl <= 0) {
      console.log("Please add some water first");
      return;
    }

    try {
      setSaving(true);

      const today = new Date();

      await addDailyLog(
        user.id,
        today,
        {
          type: "water",

          title: "Water",

          time: today.toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
            }
          ),

          // No calories for water
          calories: 0,

          protein: 0,

          fat: 0,

          carbs: 0,

          waterMl: waterMl,
        }
      );

      console.log(
        "💧 WATER SAVED:",
        waterMl,
        "ml"
      );

      // Go back to Add screen
      router.push("/tabs/add");
    } catch (error) {
      console.log(
        "❌ SAVE WATER ERROR:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  const glassImages = getGlassImages();

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
              if (!saving) {
                router.back();
              }
            }}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>
              ‹
            </Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Add Water Intake
          </Text>

          {/* Keeps title centered */}
          <View style={styles.headerSpacer} />

        </View>

        {/* =========================================
            TITLE
        ========================================= */}

        <View style={styles.titleSection}>

          <Text style={styles.title}>
            Add Water Intake
          </Text>

          <Text style={styles.subtitle}>
            Stay hydrated throughout the day.
          </Text>

        </View>

        {/* =========================================
            GLASSES
        ========================================= */}

        <View style={styles.glassSection}>

          <View style={styles.glassContainer}>

            {glassImages.map(
              (image, index) => (
                <Image
                  key={index}
                  source={image}
                  resizeMode="contain"
                  style={styles.glassImage}
                />
              )
            )}

          </View>

          {/* =======================================
              TOTAL ML
          ======================================= */}

          <View style={styles.amountContainer}>

            <Text style={styles.amount}>
              {waterMl}
            </Text>

            <Text style={styles.amountUnit}>
              ml
            </Text>

          </View>

          <Text style={styles.amountDescription}>
            {waterMl === 0
              ? "No water added"
              : `${waterMl} ml of water`}
          </Text>

        </View>

        {/* =========================================
            + / -
        ========================================= */}

        <View style={styles.controls}>

          {/* MINUS */}

          <TouchableOpacity
            activeOpacity={0.75}
            disabled={
              waterMl === 0 || saving
            }
            onPress={decreaseWater}
            style={[
              styles.controlButton,
              waterMl === 0 &&
                styles.disabledButton,
            ]}
          >
            <Text
              style={[
                styles.controlText,
                waterMl === 0 &&
                  styles.disabledControlText,
              ]}
            >
              −
            </Text>
          </TouchableOpacity>

          {/* STEP */}

          <View style={styles.stepContainer}>

            <Text style={styles.stepText}>
              125 ml
            </Text>

            <Text style={styles.stepSubtext}>
              per press
            </Text>

          </View>

          {/* PLUS */}

          <TouchableOpacity
            activeOpacity={0.75}
            disabled={
              waterMl >= MAX_ML ||
              saving
            }
            onPress={increaseWater}
            style={[
              styles.controlButton,
              waterMl >= MAX_ML &&
                styles.disabledButton,
            ]}
          >
            <Text
              style={[
                styles.controlText,
                waterMl >= MAX_ML &&
                  styles.disabledControlText,
              ]}
            >
              +
            </Text>
          </TouchableOpacity>

        </View>

        {/* =========================================
            LOG WATER
        ========================================= */}

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={
            waterMl === 0 || saving
          }
          onPress={handleLogWater}
          style={[
            styles.logButton,
            waterMl === 0 &&
              styles.logButtonDisabled,
          ]}
        >
          {saving ? (
            <ActivityIndicator
              size="small"
              color={WHITE}
            />
          ) : (
            <Text
              style={[
                styles.logButtonText,
                waterMl === 0 &&
                  styles.logButtonTextDisabled,
              ]}
            >
              Log Water
            </Text>
          )}
        </TouchableOpacity>

        {/* =========================================
            INFO
        ========================================= */}

        <View style={styles.infoCard}>

          <Text style={styles.infoTitle}>
            💧 Hydration
          </Text>

          <Text style={styles.infoText}>
            Add water in 125 ml increments.
            One full glass contains 250 ml.
          </Text>

        </View>

      </View>
    </SafeAreaView>
  );
}

// ==================================================
// Styles
// ==================================================

const styles = StyleSheet.create({

  // ==================================================
  // Screen
  // ==================================================

  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  // ==================================================
  // Header
  // ==================================================

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
    borderColor: BORDER,

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

  // ==================================================
  // Title
  // ==================================================

  titleSection: {
    marginTop: 28,
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    lineHeight: 37,

    fontWeight: "800",

    color: TEXT,

    letterSpacing: -0.8,

    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,

    lineHeight: 21,

    color: MUTED,

    marginTop: 7,

    textAlign: "center",
  },

  // ==================================================
  // Glass
  // ==================================================

  glassSection: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",
  },

  glassContainer: {
    minHeight: 270,

    width: "100%",

    flexDirection: "row",

    flexWrap: "wrap",

    alignItems: "flex-end",

    justifyContent: "center",

    gap: 8,

    paddingHorizontal: 10,
  },

  glassImage: {
    width: 110,
    height: 230,
  },

  // ==================================================
  // Amount
  // ==================================================

  amountContainer: {
    flexDirection: "row",

    alignItems: "baseline",

    justifyContent: "center",

    marginTop: 15,
  },

  amount: {
    fontSize: 42,

    lineHeight: 48,

    fontWeight: "800",

    color: DARK_GREEN,

    letterSpacing: -1,
  },

  amountUnit: {
    fontSize: 18,

    fontWeight: "700",

    color: GREEN,

    marginLeft: 5,
  },

  amountDescription: {
    fontSize: 13,

    color: MUTED,

    marginTop: 3,
  },

  // ==================================================
  // Controls
  // ==================================================

  controls: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 24,
  },

  controlButton: {
    width: 58,
    height: 58,

    borderRadius: 20,

    backgroundColor: WHITE,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: BORDER,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  controlText: {
    fontSize: 32,

    lineHeight: 35,

    fontWeight: "500",

    color: GREEN,
  },

  disabledButton: {
    backgroundColor: "#EEF1EE",

    borderColor: "#E2E6E2",
  },

  disabledControlText: {
    color: "#AEB5AE",
  },

  stepContainer: {
    width: 95,

    alignItems: "center",

    justifyContent: "center",
  },

  stepText: {
    fontSize: 14,

    fontWeight: "800",

    color: TEXT,
  },

  stepSubtext: {
    fontSize: 11,

    color: MUTED,

    marginTop: 2,
  },

  // ==================================================
  // Log Button
  // ==================================================

  logButton: {
    height: 54,

    borderRadius: 17,

    backgroundColor: GREEN,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: GREEN,
    shadowOpacity: 0.2,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 4,
  },

  logButtonDisabled: {
    backgroundColor: "#DDE4DE",

    shadowOpacity: 0,

    elevation: 0,
  },

  logButtonText: {
    fontSize: 15,

    fontWeight: "800",

    color: WHITE,
  },

  logButtonTextDisabled: {
    color: "#8D968E",
  },

  // ==================================================
  // Info
  // ==================================================

  infoCard: {
    flexDirection: "row",

    backgroundColor: LIGHT_GREEN,

    borderRadius: 18,

    padding: 14,

    marginTop: 14,

    marginBottom: 20,

    borderWidth: 1,

    borderColor: "#DCE7DD",
  },

  infoTitle: {
    fontSize: 13,

    fontWeight: "800",

    color: DARK_GREEN,

    marginRight: 8,
  },

  infoText: {
    flex: 1,

    fontSize: 11.5,

    lineHeight: 17,

    color: MUTED,
  },
});