import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { analyzeFoodImage } from "@/lib/gemini";

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
// Analysis steps
// ==================================================

const ANALYSIS_STEPS = [
  {
    title: "Analyzing food",
    subtitle: "Identifying the food in your image",
    icon: "scan-outline" as const,
  },
  {
    title: "Getting nutrition data",
    subtitle: "Calculating calories and nutrients",
    icon: "nutrition-outline" as const,
  },
  {
    title: "Getting final result",
    subtitle: "Preparing your food information",
    icon: "checkmark-circle-outline" as const,
  },
];

// ==================================================
// Types
// ==================================================

interface FoodAnalysisResult {
  foodName: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// ==================================================
// Component
// ==================================================

export default function ScanFood() {
  // ==================================================
  // Route params
  // ==================================================

  const params = useLocalSearchParams<{
    imageUri?: string | string[];
    imageBase64?: string | string[];
  }>();

  // ==================================================
  // Normalize image URI
  // ==================================================

  const rawImageUri = Array.isArray(params.imageUri)
    ? params.imageUri[0]
    : params.imageUri;

  const imageUri = rawImageUri || "";

  // ==================================================
  // Normalize Base64
  // ==================================================

  const rawImageBase64 = Array.isArray(params.imageBase64)
    ? params.imageBase64[0]
    : params.imageBase64;

  const imageBase64 = rawImageBase64 || "";

  // ==================================================
  // Image Source
  // ==================================================
  // Prefer Base64 because Gemini already receives it
  // successfully and it avoids problems with local URI
  // handling through Expo Router params.
  // ==================================================

  const imageSource = imageBase64
    ? {
        uri: `data:image/jpeg;base64,${imageBase64}`,
      }
    : imageUri
      ? {
          uri: imageUri,
        }
      : null;

  // ==================================================
  // State
  // ==================================================

  const [currentStep, setCurrentStep] = useState(0);

  const [analysisComplete, setAnalysisComplete] =
    useState(false);

  const [analyzing, setAnalyzing] = useState(false);

  const [error, setError] = useState("");

  const [foodResult, setFoodResult] =
    useState<FoodAnalysisResult | null>(null);

  // ==================================================
  // Analyze image
  // ==================================================

  useEffect(() => {
    if (!imageBase64) {
      console.log("❌ No image Base64 received");
      return;
    }

    let mounted = true;

    const analyzeImage = async () => {
      try {
        setAnalyzing(true);
        setAnalysisComplete(false);
        setError("");
        setFoodResult(null);
        setCurrentStep(0);

        console.log("=================================");
        console.log("🍎 FOOD ANALYSIS STARTED");
        console.log("🖼️ IMAGE URI:", imageUri);
        console.log(
          "📦 Base64 length:",
          imageBase64.length
        );
        console.log(
          "🖼️ Base64 image source available:",
          !!imageSource
        );
        console.log("=================================");

        // ==================================================
        // STEP 1
        // ==================================================

        if (!mounted) return;

        setCurrentStep(0);

        console.log("🔍 Step 1: Analyzing food image...");

        await new Promise<void>((resolve) =>
          setTimeout(resolve, 700)
        );

        if (!mounted) return;

        console.log("✅ Image Base64 received");

        // ==================================================
        // STEP 2
        // ==================================================

        setCurrentStep(1);

        console.log("🤖 Sending image to Gemini...");

        const result = await analyzeFoodImage(
          imageBase64,
          "image/jpeg"
        );

        console.log(
          "✅ Gemini analysis result:",
          result
        );

        if (!result || typeof result !== "object") {
          throw new Error(
            "Invalid response from Gemini."
          );
        }

        // ==================================================
        // Normalize result
        // ==================================================

        const normalizedResult: FoodAnalysisResult = {
          foodName: String(
            result.foodName || "Unknown Food"
          ),

          servingSize: String(
            result.servingSize || "1 serving"
          ),

          calories: Number(result.calories || 0),

          protein: Number(result.protein || 0),

          carbs: Number(result.carbs || 0),

          fat: Number(result.fat || 0),
        };

        console.log(
          "📊 NORMALIZED RESULT:",
          normalizedResult
        );

        // ==================================================
        // STEP 3
        // ==================================================

        if (!mounted) return;

        setCurrentStep(2);

        console.log(
          "✅ Preparing final result..."
        );

        await new Promise<void>((resolve) =>
          setTimeout(resolve, 700)
        );

        if (!mounted) return;

        setFoodResult(normalizedResult);

        setAnalysisComplete(true);

        console.log(
          "🎉 FOOD ANALYSIS COMPLETE"
        );
      } catch (err) {
        console.log(
          "❌ FOOD ANALYSIS ERROR:",
          err
        );

        if (!mounted) return;

        setError(
          "Unable to analyze this image. Please try again."
        );

        setAnalysisComplete(false);
        setFoodResult(null);
      } finally {
        if (mounted) {
          setAnalyzing(false);
        }
      }
    };

    analyzeImage();

    return () => {
      mounted = false;
    };
  }, [imageBase64, imageUri]);

  // ==================================================
  // Back
  // ==================================================

  function handleBack() {
    console.log("⬅️ BACK PRESSED");

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/tabs/add");
    }
  }

