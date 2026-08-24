import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { WeeklyCaloriesDay } from "../lib/dailyLogService";


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
const SOFT_GREY = "#F5F7F5";

// =====================================================
// CONSTANTS
// =====================================================

const SCREEN_WIDTH = Dimensions.get("window").width;

const CHART_WIDTH = SCREEN_WIDTH - 36;

// =====================================================
// TYPES
// =====================================================

interface WeeklyCaloriesChartProps {
  data: WeeklyCaloriesDay[];
}

// =====================================================
// COMPONENT
// =====================================================

export default function WeeklyCaloriesChart({
  data,
}: WeeklyCaloriesChartProps) {
  // ---------------------------------------------------
  // Always render 7 days
  // ---------------------------------------------------

  const chartData = Array.from(
    { length: 7 },
    (_, index) =>
      data[index] ?? {
        date: new Date(),
        dateKey: "",
        label: ["S", "M", "T", "W", "T", "F", "S"][index],
        calories: 0,
      }
  );

  // ---------------------------------------------------
  // Calories
  // ---------------------------------------------------

  const calories = chartData.map((day) =>
    Math.max(0, Math.round(day.calories))
  );

  const labels = chartData.map(
    (day) => day.label
  );

  // ---------------------------------------------------
  // Statistics
  // ---------------------------------------------------

  const totalCalories = calories.reduce(
    (sum, value) => sum + value,
    0
  );

  const averageCalories = Math.round(
    totalCalories / 7
  );

  return (
    <View style={styles.card}>
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="flame"
              size={20}
              color={GREEN}
            />
          </View>

          <View>
            <Text style={styles.title}>
              Calories
            </Text>

            <Text style={styles.subtitle}>
              This week
            </Text>
          </View>
        </View>

        <View style={styles.weekBadge}>
          <Ionicons
            name="calendar-outline"
            size={13}
            color={DARK_GREEN}
          />

          <Text style={styles.weekBadgeText}>
            7 days
          </Text>
        </View>
      </View>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryLabel}>
            Total consumed
          </Text>

          <View style={styles.totalRow}>
            <Text style={styles.totalValue}>
              {totalCalories.toLocaleString()}
            </Text>

            <Text style={styles.totalUnit}>
              kcal
            </Text>
          </View>
        </View>

        <View style={styles.averageBox}>
          <Text style={styles.averageLabel}>
            Daily avg
          </Text>

          <Text style={styles.averageValue}>
            {averageCalories.toLocaleString()}
          </Text>

          <Text style={styles.averageUnit}>
            kcal
          </Text>
        </View>
      </View>

      {/* =================================================
          CHART
      ================================================= */}

      <View style={styles.chartContainer}>
        <BarChart
          data={{
            labels,
            datasets: [
              {
                data: calories,
              },
            ],
          }}
          width={CHART_WIDTH}
          height={215}
          fromZero
          showValuesOnTopOfBars
          withInnerLines
          withVerticalLabels
          withHorizontalLabels
          yAxisLabel=""
          yAxisSuffix=""
          segments={4}
          chartConfig={{
            backgroundColor: WHITE,
            backgroundGradientFrom: WHITE,
            backgroundGradientTo: WHITE,

            decimalPlaces: 0,

            color: () => GREEN,

            labelColor: () => MUTED,

            fillShadowGradient: GREEN,
            fillShadowGradientOpacity: 0.95,

            barPercentage: 0.55,

            propsForBackgroundLines: {
              stroke: "#EEF1EE",
              strokeWidth: "1",
              strokeDasharray: "4 4",
            },

            propsForLabels: {
              fontSize: 10,
              fontWeight: "600",
            },
          }}
          style={styles.chart}
        />
      </View>

      {/* =================================================
          FOOTER
      ================================================= */}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <View style={styles.footerDot} />

          <Text style={styles.footerText}>
            Calories consumed
          </Text>
        </View>

        <Text style={styles.footerText}>
          Sun – Sat
        </Text>
      </View>
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  // ===================================================
  // CARD
  // ===================================================

  card: {
    backgroundColor: WHITE,

    borderRadius: 22,

    borderWidth: 1,
    borderColor: BORDER,

    marginTop: 14,

    paddingTop: 17,
    paddingBottom: 13,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 17,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,

    borderRadius: 14,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
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

  weekBadge: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: LIGHT_GREEN,

    borderRadius: 20,

    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  weekBadgeText: {
    fontSize: 10,

    fontWeight: "700",

    color: DARK_GREEN,

    marginLeft: 4,
  },

  // ===================================================
  // SUMMARY
  // ===================================================

  summaryRow: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 18,

    paddingHorizontal: 17,
  },

  summaryLabel: {
    fontSize: 11,

    color: MUTED,

    marginBottom: 2,
  },

  totalRow: {
    flexDirection: "row",

    alignItems: "baseline",
  },

  totalValue: {
    fontSize: 27,

    fontWeight: "900",

    color: TEXT,

    letterSpacing: -0.8,
  },

  totalUnit: {
    fontSize: 11,

    fontWeight: "700",

    color: MUTED,

    marginLeft: 5,
  },

  averageBox: {
    minWidth: 82,

    backgroundColor: SOFT_GREY,

    borderRadius: 13,

    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  averageLabel: {
    fontSize: 9,

    color: MUTED,

    marginBottom: 1,
  },

  averageValue: {
    fontSize: 14,

    fontWeight: "800",

    color: DARK_GREEN,
  },

  averageUnit: {
    fontSize: 8,

    color: MUTED,

    marginTop: -1,
  },

  // ===================================================
  // CHART
  // ===================================================

  chartContainer: {
    marginTop: 8,

    alignItems: "center",

    overflow: "hidden",
  },

  chart: {
    marginLeft: -4,

    borderRadius: 18,
  },

  // ===================================================
  // FOOTER
  // ===================================================

  footer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 17,

    marginTop: -2,
  },

  footerLeft: {
    flexDirection: "row",

    alignItems: "center",
  },

  footerDot: {
    width: 7,
    height: 7,

    borderRadius: 4,

    backgroundColor: GREEN,

    marginRight: 6,
  },

  footerText: {
    fontSize: 9,

    color: MUTED,

    fontWeight: "600",
  },
});