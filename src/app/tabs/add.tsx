import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

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
// Layout
// ==================================================

const CARD_GAP = 14;
const HORIZONTAL_PADDING = 18;

const CARD_WIDTH =
  (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

// ==================================================
// Types
// ==================================================

interface ActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  featured?: boolean;
}

// ==================================================
// Action Card
// ==================================================

function ActionCard({
  icon,
  title,
  subtitle,
  onPress,
  featured = false,
}: ActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        featured && styles.featuredCard,
        {
          width: CARD_WIDTH,
          opacity: pressed ? 0.88 : 1,
          transform: [
            {
              scale: pressed ? 0.98 : 1,
            },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          featured && styles.featuredIconContainer,
        ]}
      >
        <Ionicons
          name={icon}
          size={27}
          color={featured ? WHITE : GREEN}
        />
      </View>

      <View style={styles.cardTextContainer}>
        <Text
          style={[
            styles.cardTitle,
            featured && styles.featuredCardTitle,
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.cardSubtitle,
            featured && styles.featuredCardSubtitle,
          ]}
        >
          {subtitle}
        </Text>
      </View>

      <View
        style={[
          styles.arrowContainer,
          featured && styles.featuredArrowContainer,
        ]}
      >
        <Ionicons
          name="arrow-forward"
          size={16}
          color={featured ? GREEN : MUTED}
        />
      </View>
    </Pressable>
  );
}

// ==================================================
// Component
// ==================================================

