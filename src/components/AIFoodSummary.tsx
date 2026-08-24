import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { WeeklyFoodSummary } from "@/lib/gemini";

// =====================================================
// COLORS
// =====================================================

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";

const TEXT = "#252825";
const MUTED = "#7B817C";

const WHITE = "#FFFFFF";
const BORDER = "#E5EAE5";

const ORANGE = "#FF7A00";
const LIGHT_ORANGE = "#FFF3E8";

const PURPLE = "#7657D9";
const LIGHT_PURPLE = "#F0ECFF";

const SOFT_GREY = "#F5F7F5";

// =====================================================
// TYPES
// =====================================================

interface AIFoodSummaryProps {
  data: WeeklyFoodSummary | null;
  loading: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export default function AIFoodSummary({
  data,
  loading,
}: AIFoodSummaryProps) {
  return (
    <View style={styles.container}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>

          <View style={styles.headerIcon}>
            <Ionicons
              name="sparkles"
              size={20}
              color={PURPLE}
            />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              AI Food Summary
            </Text>

            <Text style={styles.subtitle}>
              AI insights from your meals this week
            </Text>
          </View>

        </View>

        <View style={styles.aiBadge}>
          <Ionicons
            name="sparkles"
            size={10}
            color={PURPLE}
          />

          <Text style={styles.aiBadgeText}>
            AI
          </Text>
        </View>
      </View>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <View style={styles.loadingCard}>

          <View style={styles.loadingIcon}>
            <ActivityIndicator
              size="small"
              color={GREEN}
            />
          </View>

          <View style={styles.loadingTextContainer}>
            <Text style={styles.loadingTitle}>
              Analyzing your meals
            </Text>

            <Text style={styles.loadingSubtitle}>
              Gemini is reviewing your food intake...
            </Text>
          </View>

        </View>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading && !data && (
        <View style={styles.emptyCard}>

          <View style={styles.emptyIcon}>
            <Ionicons
              name="restaurant-outline"
              size={24}
              color={MUTED}
            />
          </View>

          <Text style={styles.emptyTitle}>
            No food insights yet
          </Text>

          <Text style={styles.emptyText}>
            Log some meals during the week and
            your AI food summary will appear here.
          </Text>

        </View>
      )}

      {/* =================================================
          BENTO GRID
      ================================================= */}

      {!loading && data && (
        <View style={styles.grid}>

          {/* =================================================
              WEEKLY SUMMARY
          ================================================= */}

          <View
            style={[
              styles.bentoCard,
              styles.summaryCard,
            ]}
          >
            <View style={styles.summaryTop}>

              <View style={styles.summaryIcon}>
                <Ionicons
                  name="restaurant-outline"
                  size={19}
                  color={GREEN}
                />
              </View>

              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>
                  THIS WEEK
                </Text>
              </View>

            </View>

            <Text style={styles.cardLabel}>
              AI SUMMARY
            </Text>

            <Text style={styles.summaryText}>
              {data.summary}
            </Text>
          </View>

          {/* =================================================
              EATING PATTERN
          ================================================= */}

          <View
            style={[
              styles.bentoCard,
              styles.patternCard,
            ]}
          >
            <View style={styles.patternIcon}>
              <Ionicons
                name="analytics-outline"
                size={19}
                color={PURPLE}
              />
            </View>

            <Text style={styles.cardLabel}>
              EATING PATTERN
            </Text>

            <Text style={styles.patternText}>
              {data.eatingPattern}
            </Text>
          </View>

          {/* =================================================
              HIGHLIGHT
          ================================================= */}

          <View
            style={[
              styles.bentoCard,
              styles.highlightCard,
            ]}
          >
            <View style={styles.highlightIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color={GREEN}
              />
            </View>

            <Text style={styles.cardLabel}>
              GOOD CHOICE
            </Text>

            <Text style={styles.smallCardText}>
              {data.highlight}
            </Text>
          </View>

          {/* =================================================
              AI INSIGHT
          ================================================= */}

          <View
            style={[
              styles.bentoCard,
              styles.insightCard,
            ]}
          >
            <View style={styles.insightIcon}>
              <Ionicons
                name="bulb-outline"
                size={19}
                color={ORANGE}
              />
            </View>

            <Text style={styles.cardLabel}>
              AI INSIGHT
            </Text>

            <Text style={styles.smallCardText}>
              {data.insight}
            </Text>
          </View>

          {/* =================================================
              NEXT STEP
          ================================================= */}

          <View
            style={[
              styles.bentoCard,
              styles.recommendationCard,
            ]}
          >

            <View style={styles.recommendationTop}>

              <View style={styles.recommendationIcon}>
                <Ionicons
                  name="sparkles-outline"
                  size={18}
                  color={DARK_GREEN}
                />
              </View>

              <Text style={styles.cardLabel}>
                NEXT STEP
              </Text>

            </View>

            <Text style={styles.recommendationText}>
              {data.recommendation}
            </Text>

          </View>

        </View>
      )}

    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  // ===================================================
  // CONTAINER
  // ===================================================

  container: {
    marginTop: 18,
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 12,
  },

  headerLeft: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  headerIcon: {
    width: 42,
    height: 42,

    borderRadius: 14,

    backgroundColor: LIGHT_PURPLE,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 16,

    fontWeight: "800",

    color: TEXT,
  },

  subtitle: {
    fontSize: 11,

    color: MUTED,

    marginTop: 2,
  },

  aiBadge: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: LIGHT_PURPLE,

    borderRadius: 14,

    paddingHorizontal: 9,

    paddingVertical: 6,

    marginLeft: 8,
  },

  aiBadgeText: {
    fontSize: 9,

    fontWeight: "900",

    color: PURPLE,

    marginLeft: 3,
  },

  // ===================================================
  // BENTO GRID
  // ===================================================

  grid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

    gap: 10,
  },

