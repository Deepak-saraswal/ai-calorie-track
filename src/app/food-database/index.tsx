import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    FatSecretFood,
    searchFoods,
} from "@/lib/fatsecret";

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

function getDescription(
  food: FatSecretFood
): string {
  return (
    food.food_description ||
    ""
  );
}

function getNutrition(
  food: FatSecretFood
) {
  const description =
    getDescription(food);

  const calories =
    description.match(
      /Calories:\s*([\d.]+)kcal/i
    )?.[1];

  const fat =
    description.match(
      /Fat:\s*([\d.]+)g/i
    )?.[1];

  const carbs =
    description.match(
      /Carbs:\s*([\d.]+)g/i
    )?.[1];

  const protein =
    description.match(
      /Protein:\s*([\d.]+)g/i
    )?.[1];

  const serving =
    description
      .split("-")[0]
      ?.trim();

  return {
    calories:
      calories
        ? `${calories} kcal`
        : "--",

    fat:
      fat
        ? `${fat}g`
        : "--",

    carbs:
      carbs
        ? `${carbs}g`
        : "--",

    protein:
      protein
        ? `${protein}g`
        : "--",

    serving:
      serving ||
      "Serving unavailable",
  };
}

// ==================================================
// Component
// ==================================================

export default function FoodDatabase() {
  const [searchText, setSearchText] =
    React.useState("");

  const [foods, setFoods] =
    React.useState<FatSecretFood[]>([]);

  const [loading, setLoading] =
    React.useState(false);

  const [error, setError] =
    React.useState("");

  // ==================================================
  // Search
  // ==================================================

  async function handleSearch(
    value: string
  ) {
    setSearchText(value);

    const trimmed =
      value.trim();

    setError("");

    if (trimmed.length < 3) {
      setFoods([]);
      return;
    }

    try {
      setLoading(true);

      const results =
        await searchFoods(trimmed);

      setFoods(
        results.slice(0, 5)
      );
    } catch (error) {
      console.log(
        "FOOD SEARCH ERROR:",
        error
      );

      setFoods([]);

      setError(
        "Unable to search food. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // Food Card
  // ==================================================

  function renderFood({
    item,
  }: {
    item: FatSecretFood;
  }) {
    const nutrition =
      getNutrition(item);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.foodCard,
          {
            transform: [
              {
                scale: pressed
                  ? 0.985
                  : 1,
              },
            ],
          },
        ]}
        onPress={() => {
  const nutrition = getNutrition(item);

  router.push({
    pathname: "/food-log",
    params: {
      foodId: item.food_id || "",
      foodName: item.food_name || "Unknown Food",
      servingSize: nutrition.serving,
      calories: nutrition.calories.replace(" kcal", ""),
      protein: nutrition.protein.replace("g", ""),
      carbs: nutrition.carbs.replace("g", ""),
      fat: nutrition.fat.replace("g", ""),
    },
  });
}}
      >
        {/* =========================================
            LEFT FOOD ICON
        ========================================= */}

        <View
          style={styles.foodIcon}
        >
          <Ionicons
            name="restaurant-outline"
            size={21}
            color={GREEN}
          />
        </View>

        {/* =========================================
            FOOD CONTENT
        ========================================= */}

        <View
          style={styles.foodContent}
        >
          {/* Food name */}

          <Text
            style={styles.foodName}
            numberOfLines={2}
          >
            {item.food_name ||
              "Unknown Food"}
          </Text>

          {/* Brand */}

          {item.brand_name ? (
            <Text
              style={styles.brandName}
              numberOfLines={1}
            >
              {item.brand_name}
            </Text>
          ) : null}

          {/* Serving */}

          <View
            style={styles.servingRow}
          >
            <Ionicons
              name="scale-outline"
              size={13}
              color={MUTED}
            />

            <Text
              style={styles.serving}
              numberOfLines={1}
            >
              {nutrition.serving}
            </Text>
          </View>

          {/* Nutrition */}

          <View
            style={styles.nutritionRow}
          >
            <View
              style={
                styles.calorieBadge
              }
            >
              <Text
                style={
                  styles.calorieText
                }
              >
                {nutrition.calories}
              </Text>
            </View>

            <Text
              style={styles.nutritionText}
            >
              Protein{" "}
              {nutrition.protein}
            </Text>

            <Text
              style={styles.dot}
            >
              •
            </Text>

            <Text
              style={styles.nutritionText}
            >
              Carbs{" "}
              {nutrition.carbs}
            </Text>

            <Text
              style={styles.dot}
            >
              •
            </Text>

            <Text
              style={styles.nutritionText}
            >
              Fat{" "}
              {nutrition.fat}
            </Text>
          </View>
        </View>

        {/* =========================================
            ADD BUTTON
        ========================================= */}

        <View
          style={styles.addButton}
        >
          <Ionicons
            name="add"
            size={22}
            color={WHITE}
          />
        </View>
      </Pressable>
    );
  }

  // ==================================================
  // Render
  // ==================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
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
            style={styles.backButton}
            onPress={() => {
              if (
                router.canGoBack()
              ) {
                router.back();
              } else {
                router.replace(
                  "/tabs/add"
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
        </View>

        {/* =========================================
            TITLE
        ========================================= */}

        <View
          style={styles.titleSection}
        >
          <Text
            style={styles.title}
          >
            Add Food
          </Text>

          <Text
            style={styles.subtitle}
          >
            Search the food database
            and add what you ate.
          </Text>
        </View>

        {/* =========================================
            SEARCH BAR
        ========================================= */}

        <View
          style={styles.searchWrapper}
        >
          <Ionicons
            name="search-outline"
            size={21}
            color={MUTED}
          />

          <TextInput
            value={searchText}
            onChangeText={
              handleSearch
            }
            placeholder="Search food"
            placeholderTextColor="#A5AAA6"
            style={styles.searchInput}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />

          {searchText.length >
            0 && (
            <Pressable
              onPress={() => {
                setSearchText("");
                setFoods([]);
                setError("");
              }}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color="#A5AAA6"
              />
            </Pressable>
          )}
        </View>

        {/* =========================================
            SEARCH HINT
        ========================================= */}

        {searchText.trim()
          .length < 3 && (
          <Text
            style={styles.searchHint}
          >
            Enter at least 3
            characters to search.
          </Text>
        )}

        {/* =========================================
            LOADING
        ========================================= */}

        {loading && (
          <View
            style={styles.loading}
          >
            <ActivityIndicator
              size="small"
              color={GREEN}
            />

            <Text
              style={styles.loadingText}
            >
              Searching foods...
            </Text>
          </View>
        )}

        {/* =========================================
            ERROR
        ========================================= */}

        {!loading &&
          error !== "" && (
            <View
              style={
                styles.errorContainer
              }
            >
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={GREEN}
              />

              <Text
                style={styles.errorText}
              >
                {error}
              </Text>
            </View>
          )}

        {/* =========================================
            FOOD RESULTS
        ========================================= */}

        <FlatList
          data={foods}
          keyExtractor={(
            item,
            index
          ) =>
            item.food_id ||
            `${item.food_name}-${index}`
          }
          renderItem={
            renderFood
          }
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.listContent
          }
          ListHeaderComponent={
            foods.length > 0 ? (
              <View
                style={
                  styles.resultsHeader
                }
              >
                <Text
                  style={
                    styles.resultsTitle
                  }
                >
                  Search Results
                </Text>

                <Text
                  style={
                    styles.resultsCount
                  }
                >
                  {foods.length}
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading &&
            !error &&
            searchText.trim()
              .length >= 3 ? (
              <View
                style={
                  styles.emptyContainer
                }
              >
                <View
                  style={
                    styles.emptyIcon
                  }
                >
                  <Ionicons
                    name="search-outline"
                    size={30}
                    color={MUTED}
                  />
                </View>

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No food found
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Try searching for
                  another food.
                </Text>
              </View>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

// ==================================================
// Styles
// ==================================================

const styles =
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor:
        BACKGROUND,
    },

    container: {
        marginTop: 40,
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 20,
    },

    // ==================================================
    // HEADER
    // ==================================================

    header: {
      height: 52,
      flexDirection: "row",
      alignItems: "center",
    },

    backButton: {
      width: 44,
      height: 44,
      borderRadius: 14,

      backgroundColor:
        WHITE,

      alignItems: "center",
      justifyContent:
        "center",

      borderWidth: 1,
      borderColor: BORDER,
    },

    // ==================================================
    // TITLE
    // ==================================================

    titleSection: {
      marginTop: 20,
      marginBottom: 20,
    },

    title: {
      fontSize: 30,
      lineHeight: 36,
      fontWeight: "800",
      color: TEXT,
      letterSpacing: -0.8,
    },

    subtitle: {
      fontSize: 13,
      lineHeight: 19,
      color: MUTED,
      marginTop: 6,
    },

    // ==================================================
    // SEARCH
    // ==================================================

    searchWrapper: {
      height: 54,

      flexDirection: "row",
      alignItems: "center",

      backgroundColor:
        WHITE,

      borderRadius: 17,

      borderWidth: 1,
      borderColor: BORDER,

      paddingHorizontal: 15,
    },

    searchInput: {
      flex: 1,

      height: 54,

      marginLeft: 10,

      fontSize: 15,
      color: TEXT,
    },

    searchHint: {
      fontSize: 11,
      color: MUTED,
      marginTop: 8,
      marginLeft: 4,
    },

    // ==================================================
    // LOADING
    // ==================================================

    loading: {
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      paddingVertical: 20,
    },

    loadingText: {
      marginLeft: 8,
      fontSize: 12,
      color: MUTED,
    },

    // ==================================================
    // ERROR
    // ==================================================

    errorContainer: {
      flexDirection:
        "row",
      alignItems:
        "center",

      backgroundColor:
        LIGHT_GREEN,

      borderRadius: 15,

      padding: 14,

      marginTop: 14,
    },

    errorText: {
      flex: 1,
      marginLeft: 9,
      fontSize: 12,
      color: DARK_GREEN,
    },

    // ==================================================
    // RESULTS
    // ==================================================

    listContent: {
      paddingTop: 20,
      paddingBottom: 40,
    },

    resultsHeader: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 12,
    },

    resultsTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: TEXT,
    },

    resultsCount: {
      marginLeft: 8,

      minWidth: 24,
      height: 24,

      paddingHorizontal: 7,

      borderRadius: 12,

      backgroundColor:
        LIGHT_GREEN,

      color: DARK_GREEN,

      textAlign:
        "center",

      textAlignVertical:
        "center",

      fontSize: 11,
      fontWeight: "800",
    },

    // ==================================================
    // FOOD CARD
    // ==================================================

    foodCard: {
      minHeight: 118,

      backgroundColor:
        WHITE,

      borderRadius: 19,

      borderWidth: 1,
      borderColor: BORDER,

      padding: 13,

      marginBottom: 11,

      flexDirection:
        "row",

      alignItems:
        "center",
    },

    // ==================================================
    // FOOD ICON
    // ==================================================

    foodIcon: {
      width: 44,
      height: 44,

      borderRadius: 14,

      backgroundColor:
        LIGHT_GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight: 11,
    },

    // ==================================================
    // CONTENT
    // ==================================================

    foodContent: {
      flex: 1,
      minWidth: 0,
      paddingRight: 8,
    },

    foodName: {
      fontSize: 15,
      lineHeight: 20,

      fontWeight: "800",

      color: TEXT,
    },

    brandName: {
      fontSize: 11,
      lineHeight: 15,

      color: DARK_GREEN,

      marginTop: 2,

      fontWeight: "600",
    },

    servingRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginTop: 6,
    },

    serving: {
      flex: 1,

      fontSize: 10,
      color: MUTED,

      marginLeft: 4,
    },

    // ==================================================
    // NUTRITION
    // ==================================================

    nutritionRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      flexWrap:
        "wrap",

      marginTop: 7,
    },

    calorieBadge: {
      backgroundColor:
        LIGHT_GREEN,

      borderRadius: 7,

      paddingHorizontal: 7,
      paddingVertical: 4,

      marginRight: 7,
    },

    calorieText: {
      fontSize: 10,
      fontWeight: "800",
      color: DARK_GREEN,
    },

    nutritionText: {
      fontSize: 9,
      color: MUTED,
      fontWeight: "600",
    },

    dot: {
      fontSize: 9,
      color: "#B5BBB6",
      marginHorizontal: 4,
    },

    // ==================================================
    // ADD BUTTON
    // ==================================================

    addButton: {
      width: 40,
      height: 40,

      borderRadius: 13,

      backgroundColor:
        GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginLeft: 4,
    },

    // ==================================================
    // EMPTY
    // ==================================================

    emptyContainer: {
      alignItems:
        "center",

      justifyContent:
        "center",

      paddingVertical: 60,
    },

    emptyIcon: {
      width: 64,
      height: 64,

      borderRadius: 22,

      backgroundColor:
        LIGHT_GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",
    },

    emptyTitle: {
      fontSize: 17,
      fontWeight: "800",
      color: TEXT,
      marginTop: 12,
    },

    emptyText: {
      fontSize: 12,
      color: MUTED,
      marginTop: 5,
    },
  });