  // ==================================================
  // Continue
  // ==================================================

  function handleContinue() {
    console.log("=================================");
    console.log("➡️ CONTINUE PRESSED");
    console.log("=================================");

    if (!foodResult) {
      console.log(
        "❌ Cannot continue: foodResult is null"
      );
      return;
    }

    console.log(
      "🍎 Food result:",
      foodResult
    );

    try {
      /*
       * IMPORTANT:
       *
       * Do NOT encodeURIComponent() here.
       * Expo Router handles query-param encoding.
       */

      const foodData = JSON.stringify(
        foodResult
      );

      console.log(
        "📦 foodData length:",
        foodData.length
      );

      console.log(
        "🚀 Navigating to /food-analysis-result..."
      );

      router.push({
        pathname: "/food-analysis-result",
        params: {
          foodData,
        },
      });

      console.log(
        "✅ router.push called successfully"
      );
    } catch (navigationError) {
      console.log(
        "❌ NAVIGATION ERROR:",
        navigationError
      );
    }
  }

  // ==================================================
  // No image
  // ==================================================

  if (!imageUri && !imageBase64) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.noImageContainer}>
          <Ionicons
            name="image-outline"
            size={52}
            color={MUTED}
          />

          <Text style={styles.noImageTitle}>
            No image selected
          </Text>

          <Text style={styles.noImageText}>
            Please go back and select or capture
            a food image.
          </Text>

          <Pressable
            style={styles.backToAddButton}
            onPress={() => {
              router.replace("/tabs/add");
            }}
          >
            <Text style={styles.backToAddText}>
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
            Analyzing Food Item
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
              TITLE
          ================================================== */}

          <View style={styles.titleSection}>
            <Text style={styles.title}>
              Analyzing food item
            </Text>

            <Text style={styles.subtitle}>
              We're checking your image to identify
              the food and estimate its nutrition.
            </Text>
          </View>

          {/* ==================================================
              IMAGE
          ================================================== */}

          {imageSource ? (
            <View style={styles.imageCard}>
              <Image
                source={imageSource}
                style={styles.foodImage}
                resizeMode="cover"
                onLoad={() => {
                  console.log(
                    "================================="
                  );

                  console.log(
                    "✅ FOOD IMAGE LOADED"
                  );

                  console.log(
                    "🖼️ Image displayed successfully"
                  );

                  console.log(
                    "================================="
                  );
                }}
                onError={(event) => {
                  console.log(
                    "================================="
                  );

                  console.log(
                    "❌ FOOD IMAGE LOAD ERROR"
                  );

                  console.log(
                    event.nativeEvent
                  );

                  console.log(
                    "================================="
                  );
                }}
              />

              {/* Analyzing overlay */}

              {analyzing && (
                <View style={styles.imageOverlay}>
                  <View style={styles.analyzingBadge}>
                    <ActivityIndicator
                      size="small"
                      color={WHITE}
                    />

                    <Text
                      style={
                        styles.analyzingBadgeText
                      }
                    >
                      Analyzing...
                    </Text>
                  </View>
                </View>
              )}

              {/* Complete badge */}

              {analysisComplete && (
                <View style={styles.completedBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={WHITE}
                  />

                  <Text
                    style={
                      styles.completedBadgeText
                    }
                  >
                    Analysis complete
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="image-outline"
                size={48}
                color={MUTED}
              />

              <Text
                style={
                  styles.imagePlaceholderText
                }
              >
                Food image
              </Text>
            </View>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {error !== "" && (
            <View style={styles.errorCard}>
              <Ionicons
                name="alert-circle-outline"
                size={23}
                color="#C0392B"
              />

              <View style={styles.errorContent}>
                <Text style={styles.errorTitle}>
                  Analysis failed
                </Text>

                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            </View>
          )}

          {/* ==================================================
              ANALYSIS CARD
          ================================================== */}

          <View style={styles.analysisCard}>
            <Text style={styles.analysisTitle}>
              Food analysis
            </Text>

            <Text style={styles.analysisSubtitle}>
              This may take a few moments
            </Text>

            <View style={styles.stepsContainer}>
              {ANALYSIS_STEPS.map(
                (step, index) => {
                  const completed =
                    analysisComplete ||
                    index < currentStep;

                  const active =
                    index === currentStep &&
                    !analysisComplete &&
                    !error;

                  return (
                    <View
                      key={step.title}
                      style={styles.stepRow}
                    >
                      {/* Icon */}

                      <View
                        style={[
                          styles.stepIcon,

                          completed &&
                            styles.stepIconCompleted,

                          active &&
                            styles.stepIconActive,
                        ]}
                      >
                        {completed ? (
                          <Ionicons
                            name="checkmark"
                            size={19}
                            color={WHITE}
                          />
                        ) : active ? (
                          <ActivityIndicator
                            size="small"
                            color={GREEN}
                          />
                        ) : (
                          <Ionicons
                            name={step.icon}
                            size={19}
                            color="#A8AEA9"
                          />
                        )}
                      </View>

                      {/* Text */}

                      <View style={styles.stepContent}>
                        <Text
                          style={[
                            styles.stepTitle,

                            completed &&
                              styles.stepTitleCompleted,

                            active &&
                              styles.stepTitleActive,
                          ]}
                        >
                          {step.title}
                        </Text>

                        <Text
                          style={styles.stepSubtitle}
                        >
                          {step.subtitle}
                        </Text>
                      </View>

                      {/* Status */}

                      <View>
                        {completed ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={21}
                            color={GREEN}
                          />
                        ) : active ? (
                          <ActivityIndicator
                            size="small"
                            color={GREEN}
                          />
                        ) : (
                          <Ionicons
                            name="ellipse-outline"
                            size={20}
                            color="#C8CEC9"
                          />
                        )}
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        </ScrollView>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <View style={styles.footer}>
          <Pressable
            disabled={
              !analysisComplete ||
              !foodResult
            }
            onPress={handleContinue}
            style={({ pressed }) => [
              styles.continueButton,

              (!analysisComplete ||
                !foodResult) &&
                styles.continueButtonDisabled,

              {
                opacity:
                  pressed &&
                  analysisComplete &&
                  foodResult
                    ? 0.85
                    : 1,
              },
            ]}
          >
            {analysisComplete && foodResult ? (
              <Ionicons
                name="arrow-forward-circle-outline"
                size={21}
                color={WHITE}
              />
            ) : (
              <ActivityIndicator
                size="small"
                color={WHITE}
              />
            )}

            <Text
              style={styles.continueButtonText}
            >
              {analysisComplete && foodResult
                ? "Continue"
                : "Analyzing..."}
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
    marginTop: 40,
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
  // Title
  // ==================================================

  titleSection: {
    marginBottom: 20,
  },

  title: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: MUTED,
    marginTop: 7,
  },

  // ==================================================
  // Image
  // ==================================================

  imageCard: {
    width: "100%",
    height: 270,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#EDEFEA",
    borderWidth: 1,
    borderColor: BORDER,
  },

  foodImage: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    width: "100%",
    height: 270,
    borderRadius: 24,
    backgroundColor: "#EDEFEA",
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
  },

  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 13,
    color: MUTED,
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  analyzingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.72)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },

  analyzingBadgeText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 8,
  },

  completedBadge: {
    position: "absolute",
    left: 14,
    bottom: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 18,
  },

  completedBadgeText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },

  // ==================================================
  // Error
  // ==================================================

  errorCard: {
    marginTop: 16,
    flexDirection: "row",
    backgroundColor: "#FDEDEC",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F5C6C3",
    padding: 15,
  },

  errorContent: {
    flex: 1,
    marginLeft: 10,
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#C0392B",
  },

  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#8E4038",
    marginTop: 4,
  },

  // ==================================================
  // Analysis Card
  // ==================================================

  analysisCard: {
    marginTop: 18,
    backgroundColor: WHITE,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 18,
  },

  analysisTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT,
  },

  analysisSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 4,
  },

  stepsContainer: {
    marginTop: 18,
  },

  stepRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
  },

  stepIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F1F3F1",
    alignItems: "center",
    justifyContent: "center",
  },

  stepIconCompleted: {
    backgroundColor: GREEN,
  },

  stepIconActive: {
    backgroundColor: LIGHT_GREEN,
  },

  stepContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8B918C",
  },

  stepTitleCompleted: {
    color: TEXT,
  },

  stepTitleActive: {
    color: GREEN,
  },

  stepSubtitle: {
    fontSize: 11,
    lineHeight: 16,
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

  continueButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: GREEN,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  continueButtonDisabled: {
    backgroundColor: "#AAB2AB",
  },

  continueButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: WHITE,
  },

  // ==================================================
  // No Image
  // ==================================================

  noImageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  noImageTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT,
    marginTop: 15,
  },

  noImageText: {
    fontSize: 13,
    lineHeight: 19,
    color: MUTED,
    textAlign: "center",
    marginTop: 7,
  },

  backToAddButton: {
    marginTop: 22,
    minWidth: 120,
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 15,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  backToAddText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
  },
});