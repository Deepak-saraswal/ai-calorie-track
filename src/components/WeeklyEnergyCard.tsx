import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

import { WeeklyEnergyDay } from "../lib/dailyLogService";

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

const GRAPH_BG = "#F8FAF8";

// =====================================================
// SCREEN
// =====================================================

const screenWidth =
  Dimensions.get("window").width;

// =====================================================
// TYPES
// =====================================================

interface WeeklyEnergyCardProps {
  data: WeeklyEnergyDay[];
}

// =====================================================
// COMPONENT
// =====================================================

export default function WeeklyEnergyCard({
  data,
}: WeeklyEnergyCardProps) {

  // ===================================================
  // WEEK LABELS
  // ===================================================

  const labels = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
  ];

  // ===================================================
  // NORMALIZE 7 DAYS
  // ===================================================

  const chartData = Array.from(
    { length: 7 },
    (_, index) => {

      const day = data?.[index];

      return {
        date:
          day?.date ??
          new Date(),

        dateKey:
          day?.dateKey ??
          "",

        label:
          day?.label ??
          labels[index],

        consumed:
          Number(
            day?.consumed ?? 0
          ),

        burned:
          Number(
            day?.burned ?? 0
          ),
      };
    }
  );

  // ===================================================
  // CONSUMED
  // ===================================================

  const consumedValues =
    chartData.map((day) =>
      Math.max(
        0,
        Math.round(
          Math.abs(
            day.consumed
          )
        )
      )
    );

  // ===================================================
  // BURNED
  // ===================================================

  const burnedValues =
    chartData.map((day) =>
      Math.max(
        0,
        Math.round(
          Math.abs(
            day.burned
          )
        )
      )
    );

  // ===================================================
  // TOTALS
  // ===================================================

  const totalConsumed =
    consumedValues.reduce(
      (sum, value) =>
        sum + value,
      0
    );

  const totalBurned =
    burnedValues.reduce(
      (sum, value) =>
        sum + value,
      0
    );

  // ===================================================
  // NET
  // ===================================================

  const netEnergy =
    totalConsumed -
    totalBurned;

  // ===================================================
  // AVERAGES
  // ===================================================

  const averageConsumed =
    Math.round(
      totalConsumed / 7
    );

  const averageBurned =
    Math.round(
      totalBurned / 7
    );

  // ===================================================
  // CHART LABELS
  // ===================================================

  const weekLabels =
    chartData.map(
      (day, index) =>
        day.label ||
        labels[index]
    );

  // ===================================================
  // CHART
  // ===================================================

  const maxValue =
    Math.max(
      ...consumedValues,
      ...burnedValues,
      500
    );

  const chartMax =
    Math.ceil(
      maxValue / 500
    ) * 500;

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <View style={styles.card}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>

        <View style={styles.headerLeft}>

          <View style={styles.headerIcon}>
            <Ionicons
              name="flash"
              size={20}
              color={GREEN}
            />
          </View>

          <View>

            <Text style={styles.title}>
              Weekly Energy
            </Text>

            <Text style={styles.subtitle}>
              Your calorie activity this week
            </Text>

          </View>

        </View>

        <View style={styles.daysBadge}>

          <Ionicons
            name="calendar-outline"
            size={12}
            color={DARK_GREEN}
          />

          <Text style={styles.daysBadgeText}>
            7 days
          </Text>

        </View>

      </View>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <View style={styles.summaryRow}>

        {/* CONSUMED */}

        <View
          style={[
            styles.summaryCard,
            styles.consumedCard,
          ]}
        >

          <View style={styles.summaryHeader}>

            <View style={styles.greenIcon}>
              <Ionicons
                name="restaurant-outline"
                size={15}
                color={GREEN}
              />
            </View>

            <Text style={styles.summaryLabel}>
              Consumed
            </Text>

          </View>

          <View style={styles.valueRow}>

            <Text style={styles.value}>
              {totalConsumed.toLocaleString()}
            </Text>

            <Text style={styles.unit}>
              kcal
            </Text>

          </View>

          <Text style={styles.average}>
            {averageConsumed.toLocaleString()} avg/day
          </Text>

        </View>

        {/* BURNED */}

        <View
          style={[
            styles.summaryCard,
            styles.burnedCard,
          ]}
        >

          <View style={styles.summaryHeader}>

            <View style={styles.orangeIcon}>
              <Ionicons
                name="flame-outline"
                size={15}
                color={ORANGE}
              />
            </View>

            <Text style={styles.summaryLabel}>
              Burned
            </Text>

          </View>

          <View style={styles.valueRow}>

            <Text style={styles.value}>
              {totalBurned.toLocaleString()}
            </Text>

            <Text style={styles.unit}>
              kcal
            </Text>

          </View>

          <Text style={styles.average}>
            {averageBurned.toLocaleString()} avg/day
          </Text>

        </View>

      </View>

      {/* =================================================
          NET ENERGY
      ================================================= */}

      <View style={styles.netCard}>

        <View style={styles.netLeft}>

          <View
            style={[
              styles.netIcon,
              {
                backgroundColor:
                  netEnergy >= 0
                    ? LIGHT_GREEN
                    : LIGHT_ORANGE,
              },
            ]}
          >

            <Ionicons
              name={
                netEnergy >= 0
                  ? "trending-up-outline"
                  : "trending-down-outline"
              }
              size={17}
              color={
                netEnergy >= 0
                  ? GREEN
                  : ORANGE
              }
            />

          </View>

          <View>

            <Text style={styles.netTitle}>
              Net Energy
            </Text>

            <Text style={styles.netSubtitle}>
              Consumed − Burned
            </Text>

          </View>

        </View>

        <View style={styles.netRight}>

          <Text
            style={[
              styles.netValue,
              {
                color:
                  netEnergy >= 0
                    ? DARK_GREEN
                    : ORANGE,
              },
            ]}
          >
            {netEnergy > 0
              ? "+"
              : ""}
            {netEnergy.toLocaleString()}
          </Text>

          <Text style={styles.netUnit}>
            kcal
          </Text>

        </View>

      </View>

      {/* =================================================
          GRAPH HEADER
      ================================================= */}

      <View style={styles.graphHeader}>

        <View>

          <Text style={styles.graphTitle}>
            Energy trend
          </Text>

          <Text style={styles.graphSubtitle}>
            Daily consumed vs burned
          </Text>

        </View>

        <View style={styles.legend}>

          <View style={styles.legendItem}>

            <View
              style={[
                styles.legendLine,
                {
                  backgroundColor:
                    GREEN,
                },
              ]}
            />

            <Text style={styles.legendText}>
              Consumed
            </Text>

          </View>

          <View style={styles.legendItem}>

            <View
              style={[
                styles.legendLine,
                {
                  backgroundColor:
                    ORANGE,
                },
              ]}
            />

            <Text style={styles.legendText}>
              Burned
            </Text>

          </View>

        </View>

      </View>

      {/* =================================================
          GRAPH
      ================================================= */}

      <View style={styles.graphContainer}>

        <LineChart
          data={{
            labels:
              weekLabels,

            datasets: [
              {
                data:
                  consumedValues,

                color: (
                  opacity = 1
                ) =>
                  `rgba(33, 153, 49, ${opacity})`,

                strokeWidth: 3,
              },

              {
                data:
                  burnedValues,

                color: (
                  opacity = 1
                ) =>
                  `rgba(255, 122, 0, ${opacity})`,

                strokeWidth: 3,
              },
            ],
          }}

          width={
            screenWidth - 58
          }

          height={235}

          fromZero

          yAxisInterval={1}

          segments={4}

          bezier

          withDots

          withShadow={false}

          withInnerLines

          withOuterLines={false}

          withVerticalLines={false}

          withHorizontalLabels

          withVerticalLabels

          yAxisLabel=""

          yAxisSuffix=""

          chartConfig={{

            backgroundColor:
              GRAPH_BG,

            backgroundGradientFrom:
              GRAPH_BG,

            backgroundGradientTo:
              GRAPH_BG,

            decimalPlaces: 0,

            color: (
              opacity = 1
            ) =>
              `rgba(33, 153, 49, ${opacity})`,

            labelColor: (
              opacity = 1
            ) =>
              `rgba(123, 129, 124, ${opacity})`,

            propsForDots: {
              r: "4",

              strokeWidth:
                "2",

              stroke:
                WHITE,
            },

            propsForBackgroundLines:
              {
                stroke:
                  "#E2E8E2",

                strokeWidth:
                  "1",

                strokeDasharray:
                  "5 5",
              },

            propsForLabels: {
              fontSize: 10,

              fontWeight:
                "600",
            },

          }}

          style={styles.graph}
        />

      </View>

      {/* =================================================
          FOOTER
      ================================================= */}

      <View style={styles.footer}>

        <View style={styles.footerStat}>

          <View
            style={[
              styles.footerDot,
              {
                backgroundColor:
                  GREEN,
              },
            ]}
          />

          <Text style={styles.footerText}>
            Consumed
          </Text>

        </View>

        <View style={styles.footerStat}>

          <View
            style={[
              styles.footerDot,
              {
                backgroundColor:
                  ORANGE,
              },
            ]}
          />

          <Text style={styles.footerText}>
            Burned
          </Text>

        </View>

        <View style={styles.footerRight}>

          <Text style={styles.footerRightText}>
            {netEnergy >= 0
              ? "Calorie surplus"
              : "Calorie deficit"}
          </Text>

        </View>

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

      borderRadius: 24,

      borderWidth: 1,

      borderColor:
        BORDER,

      marginTop: 18,

      paddingTop: 18,

      paddingBottom: 16,

      overflow: "hidden",

      shadowColor:
        "#000",

      shadowOpacity:
        0.035,

      shadowRadius:
        12,

      shadowOffset: {
        width: 0,

        height: 5,
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

    headerIcon: {
      width: 43,

      height: 43,

      borderRadius: 15,

      backgroundColor:
        LIGHT_GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight: 11,
    },

    title: {
      fontSize: 17,

      fontWeight: "800",

      color: TEXT,
    },

    subtitle: {
      fontSize: 10.5,

      color: MUTED,

      marginTop: 4,
    },

    daysBadge: {
      flexDirection:
        "row",

      alignItems:
        "center",

      backgroundColor:
        LIGHT_GREEN,

      borderRadius: 18,

      paddingHorizontal: 9,

      paddingVertical: 6,
    },

    daysBadgeText: {
      fontSize: 9,

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

      gap: 10,

      paddingHorizontal: 17,

      marginTop: 16,
    },

    summaryCard: {
      flex: 1,

      borderRadius: 18,

      padding: 13,

      borderWidth: 1,
    },

    consumedCard: {
      backgroundColor:
        "#F7FBF7",

      borderColor:
        "#DDEADE",
    },

    burnedCard: {
      backgroundColor:
        "#FFF9F4",

      borderColor:
        "#F2E0D1",
    },

    summaryHeader: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    greenIcon: {
      width: 28,

      height: 28,

      borderRadius: 9,

      backgroundColor:
        LIGHT_GREEN,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight: 7,
    },

    orangeIcon: {
      width: 28,

      height: 28,

      borderRadius: 9,

      backgroundColor:
        LIGHT_ORANGE,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight: 7,
    },

    summaryLabel: {
      fontSize: 11,

      fontWeight: "700",

      color: MUTED,
    },

    valueRow: {
      flexDirection:
        "row",

      alignItems:
        "baseline",

      marginTop: 8,
    },

    value: {
      fontSize: 20,

      fontWeight: "900",

      color: TEXT,
    },

    unit: {
      fontSize: 9,

      fontWeight: "600",

      color: MUTED,

      marginLeft: 4,
    },

    average: {
      fontSize: 9,

      color: MUTED,

      marginTop: 4,
    },

    // =================================================
    // NET
    // =================================================

    netCard: {
      marginHorizontal: 17,

      marginTop: 11,

      paddingHorizontal: 13,

      paddingVertical: 12,

      borderRadius: 18,

      backgroundColor:
        "#FAFBFA",

      borderWidth: 1,

      borderColor:
        BORDER,

      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",
    },

    netLeft: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    netIcon: {
      width: 34,

      height: 34,

      borderRadius: 11,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight: 9,
    },

    netTitle: {
      fontSize: 12,

      fontWeight: "800",

      color: TEXT,
    },

    netSubtitle: {
      fontSize: 9,

      color: MUTED,

      marginTop: 3,
    },

    netRight: {
      alignItems:
        "flex-end",
    },

    netValue: {
      fontSize: 19,

      fontWeight: "900",
    },

    netUnit: {
      fontSize: 9,

      color: MUTED,

      marginTop: 1,
    },

    // =================================================
    // GRAPH HEADER
    // =================================================

    graphHeader: {
      flexDirection:
        "row",

      alignItems:
        "flex-end",

      justifyContent:
        "space-between",

      paddingHorizontal: 17,

      marginTop: 20,

      marginBottom: 8,
    },

    graphTitle: {
      fontSize: 13,

      fontWeight: "800",

      color: TEXT,
    },

    graphSubtitle: {
      fontSize: 9,

      color: MUTED,

      marginTop: 3,
    },

    legend: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 10,
    },

    legendItem: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    legendLine: {
      width: 14,

      height: 3,

      borderRadius: 2,

      marginRight: 4,
    },

    legendText: {
      fontSize: 8,

      fontWeight: "600",

      color: MUTED,
    },

    // =================================================
    // GRAPH
    // =================================================

    graphContainer: {
      marginHorizontal: 11,

      borderRadius: 19,

      backgroundColor:
        GRAPH_BG,

      borderWidth: 1,

      borderColor:
        "#EDF1ED",

      overflow: "hidden",

      paddingTop: 4,

      paddingBottom: 4,
    },

    graph: {
      borderRadius: 19,
    },

    // =================================================
    // FOOTER
    // =================================================

    footer: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal: 17,

      marginTop: 10,
    },

    footerStat: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginRight: 17,
    },

    footerDot: {
      width: 7,

      height: 7,

      borderRadius: 4,

      marginRight: 5,
    },

    footerText: {
      fontSize: 9,

      fontWeight: "600",

      color: MUTED,
    },

    footerRight: {
      marginLeft:
        "auto",
    },

    footerRightText: {
      fontSize: 9,

      fontWeight: "700",

      color: DARK_GREEN,
    },
  });