export default function Add() {
  const [showScanDialog, setShowScanDialog] =
    React.useState(false);

  // ==================================================
  // Navigate to Scan Food
  // ==================================================

  function navigateToScanFood(
    imageUri: string,
    imageBase64: string
  ) {
    console.log(
      "================================="
    );

    console.log(
      "➡️ Navigating to scan-food..."
    );

    console.log(
      "🖼️ Image URI:",
      imageUri
    );

    console.log(
      "📦 Base64 available:",
      !!imageBase64
    );

    console.log(
      "📦 Base64 length:",
      imageBase64.length
    );

    console.log(
      "================================="
    );

    router.push({
      pathname: "/scan-food",
      params: {
        imageUri,
        imageBase64,
      },
    });

    console.log(
      "✅ router.push executed"
    );
  }

  // ==================================================
  // Gallery
  // ==================================================

  async function handleGallery() {
    console.log(
      "🟢 GALLERY BUTTON PRESSED"
    );

    try {
      setShowScanDialog(false);

      console.log(
        "📸 Requesting gallery permission..."
      );

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      console.log(
        "📸 Gallery permission:",
        permission.granted
      );

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access."
        );

        return;
      }

      console.log(
        "📂 Opening gallery..."
      );

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: false,
          quality: 0.8,
          base64: true,
        });

      console.log(
        "📂 Gallery result:",
        result
      );

      if (result.canceled) {
        console.log(
          "❌ User cancelled gallery"
        );

        return;
      }

      const asset = result.assets?.[0];

      if (!asset) {
        console.log(
          "❌ No asset returned"
        );

        Alert.alert(
          "Image Error",
          "Unable to get the selected image."
        );

        return;
      }

      const imageUri = asset.uri;
      const imageBase64 = asset.base64;

      console.log(
        "🖼️ SELECTED IMAGE URI:",
        imageUri
      );

      console.log(
        "📦 Base64 available:",
        !!imageBase64
      );

      console.log(
        "📦 Image dimensions:",
        asset.width,
        "x",
        asset.height
      );

      if (!imageUri) {
        console.log(
          "❌ No image URI found"
        );

        Alert.alert(
          "Image Error",
          "Unable to get the selected image."
        );

        return;
      }

      if (!imageBase64) {
        console.log(
          "❌ No Base64 data found"
        );

        Alert.alert(
          "Image Error",
          "Unable to read the selected image."
        );

        return;
      }

      console.log(
        "📦 Base64 length:",
        imageBase64.length
      );

      navigateToScanFood(
        imageUri,
        imageBase64
      );
    } catch (error) {
      console.log(
        "🔥 GALLERY ERROR:",
        error
      );

      Alert.alert(
        "Gallery Error",
        "Unable to select this image."
      );
    }
  }

  // ==================================================
  // Camera
  // ==================================================

  async function handleCamera() {
    console.log(
      "🟢 CAMERA BUTTON PRESSED"
    );

    try {
      setShowScanDialog(false);

      console.log(
        "📷 Requesting camera permission..."
      );

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      console.log(
        "📷 Camera permission:",
        permission.granted
      );

      if (!permission.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access."
        );

        return;
      }

      console.log(
        "📷 Opening camera..."
      );

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: false,
          quality: 0.8,
          base64: true,
        });

      console.log(
        "📷 Camera result:",
        result
      );

      if (result.canceled) {
        console.log(
          "❌ User cancelled camera"
        );

        return;
      }

      const asset = result.assets?.[0];

      if (!asset) {
        console.log(
          "❌ No camera asset returned"
        );

        Alert.alert(
          "Image Error",
          "Unable to get the captured image."
        );

        return;
      }

      const imageUri = asset.uri;
      const imageBase64 = asset.base64;

      console.log(
        "🖼️ CAPTURED IMAGE URI:",
        imageUri
      );

      console.log(
        "📦 Base64 available:",
        !!imageBase64
      );

      console.log(
        "📦 Image dimensions:",
        asset.width,
        "x",
        asset.height
      );

      if (!imageUri) {
        console.log(
          "❌ No image URI found"
        );

        Alert.alert(
          "Image Error",
          "Unable to get the captured image."
        );

        return;
      }

      if (!imageBase64) {
        console.log(
          "❌ No Base64 data found"
        );

        Alert.alert(
          "Image Error",
          "Unable to read the captured image."
        );

        return;
      }

      console.log(
        "📦 Base64 length:",
        imageBase64.length
      );

      navigateToScanFood(
        imageUri,
        imageBase64
      );
    } catch (error) {
      console.log(
        "🔥 CAMERA ERROR:",
        error
      );

      Alert.alert(
        "Camera Error",
        "Unable to capture this image."
      );
    }
  }

  // ==================================================
  // Render
  // ==================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.container
        }
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              What would you like to do?
            </Text>

            <Text style={styles.subtitle}>
              Track your food, water and activity
            </Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.grid}>
          <ActionCard
            icon="fitness-outline"
            title="Log Exercise"
            subtitle="Track your workout"
            featured
            onPress={() => {
              console.log(
                "🏋️ LOG EXERCISE"
              );

              router.push(
                "/log-exercise"
              );
            }}
          />

          <ActionCard
            icon="water-outline"
            title="Add Water"
            subtitle="Track your hydration"
            onPress={() => {
              console.log(
                "💧 ADD WATER PRESSED"
              );

              router.push(
                "/water-intake"
              );
            }}
          />

          <ActionCard
            icon="restaurant-outline"
            title="Food Database"
            subtitle="Find & log food"
            onPress={() => {
              console.log(
                "🍎 FOOD DATABASE PRESSED"
              );

              router.push(
                "/food-database"
              );
            }}
          />

          <ActionCard
            icon="scan-outline"
            title="Scan Food"
            subtitle="Scan your meal"
            onPress={() => {
              console.log(
                "🔍 SCAN FOOD PRESSED"
              );

              setShowScanDialog(true);
            }}
          />
        </View>

        {/* TIP CARD */}

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons
              name="sparkles-outline"
              size={20}
              color={GREEN}
            />
          </View>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>
              Keep your tracking consistent
            </Text>

            <Text style={styles.tipText}>
              Log meals, water and workouts
              throughout the day to get a clearer
              picture of your progress.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* SCAN FOOD MODAL */}

      <Modal
        visible={showScanDialog}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowScanDialog(false);
        }}
      >
        <Pressable
          style={styles.scanOverlay}
          onPress={() => {
            setShowScanDialog(false);
          }}
        >
          <Pressable
            style={styles.scanDialog}
            onPress={(event) => {
              event.stopPropagation();
            }}
          >
            <View
              style={
                styles.scanDialogIcon
              }
            >
              <Ionicons
                name="scan-outline"
                size={28}
                color={GREEN}
              />
            </View>

            <Text
              style={
                styles.scanDialogTitle
              }
            >
              Scan Food
            </Text>

            <Text
              style={
                styles.scanDialogSubtitle
              }
            >
              How would you like to add your
              food image?
            </Text>

            {/* GALLERY */}

            <Pressable
              style={({ pressed }) => [
                styles.scanOption,
                {
                  opacity: pressed
                    ? 0.8
                    : 1,
                },
              ]}
              onPress={handleGallery}
            >
              <View
                style={
                  styles.scanOptionIcon
                }
              >
                <Ionicons
                  name="images-outline"
                  size={24}
                  color={GREEN}
                />
              </View>

              <View
                style={
                  styles.scanOptionText
                }
              >
                <Text
                  style={
                    styles.scanOptionTitle
                  }
                >
                  Choose from Gallery
                </Text>

                <Text
                  style={
                    styles.scanOptionSubtitle
                  }
                >
                  Select a food image from your
                  phone
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={MUTED}
              />
            </Pressable>

            {/* CAMERA */}

            <Pressable
              style={({ pressed }) => [
                styles.scanOption,
                {
                  opacity: pressed
                    ? 0.8
                    : 1,
                },
              ]}
              onPress={handleCamera}
            >
              <View
                style={
                  styles.scanOptionIcon
                }
              >
                <Ionicons
                  name="camera-outline"
                  size={24}
                  color={GREEN}
                />
              </View>

              <View
                style={
                  styles.scanOptionText
                }
              >
                <Text
                  style={
                    styles.scanOptionTitle
                  }
                >
                  Take a Picture
                </Text>

                <Text
                  style={
                    styles.scanOptionSubtitle
                  }
                >
                  Use your camera to capture your
                  food
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={20}
                color={MUTED}
              />
            </Pressable>

            {/* CANCEL */}

            <Pressable
              style={styles.scanCancel}
              onPress={() => {
                setShowScanDialog(
                  false
                );
              }}
            >
              <Text
                style={
                  styles.scanCancelText
                }
              >
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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

  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 22,
    paddingBottom: 30,
  },

  header: {
    marginBottom: 28,
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
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },

  actionCard: {
    minHeight: 175,
    backgroundColor: WHITE,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    justifyContent: "space-between",
  },

  featuredCard: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  featuredIconContainer: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  cardTextContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
  },

  featuredCardTitle: {
    color: WHITE,
  },

  cardSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: MUTED,
    marginTop: 4,
  },

  featuredCardSubtitle: {
    color: "#E5F3E7",
  },

  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#F3F5F3",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },

  featuredArrowContainer: {
    backgroundColor: WHITE,
  },

  tipCard: {
    marginTop: 22,
    backgroundColor: WHITE,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    flexDirection: "row",
  },

  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  tipContent: {
    flex: 1,
    marginLeft: 12,
  },

  tipTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
  },

  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: MUTED,
    marginTop: 4,
  },

  // ==================================================
  // Scan Modal
  // ==================================================

  scanOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  scanDialog: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 30,
  },

  scanDialogIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  scanDialogTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: TEXT,
    textAlign: "center",
    marginTop: 13,
  },

  scanDialogSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: MUTED,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 18,
  },

  scanOption: {
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: "#F8FAF8",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 10,
  },

  scanOptionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  scanOptionText: {
    flex: 1,
    marginLeft: 12,
  },

  scanOptionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
  },

  scanOptionSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: MUTED,
    marginTop: 3,
  },

  scanCancel: {
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F1F3F1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },

  scanCancelText: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
  },
});