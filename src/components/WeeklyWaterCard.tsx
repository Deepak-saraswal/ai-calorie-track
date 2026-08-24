
import { Ionicons } from "@expo/vector-icons";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

import { WeeklyWaterDay } from "../lib/dailyLogService";

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
const WATER = "#42A5F5";
const LIGHT_WATER = "#EAF5FF";
const SOFT_GREY = "#F5F7F5";

// =====================================================
// SCREEN
// =====================================================

const screenWidth =
  Dimensions.get("window").width;

// =====================================================
// TYPES
// =====================================================

interface WeeklyWaterCardProps {
  data: WeeklyWaterDay[];
}

// =====================================================
// COMPONENT
// =====================================================

export default function WeeklyWaterCard({
  data,
}: WeeklyWaterCardProps) {
  // ---------------------------------------------------
  // Always keep exactly 7 days
  // ---------------------------------------------------

  const labels = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
  ];

  const chartData =
    Array.from(
      { length: 7 },
      (_, index) =>
        data[index] ?? {
          date: new Date(),
          dateKey: "",
          label: labels[index],
          waterMl: 0,
        }
    );

  // ---------------------------------------------------
  // Water values
  // ---------------------------------------------------

  const waterValues =
    chartData.map((day) =>
      Math.max(
        0,
        Math.round(
          day.waterMl || 0
        )
      )
    );

  // ---------------------------------------------------
  // Statistics
  // ---------------------------------------------------

  const totalWater =
    waterValues.reduce(
      (sum, value) =>
        sum + value,
      0
    );

  const averageWater =
    Math.round(
      totalWater / 7
    );

  const todayIndex =
    new Date().getDay();

  const todayWater =
    waterValues[todayIndex] ?? 0;

  // ---------------------------------------------------
  // Convert ml → liters
  // ---------------------------------------------------

  const totalLiters =
    totalWater / 1000;

  const averageLiters =
    averageWater / 1000;

  const todayLiters =
    todayWater / 1000;

  return (
    <View style={styles.card}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>

          <View style={styles.iconContainer}>
            <Ionicons
              name="water"
              size={21}
              color={WATER}
            />
          </View>

          <View>
            <Text style={styles.title}>
              Water Consumption
            </Text>

            <Text style={styles.subtitle}>
              Current week
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

        {/* Total */}

        <View>
          <Text style={styles.summaryLabel}>
            Total consumed
          </Text>

          <View style={styles.totalRow}>
            <Text style={styles.totalValue}>
              {totalLiters.toFixed(1)}
            </Text>

            <Text style={styles.totalUnit}>
              L
            </Text>
          </View>
        </View>

        {/* Today */}

        <View style={styles.todayBox}>

          <Text style={styles.todayLabel}>
            Today
          </Text>

          <View style={styles.todayValueRow}>
            <Text style={styles.todayValue}>
              {todayLiters.toFixed(1)}
            </Text>

            <Text style={styles.todayUnit}>
              L
            </Text>
          </View>

        </View>

        {/* Average */}

        <View style={styles.averageBox}>

          <Text style={styles.averageLabel}>
            Daily avg
          </Text>

          <Text style={styles.averageValue}>
            {averageLiters.toFixed(1)}
          </Text>

          <Text style={styles.averageUnit}>
            L
          </Text>

        </View>

      </View>

      {/* =================================================
          CHART
      ================================================= */}

      <View style={styles.chartContainer}>

        <LineChart
          data={{
            labels: chartData.map(
              (day) => day.label
            ),

            datasets: [
              {
                data:
                  waterValues,

                color: () =>
                  WATER,

                strokeWidth: 3,
              },
            ],
          }}

          width={
            screenWidth - 36
          }

          height={220}

          bezier

          fromZero

          withDots

          withShadow={false}

          withInnerLines

          withVerticalLines={false}

          withHorizontalLines

          withVerticalLabels

          withHorizontalLabels

          yAxisLabel=""

          yAxisSuffix=""

          segments={4}

          chartConfig={{
            backgroundColor:
              WHITE,

            backgroundGradientFrom:
              WHITE,

            backgroundGradientTo:
              WHITE,

            decimalPlaces: 0,

            color: (
              opacity = 1
            ) =>
              `rgba(66, 165, 245, ${opacity})`,

            labelColor: (
              opacity = 1
            ) =>
              `rgba(123, 129, 124, ${opacity})`,

            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke:
                WHITE,
            },

            propsForBackgroundLines:
              {
                stroke:
                  "#EEF1EE",

                strokeWidth:
                  "1",

                strokeDasharray:
                  "4 4",
              },

            propsForLabels: {
              fontSize: 10,
              fontWeight:
                "600",
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
            Water consumed
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

const styles =
  StyleSheet.create({

    // =================================================
    // CARD
    // =================================================

    card: {
      backgroundColor:
        WHITE,

      borderRadius: 22,

      borderWidth: 1,
      borderColor:
        BORDER,

      marginTop: 18,

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

    // =================================================
    // HEADER
    // =================================================

    header: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 17,
    },

    headerLeft: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    iconContainer: {
      width: 42,
      height: 42,

      borderRadius: 14,

      backgroundColor:
        LIGHT_WATER,

      alignItems:
        "center",

      justifyContent:
        "center",

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
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        LIGHT_GREEN,

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

    // =================================================
    // SUMMARY
    // =================================================

    summaryRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginTop: 18,

      paddingHorizontal: 17,
    },

    summaryLabel: {
      fontSize: 11,

      color: MUTED,

      marginBottom: 2,
    },

    totalRow: {
      flexDirection:
        "row",

      alignItems:
        "baseline",
    },

    totalValue: {
      fontSize: 27,

      fontWeight: "900",

      color: TEXT,

      letterSpacing: -0.8,
    },

    totalUnit: {
      fontSize: 12,

      fontWeight: "700",

      color: MUTED,

      marginLeft: 4,
    },

    // =================================================
    // TODAY
    // =================================================

    todayBox: {
      backgroundColor:
        LIGHT_WATER,

      borderRadius: 13,

      paddingHorizontal: 11,
      paddingVertical: 8,

      minWidth: 70,
    },

    todayLabel: {
      fontSize: 9,

      color: MUTED,

      marginBottom: 1,
    },

    todayValueRow: {
      flexDirection:
        "row",

      alignItems:
        "baseline",
    },

    todayValue: {
      fontSize: 14,

      fontWeight: "800",

      color: WATER,
    },

    todayUnit: {
      fontSize: 8,

      color: MUTED,

      marginLeft: 2,
    },

    // =================================================
    // AVERAGE
    // =================================================

    averageBox: {
      backgroundColor:
        SOFT_GREY,

      borderRadius: 13,

      paddingHorizontal: 11,
      paddingVertical: 8,

      minWidth: 70,
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

    // =================================================
    // CHART
    // =================================================

    chartContainer: {
      marginTop: 8,

      alignItems: "center",

      overflow: "hidden",
    },

    chart: {
      marginLeft: -4,

      borderRadius: 18,
    },

    // =================================================
    // FOOTER
    // =================================================

    footer: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 17,

      marginTop: -2,
    },

    footerLeft: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    footerDot: {
      width: 7,
      height: 7,

      borderRadius: 4,

      backgroundColor:
        WATER,

      marginRight: 6,
    },

    footerText: {
      fontSize: 9,

      color: MUTED,

      fontWeight: "600",
    },
  });