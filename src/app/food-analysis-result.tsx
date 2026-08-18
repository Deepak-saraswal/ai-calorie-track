import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

// ==================================================
// Colors
// ==================================================

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";
const BACKGROUND = "#F7F8F7";
const BORDER = "#E5EAE5";

// ==================================================
// Types
// ==================================================

interface FoodResult {
  foodName: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ==================================================
// Helpers
// ==================================================

function formatNumber(value: number) {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return Number(value.toFixed(1)).toString();
}

// ==================================================
// Component
// ==================================================

export default function FoodResult() {
  const params = useLocalSearchParams<{
    foodData?: string;
  }>();

  console.log("📥 FOOD RESULT PARAMS:", params);
  console.log("📥 FOOD DATA:", params.foodData);

  // ==================================================
  // Parse Gemini response
  // ==================================================

  let food: FoodResult | null = null;

  try {
    if (params.foodData) {
      const foodData = Array.isArray(params.foodData)
        ? params.foodData[0]
        : params.foodData;

      food = JSON.parse(foodData);

      console.log("🍎 PARSED FOOD:", food);
    }
  } catch (error) {
    console.log(
      "❌ Failed to parse food result:",
      error
    );
  }

  // ==================================================
  // Back
  // ==================================================

  function handleBack() {
    console.log("⬅️ FOOD RESULT BACK PRESSED");

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/tabs/add");
    }
  }

  // ==================================================
  // Log Food
  // ==================================================

  function handleLogFood() {
    console.log("=================================");
    console.log("🍽️ LOG FOOD PRESSED");
    console.log("=================================");

    if (!food) {
      console.log(
        "❌ Cannot log food: food result is missing"
      );

      return;
    }

    console.log(
      "🍎 Food being sent to food-log:",
      food
    );

    /*
     * This follows the SAME parameter structure
     * used by food-database/index.tsx.
     */

    const foodParams = {
      foodName: food.foodName || "Unknown Food",

      servingSize:
        food.servingSize || "Serving unavailable",

      calories: String(food.calories ?? 0),

      protein: String(food.protein ?? 0),

      carbs: String(food.carbs ?? 0),

      fat: String(food.fat ?? 0),
    };

    console.log(
      "📦 FOOD LOG PARAMS:",
      foodParams
    );

    try {
      router.push({
        pathname: "/food-log",
        params: foodParams,
      });

      console.log(
        "✅ Navigated to /food-log"
      );
    } catch (error) {
      console.log(
        "❌ FOOD LOG NAVIGATION ERROR:",
        error
      );
    }
  }

  // ==================================================
  // Invalid result
  // ==================================================

  if (!food) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={34}
              color={GREEN}
            />
          </View>

          <Text style={styles.errorTitle}>
            Unable to load food result
          </Text>

          <Text style={styles.errorText}>
            The food analysis result could not
            be loaded.
          </Text>

          <Pressable
            style={styles.backButtonLarge}
            onPress={() => {
              router.replace("/tabs/add");
            }}
          >
            <Text style={styles.backButtonText}>
              Back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ==================================================
  // Render
  // ==================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>

        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={handleBack}
          >
            <Ionicons
              name="chevron-back"
              size={25}
              color={TEXT}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Food Analysis
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* ==================================================
            CONTENT
        ================================================== */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >

          {/* ==================================================
              SUCCESS HEADER
          ================================================== */}

          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons
                name="checkmark"
                size={27}
                color={WHITE}
              />
            </View>

            <View style={styles.successTextContainer}>
              <Text style={styles.successTitle}>
                Food identified
              </Text>

              <Text style={styles.successSubtitle}>
                Here's the nutrition information
                estimated from your image.
              </Text>
            </View>
          </View>

          {/* ==================================================
              FOOD NAME
          ================================================== */}

          <View style={styles.foodCard}>
            <View style={styles.foodIcon}>
              <Ionicons
                name="restaurant-outline"
                size={28}
                color={GREEN}
              />
            </View>

            <Text style={styles.foodName}>
              {food.foodName}
            </Text>

            <View style={styles.servingRow}>
              <Ionicons
                name="scale-outline"
                size={17}
                color={MUTED}
              />

              <Text style={styles.servingLabel}>
                Serving
              </Text>

              <Text style={styles.servingValue}>
                {food.servingSize}
              </Text>
            </View>
          </View>

          {/* ==================================================
              CALORIES
          ================================================== */}

          <View style={styles.calorieCard}>
            <View style={styles.calorieIcon}>
              <Ionicons
                name="flame-outline"
                size={27}
                color={GREEN}
              />
            </View>

            <View style={styles.calorieContent}>
              <Text style={styles.calorieLabel}>
                Calories
              </Text>

              <View style={styles.calorieValueRow}>
                <Text style={styles.calorieValue}>
                  {formatNumber(food.calories)}
                </Text>

