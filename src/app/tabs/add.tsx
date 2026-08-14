import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
const BORDER = "#E5EAE5";

const CARD_GAP = 14;
const HORIZONTAL_PADDING = 18;
const CARD_WIDTH =
  (width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

interface ActionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  featured?: boolean;
}

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
      {/* Icon */}

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

      {/* Text */}

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

      {/* Arrow */}

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

export default function Add() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* ==========================================
            HEADER
        ========================================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>What would you like to do?</Text>

            <Text style={styles.subtitle}>
              Track your food, water and activity
            </Text>
          </View>

          
        </View>

        {/* ==========================================
            QUICK ACTIONS
        ========================================== */}

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.grid}>
          {/* 1. LOG EXERCISE */}

        <ActionCard
  icon="fitness-outline"
  title="Log Exercise"
  subtitle="Track your workout"
  featured
  onPress={() => {
     console.log("log exercise");
    router.push("/log-exercise");
  }}
/>

          {/* 2. ADD WATER */}

          <ActionCard
            icon="water-outline"
            title="Add Water"
            subtitle="Track your hydration"
            onPress={() => {
              console.log("Add Water");
              // Later:
              // router.push("/water");
            }}
          />

          {/* 3. FOOD DATABASE */}

          <ActionCard
            icon="restaurant-outline"
            title="Food Database"
            subtitle="Find & log food"
            onPress={() => {
              console.log("Food Database");
              // Later:
              // router.push("/food-database");
            }}
          />

          {/* 4. SCAN FOOD */}

          <ActionCard
            icon="scan-outline"
            title="Scan Food"
            subtitle="Scan your meal"
            onPress={() => {
              console.log("Scan Food");
              // Later:
              // router.push("/scan-food");
            }}
          />
        </View>

        {/* ==========================================
            TIP CARD
        ========================================== */}

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
              Log meals, water and workouts throughout
              the day to get a clearer picture of your
              progress.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ==================================================
  // SCREEN
  // ==================================================

  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  container: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 40,
    paddingBottom: 120,
  },

  // ==================================================
  // HEADER
  // ==================================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  title: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.7,
    maxWidth: width - 100,
  },

  subtitle: {
    fontSize: 14,
    color: MUTED,
    marginTop: 7,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: LIGHT_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },

  // ==================================================
  // SECTION
  // ==================================================

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: TEXT,
    marginBottom: 14,
  },

  // ==================================================
  // GRID
  // ==================================================

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: CARD_GAP,
  },

  // ==================================================
  // ACTION CARD
  // ==================================================

  actionCard: {
    minHeight: 190,

    backgroundColor: WHITE,

    borderRadius: 24,

    borderWidth: 1,
    borderColor: BORDER,

    padding: 17,

    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 3,
  },

  // ==================================================
  // FEATURED CARD
  // ==================================================

  featuredCard: {
    backgroundColor: GREEN,
    borderColor: GREEN,

    shadowColor: GREEN,
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 7,
    },

    elevation: 6,
  },

  // ==================================================
  // ICON
  // ==================================================

  iconContainer: {
    width: 54,
    height: 54,

    borderRadius: 18,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",
  },

  featuredIconContainer: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  // ==================================================
  // CARD TEXT
  // ==================================================

  cardTextContainer: {
    marginTop: 18,
  },

  cardTitle: {
    fontSize: 17,
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
    marginTop: 5,
  },

  featuredCardSubtitle: {
    color: "rgba(255,255,255,0.75)",
  },

  // ==================================================
  // ARROW
  // ==================================================

  arrowContainer: {
    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor: "#F3F5F3",

    alignItems: "center",
    justifyContent: "center",

    alignSelf: "flex-end",

    marginTop: 12,
  },

  featuredArrowContainer: {
    backgroundColor: WHITE,
  },

  // ==================================================
  // TIP
  // ==================================================

  tipCard: {
    marginTop: 24,

    flexDirection: "row",

    backgroundColor: LIGHT_GREEN,

    borderRadius: 20,

    padding: 16,

    borderWidth: 1,
    borderColor: "#DCE7DD",
  },

  tipIcon: {
    width: 40,
    height: 40,

    borderRadius: 14,

    backgroundColor: WHITE,

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
    color: DARK_GREEN,
  },

  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: MUTED,
    marginTop: 4,
  },
});