  bentoCard: {
    backgroundColor: WHITE,

    borderRadius: 20,

    borderWidth: 1,

    borderColor: BORDER,

    padding: 15,
  },

  // ===================================================
  // SUMMARY CARD
  // ===================================================

  summaryCard: {
    width: "100%",

    minHeight: 145,

    backgroundColor: "#F8FCF9",
  },

  summaryTop: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  summaryIcon: {
    width: 35,
    height: 35,

    borderRadius: 11,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",
  },

  summaryBadge: {
    backgroundColor: WHITE,

    borderRadius: 12,

    paddingHorizontal: 8,

    paddingVertical: 5,
  },

  summaryBadgeText: {
    fontSize: 8,

    fontWeight: "800",

    color: GREEN,

    letterSpacing: 0.4,
  },

  // ===================================================
  // COMMON CARD LABEL
  // ===================================================

  cardLabel: {
    fontSize: 9,

    fontWeight: "800",

    color: MUTED,

    letterSpacing: 0.5,

    marginTop: 10,
  },

  // ===================================================
  // SUMMARY TEXT
  // ===================================================

  summaryText: {
    fontSize: 14,

    lineHeight: 20,

    fontWeight: "600",

    color: TEXT,

    marginTop: 6,
  },

  // ===================================================
  // EATING PATTERN
  // ===================================================

  patternCard: {
    width: "48.5%",

    minHeight: 130,

    backgroundColor: "#FBFAFF",
  },

  patternIcon: {
    width: 35,
    height: 35,

    borderRadius: 11,

    backgroundColor: LIGHT_PURPLE,

    alignItems: "center",
    justifyContent: "center",
  },

  patternText: {
    fontSize: 17,

    lineHeight: 22,

    fontWeight: "900",

    color: PURPLE,

    marginTop: 7,
  },

  // ===================================================
  // HIGHLIGHT
  // ===================================================

  highlightCard: {
    width: "48.5%",

    minHeight: 130,

    backgroundColor: "#F8FCF9",
  },

  highlightIcon: {
    width: 35,
    height: 35,

    borderRadius: 11,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",
  },

  // ===================================================
  // SMALL CARD TEXT
  // ===================================================

  smallCardText: {
    fontSize: 11,

    lineHeight: 16,

    fontWeight: "600",

    color: TEXT,

    marginTop: 5,
  },

  // ===================================================
  // AI INSIGHT
  // ===================================================

  insightCard: {
    width: "48.5%",

    minHeight: 140,

    backgroundColor: "#FFFBF7",
  },

  insightIcon: {
    width: 35,
    height: 35,

    borderRadius: 11,

    backgroundColor: LIGHT_ORANGE,

    alignItems: "center",
    justifyContent: "center",
  },

  // ===================================================
  // RECOMMENDATION
  // ===================================================

  recommendationCard: {
    width: "48.5%",

    minHeight: 140,

    backgroundColor: LIGHT_GREEN,
  },

  recommendationTop: {
    flexDirection: "row",

    alignItems: "center",
  },

  recommendationIcon: {
    width: 35,
    height: 35,

    borderRadius: 11,

    backgroundColor: WHITE,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 8,
  },

  recommendationText: {
    fontSize: 11,

    lineHeight: 17,

    fontWeight: "700",

    color: DARK_GREEN,

    marginTop: 9,
  },

  // ===================================================
  // LOADING
  // ===================================================

  loadingCard: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: WHITE,

    borderRadius: 20,

    borderWidth: 1,

    borderColor: BORDER,

    padding: 20,
  },

  loadingIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  loadingTextContainer: {
    flex: 1,
  },

  loadingTitle: {
    fontSize: 13,

    fontWeight: "800",

    color: TEXT,
  },

  loadingSubtitle: {
    fontSize: 10,

    color: MUTED,

    marginTop: 3,
  },

  // ===================================================
  // EMPTY STATE
  // ===================================================

  emptyCard: {
    backgroundColor: WHITE,

    borderRadius: 20,

    borderWidth: 1,

    borderColor: BORDER,

    padding: 26,

    alignItems: "center",

    justifyContent: "center",
  },

  emptyIcon: {
    width: 48,
    height: 48,

    borderRadius: 16,

    backgroundColor: SOFT_GREY,

    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    fontSize: 14,

    fontWeight: "800",

    color: TEXT,

    marginTop: 10,
  },

  emptyText: {
    fontSize: 11,

    lineHeight: 17,

    color: MUTED,

    textAlign: "center",

    marginTop: 5,

    maxWidth: 280,
  },
});