                <Text style={styles.calorieUnit}>
                  kcal
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================================
              MACROS
          ================================================== */}

          <Text style={styles.sectionTitle}>
            Nutrition
          </Text>

          <View style={styles.macrosContainer}>

            {/* Protein */}

            <View style={styles.macroCard}>
              <View
                style={[
                  styles.macroIcon,
                  styles.proteinIcon,
                ]}
              >
                <Ionicons
                  name="fitness-outline"
                  size={21}
                  color={GREEN}
                />
              </View>

              <Text style={styles.macroLabel}>
                Protein
              </Text>

              <View style={styles.macroValueRow}>
                <Text style={styles.macroValue}>
                  {formatNumber(food.protein)}
                </Text>

                <Text style={styles.macroUnit}>
                  g
                </Text>
              </View>
            </View>

            {/* Carbs */}

            <View style={styles.macroCard}>
              <View
                style={[
                  styles.macroIcon,
                  styles.carbsIcon,
                ]}
              >
                <Ionicons
                  name="leaf-outline"
                  size={21}
                  color={GREEN}
                />
              </View>

              <Text style={styles.macroLabel}>
                Carbs
              </Text>

              <View style={styles.macroValueRow}>
                <Text style={styles.macroValue}>
                  {formatNumber(food.carbs)}
                </Text>

                <Text style={styles.macroUnit}>
                  g
                </Text>
              </View>
            </View>

            {/* Fat */}

            <View style={styles.macroCard}>
              <View
                style={[
                  styles.macroIcon,
                  styles.fatIcon,
                ]}
              >
                <Ionicons
                  name="water-outline"
                  size={21}
                  color={GREEN}
                />
              </View>

              <Text style={styles.macroLabel}>
                Fat
              </Text>

              <View style={styles.macroValueRow}>
                <Text style={styles.macroValue}>
                  {formatNumber(food.fat)}
                </Text>

                <Text style={styles.macroUnit}>
                  g
                </Text>
              </View>
            </View>
          </View>

          {/* ==================================================
              AI NOTE
          ================================================== */}

          <View style={styles.noteCard}>
            <View style={styles.noteIcon}>
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={GREEN}
              />
            </View>

            <View style={styles.noteContent}>
              <Text style={styles.noteTitle}>
                AI estimated nutrition
              </Text>

              <Text style={styles.noteText}>
                Nutrition values are estimates based
                on the food identified in your image.
              </Text>
            </View>
          </View>

        </ScrollView>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.logButton,
              {
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={handleLogFood}
          >
            <Ionicons
              name="add-circle-outline"
              size={21}
              color={WHITE}
            />

            <Text style={styles.logButtonText}>
              Log Food
            </Text>
          </Pressable>
        </View>

      </View>
    </SafeAreaView>
  );
}

// ==================================================
// Styles
// ==================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  screen: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  // ==================================================
  // Header
  // ==================================================

  header: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: WHITE,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F1F3F1",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "800",
    color: TEXT,
  },

  headerSpacer: {
    width: 42,
  },

  // ==================================================
  // Content
  // ==================================================

  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 120,
  },

  // ==================================================
  // Success
  // ==================================================

  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  successIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  successTextContainer: {
    flex: 1,
    marginLeft: 13,
  },

  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
  },

  successSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: MUTED,
    marginTop: 3,
  },

  // ==================================================
  // Food Card
  // ==================================================

  foodCard: {
    backgroundColor: WHITE,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
  },

  foodIcon: {
    width: 54,
    height: 54,
    borderRadius: 17,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  foodName: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "800",
    color: TEXT,
    marginTop: 14,
  },

  servingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  servingLabel: {
    fontSize: 12,
    color: MUTED,
    marginLeft: 5,
  },

  servingValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
    marginLeft: 5,
  },

  // ==================================================
  // Calories
  // ==================================================

  calorieCard: {
    marginTop: 14,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  calorieIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  calorieContent: {
    marginLeft: 13,
  },

  calorieLabel: {
    fontSize: 12,
    color: MUTED,
  },

  calorieValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
  },

  calorieValue: {
    fontSize: 28,
    fontWeight: "800",
    color: TEXT,
  },

  calorieUnit: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    marginLeft: 5,
  },

  // ==================================================
  // Nutrition
  // ==================================================

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT,
    marginTop: 22,
    marginBottom: 12,
  },

  macrosContainer: {
    flexDirection: "row",
    gap: 10,
  },

  macroCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 13,
  },

  macroIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  proteinIcon: {
    backgroundColor: LIGHT_GREEN,
  },

  carbsIcon: {
    backgroundColor: LIGHT_GREEN,
  },

  fatIcon: {
    backgroundColor: LIGHT_GREEN,
  },

  macroLabel: {
    fontSize: 11,
    color: MUTED,
    marginTop: 9,
  },

  macroValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
  },

  macroValue: {
    fontSize: 19,
    fontWeight: "800",
    color: TEXT,
  },

  macroUnit: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,
    marginLeft: 3,
  },

  // ==================================================
  // AI Note
  // ==================================================

  noteCard: {
    marginTop: 18,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 15,
    flexDirection: "row",
  },

  noteIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  noteContent: {
    flex: 1,
    marginLeft: 11,
  },

  noteTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: TEXT,
  },

  noteText: {
    fontSize: 11,
    lineHeight: 17,
    color: MUTED,
    marginTop: 3,
  },

  // ==================================================
  // Footer
  // ==================================================

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  logButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  logButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: WHITE,
  },

  // ==================================================
  // Error
  // ==================================================

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT,
    marginTop: 15,
    textAlign: "center",
  },

  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: MUTED,
    marginTop: 7,
    textAlign: "center",
  },

  backButtonLarge: {
    marginTop: 22,
    minWidth: 120,
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 15,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
  },
});