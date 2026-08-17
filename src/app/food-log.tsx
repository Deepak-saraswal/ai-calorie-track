import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    addDailyLog,
} from "@/lib/dailyLogService";

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
// Helpers
// ==================================================

function parseNumber(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    value = value[0];
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : 0;
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(1).replace(/\.0$/, "");
}

// ==================================================
// Component
// ==================================================

export default function LogFood() {
  const { user } = useUser();

  const params =
    useLocalSearchParams<{
      foodId?: string;
      foodName?: string;
      servingSize?: string;
      calories?: string;
      protein?: string;
      carbs?: string;
      fat?: string;
    }>();

  // ==================================================
  // Food Information
  // ==================================================

  const foodName =
    typeof params.foodName === "string"
      ? params.foodName
      : "Unknown Food";

  const servingSize =
    typeof params.servingSize === "string"
      ? params.servingSize
      : "Serving";

  // ==================================================
  // Extract serving unit
  //
  // Examples:
  // "1 cup"       -> "cup"
  // "100 g"       -> "g"
  // "1 serving"  -> "serving"
  // ==================================================

  const servingUnit = useMemo(() => {
    const value =
      servingSize.trim();

    // Remove the first numeric part.
    const unit =
      value
        .replace(
          /^[\d.,]+\s*/,
          ""
        )
        .trim();

    return unit || "serving";
  }, [servingSize]);

  // ==================================================
  // Base Nutrition
  //
  // These values represent ONE original serving.
  // ==================================================

  const baseCalories =
    parseNumber(params.calories);

  const baseProtein =
    parseNumber(params.protein);

  const baseCarbs =
    parseNumber(params.carbs);

  const baseFat =
    parseNumber(params.fat);

  // ==================================================
  // Serving Quantity
  // ==================================================

  const initialServingQuantity =
    useMemo(() => {
      const match =
        servingSize.match(
          /^[\d.,]+/
        );

      if (!match) {
        return "1";
      }

      const value =
        Number(
          match[0].replace(",", ".")
        );

      return value > 0
        ? String(value)
        : "1";
    }, [servingSize]);

  const [
    servingQuantity,
    setServingQuantity,
  ] = useState(
    initialServingQuantity
  );

  // ==================================================
  // Saving
  // ==================================================

  const [saving, setSaving] =
    useState(false);

  // ==================================================
  // Calculated Nutrition
  // ==================================================

  const quantity =
    Number(
      servingQuantity.replace(",", ".")
    ) || 0;

  const calculatedCalories =
    baseCalories * quantity;

  const calculatedProtein =
    baseProtein * quantity;

  const calculatedCarbs =
    baseCarbs * quantity;

  const calculatedFat =
    baseFat * quantity;

  // ==================================================
  // Serving Change
  // ==================================================

  function handleServingChange(
    value: string
  ) {
    // Number only.
    //
    // Allows:
    // 1
    // 2
    // 1.5
    // 0.5
    //
    // Does NOT allow:
    // 2 cups
    // 100g
    // abc

    const cleaned =
      value.replace(
        /[^0-9.]/
        ,
        ""
      );

    // Prevent multiple decimal points.
    const parts =
      cleaned.split(".");

    const finalValue =
      parts.length > 2
        ? `${parts[0]}.${parts
            .slice(1)
            .join("")}`
        : cleaned;

    setServingQuantity(
      finalValue
    );
  }

  // ==================================================
  // Log Food
  // ==================================================

  async function handleLogFood() {
    if (!user?.id) {
      console.log(
        "USER NOT AVAILABLE"
      );

      return;
    }

    if (quantity <= 0) {
      return;
    }

    try {
      setSaving(true);

      const today =
        new Date();

      await addDailyLog(
        user.id,
        today,
        {
          type: "food",

          title: foodName,

          time:
            today.toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "2-digit",
              }
            ),

          calories:
            calculatedCalories,

          protein:
            calculatedProtein,

          carbs:
            calculatedCarbs,

          fat:
            calculatedFat,

          waterMl: 0,
        }
      );

      console.log(
        "FOOD LOGGED:",
        {
          foodName,
          servingQuantity: quantity,
          servingUnit,
          calories:
            calculatedCalories,
          protein:
            calculatedProtein,
          carbs:
            calculatedCarbs,
          fat:
            calculatedFat,
        }
      );

      // Go back to Home tab.
      router.replace(
        "/tabs/home"
      );
    } catch (error) {
      console.log(
        "LOG FOOD ERROR:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // Render
  // ==================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View
          style={styles.container}
        >
          {/* =========================================
              HEADER
          ========================================= */}

          <View
            style={styles.header}
          >
            <Pressable
              style={
                styles.backButton
              }
              onPress={() => {
                if (
                  router.canGoBack()
                ) {
                  router.back();
                } else {
                  router.replace(
                    "/food-database"
                  );
                }
              }}
            >
              <Ionicons
                name="chevron-back"
                size={25}
                color={TEXT}
              />
            </Pressable>

            <Text
              style={styles.headerTitle}
            >
              Log Food
            </Text>

            <View
              style={
                styles.headerSpacer
              }
            />
          </View>

          {/* =========================================
              CONTENT
          ========================================= */}

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.content
            }
          >
            {/* =========================================
                FOOD NAME
            ========================================= */}

            <View
              style={
                styles.foodHeader
              }
            >
              <View
                style={
                  styles.foodIconLarge
                }
              >
                <Ionicons
                  name="restaurant-outline"
                  size={28}
                  color={GREEN}
                />
              </View>

              <Text
                style={styles.foodName}
              >
                {foodName}
              </Text>
            </View>

            {/* =========================================
                SERVING
            ========================================= */}

            <View
              style={
                styles.servingCard
              }
            >
              <View
                style={
                  styles.sectionHeader
                }
              >
                <View>
                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    Serving Size
                  </Text>

                  <Text
                    style={
                      styles.sectionSubtitle
                    }
                  >
                    Change the quantity
                    to update nutrition.
                  </Text>
                </View>

                <View
                  style={
                    styles.scaleIcon
                  }
                >
                  <Ionicons
                    name="scale-outline"
                    size={19}
                    color={GREEN}
                  />
                </View>
              </View>

              <View
                style={
                  styles.servingInputWrapper
                }
              >
                <TextInput
                  value={
                    servingQuantity
                  }
                  onChangeText={
                    handleServingChange
                  }
                  keyboardType="decimal-pad"
                  placeholder="1"
                  placeholderTextColor="#A5AAA6"
                  style={
                    styles.servingInput
                  }
                  selectTextOnFocus
                />

                <Text
                  style={
                    styles.servingUnit
                  }
                >
                  {servingUnit}
                </Text>
              </View>

              <Text
                style={
                  styles.baseServingText
                }
              >
                Base nutrition is for 1{" "}
                {servingUnit}.
              </Text>
            </View>

            {/* =========================================
                CALORIES
            ========================================= */}

            <View
              style={
                styles.calorieCard
              }
            >
              <View
                style={
                  styles.calorieIcon
                }
              >
                <Ionicons
                  name="flame-outline"
                  size={25}
                  color={GREEN}
                />
              </View>

              <View
                style={
                  styles.calorieContent
                }
              >
                <Text
                  style={
                    styles.calorieLabel
                  }
                >
                  Calories
                </Text>

                <Text
                  style={
                    styles.calorieValue
                  }
                >
                  {formatNumber(
                    calculatedCalories
                  )}{" "}
                  kcal
                </Text>
              </View>

              <View
                style={
                  styles.autoBadge
                }
              >
                <Ionicons
                  name="sync-outline"
                  size={13}
                  color={GREEN}
                />

                <Text
                  style={
                    styles.autoText
                  }
                >
                  Auto
                </Text>
              </View>
            </View>

            {/* =========================================
                MACROS
            ========================================= */}

            <Text
              style={
                styles.macrosTitle
              }
            >
              Nutrition
            </Text>

            <View
              style={
                styles.macroGrid
              }
            >
              {/* Protein */}

              <View
                style={
                  styles.macroCard
                }
              >
                <View
                  style={[
                    styles.macroIcon,
                    {
                      backgroundColor:
                        "#E8EFE9",
                    },
                  ]}
                >
                  <Ionicons
                    name="fitness-outline"
                    size={19}
                    color={GREEN}
                  />
                </View>

                <Text
                  style={
                    styles.macroLabel
                  }
                >
                  Protein
                </Text>

                <Text
                  style={
                    styles.macroValue
                  }
                >
                  {formatNumber(
                    calculatedProtein
                  )}
                  g
                </Text>
              </View>

              {/* Carbs */}

              <View
                style={
                  styles.macroCard
                }
              >
                <View
                  style={[
                    styles.macroIcon,
                    {
                      backgroundColor:
                        "#F0F3E9",
                    },
                  ]}
                >
                  <Ionicons
                    name="leaf-outline"
                    size={19}
                    color={GREEN}
                  />
                </View>

                <Text
                  style={
                    styles.macroLabel
                  }
                >
                  Carbs
                </Text>

                <Text
                  style={
                    styles.macroValue
                  }
                >
                  {formatNumber(
                    calculatedCarbs
                  )}
                  g
                </Text>
              </View>

              {/* Fat */}

              <View
                style={
                  styles.macroCard
                }
              >
                <View
                  style={[
                    styles.macroIcon,
                    {
                      backgroundColor:
                        "#F3F1E8",
                    },
                  ]}
                >
                  <Ionicons
                    name="water-outline"
                    size={19}
                    color={GREEN}
                  />
                </View>

                <Text
                  style={
                    styles.macroLabel
                  }
                >
                  Fat
                </Text>

                <Text
                  style={
                    styles.macroValue
                  }
                >
                  {formatNumber(
                    calculatedFat
                  )}
                  g
                </Text>
              </View>
            </View>

            {/* =========================================
                CALCULATION INFO
            ========================================= */}

            <View
              style={
                styles.infoCard
              }
            >
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={GREEN}
              />

              <Text
                style={
                  styles.infoText
                }
              >
                Nutrition values update
                automatically when you
                change the serving quantity.
              </Text>
            </View>
          </ScrollView>

          {/* =========================================
              BOTTOM LOG BUTTON
          ========================================= */}

          <View
            style={
              styles.bottomContainer
            }
          >
            <Pressable
              disabled={
                saving ||
                quantity <= 0
              }
              onPress={
                handleLogFood
              }
              style={({ pressed }) => [
                styles.logButton,
                {
                  opacity:
                    saving ||
                    quantity <= 0
                      ? 0.5
                      : pressed
                      ? 0.85
                      : 1,
                },
              ]}
            >
              {saving ? (
                <ActivityIndicator
                  size="small"
                  color={WHITE}
                />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={21}
                    color={WHITE}
                  />

                  <Text
                    style={
                      styles.logButtonText
                    }
                  >
                    Log Food
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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

  keyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  // ==================================================
  // Header
  // ==================================================

  header: {
    height: 70,
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

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: BORDER,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT,
  },

  headerSpacer: {
    width: 44,
  },

  // ==================================================
  // Content
  // ==================================================

  content: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 130,
  },

  // ==================================================
  // Food Header
  // ==================================================

  foodHeader: {
    marginBottom: 22,
  },

  foodIconLarge: {
    width: 58,
    height: 58,

    borderRadius: 19,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 15,
  },

  foodName: {
    fontSize: 30,
    lineHeight: 36,

    fontWeight: "800",

    color: TEXT,

    letterSpacing: -0.7,
  },

  // ==================================================
  // Serving
  // ==================================================

  servingCard: {
    backgroundColor: WHITE,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: BORDER,

    padding: 16,

    marginBottom: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
  },

  sectionSubtitle: {
    fontSize: 11,
    color: MUTED,
    marginTop: 4,
  },

  scaleIcon: {
    width: 38,
    height: 38,

    borderRadius: 13,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",
  },

  servingInputWrapper: {
    height: 54,

    borderWidth: 1,
    borderColor: "#DDE3DD",

    borderRadius: 15,

    backgroundColor: "#F7F9F7",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 14,
  },

  servingInput: {
    flex: 1,

    height: 54,

    fontSize: 18,
    fontWeight: "700",

    color: TEXT,

    paddingVertical: 0,
  },

  servingUnit: {
    fontSize: 14,
    fontWeight: "700",
    color: MUTED,

    marginLeft: 8,
  },

  baseServingText: {
    fontSize: 10,
    color: MUTED,
    marginTop: 7,
  },

  // ==================================================
  // Calories
  // ==================================================

  calorieCard: {
    backgroundColor: WHITE,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: BORDER,

    padding: 16,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 20,
  },

  calorieIcon: {
    width: 52,
    height: 52,

    borderRadius: 17,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",
  },

  calorieContent: {
    flex: 1,
    marginLeft: 13,
  },

  calorieLabel: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
  },

  calorieValue: {
    fontSize: 21,
    color: DARK_GREEN,
    fontWeight: "800",
    marginTop: 2,
  },

  autoBadge: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: LIGHT_GREEN,

    borderRadius: 10,

    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  autoText: {
    fontSize: 10,
    color: GREEN,
    fontWeight: "700",
    marginLeft: 4,
  },

  // ==================================================
  // Macros
  // ==================================================

  macrosTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT,

    marginBottom: 11,
  },

  macroGrid: {
    flexDirection: "row",
    gap: 9,

    marginBottom: 14,
  },

  macroCard: {
    flex: 1,

    backgroundColor: WHITE,

    borderRadius: 17,

    borderWidth: 1,
    borderColor: BORDER,

    padding: 12,

    minHeight: 125,
  },

  macroIcon: {
    width: 38,
    height: 38,

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 9,
  },

  macroLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "600",
  },

  macroValue: {
    fontSize: 17,
    color: DARK_GREEN,
    fontWeight: "800",

    marginTop: 4,
  },

  // ==================================================
  // Info
  // ==================================================

  infoCard: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: LIGHT_GREEN,

    borderRadius: 15,

    padding: 13,

    borderWidth: 1,
    borderColor: "#DCE7DD",
  },

  infoText: {
    flex: 1,

    fontSize: 11,
    lineHeight: 17,

    color: DARK_GREEN,

    marginLeft: 8,
  },

  // ==================================================
  // Bottom
  // ==================================================

  bottomContainer: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: WHITE,

    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 24 : 14,

    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  logButton: {
    height: 54,

    borderRadius: 17,

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
});