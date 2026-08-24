import { Ionicons } from "@expo/vector-icons";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

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
      (_, index) => {
        return (
          data[index] ?? {
            date: new Date(),
            dateKey: "",
            label:
              labels[index],
            consumed: 0,
            burned: 0,
          }
        );
      }
    );

  // ---------------------------------------------------
  // Values
  // ---------------------------------------------------

  const consumedValues =
    chartData.map((day) =>
      Math.max(
        0,
        Math.round(
          day.consumed || 0
        )
      )
    );

  const burnedValues =
    chartData.map((day) =>
      Math.max(
        0,
        Math.round(
          day.burned || 0
        )
      )
    );

  // ---------------------------------------------------
  // Totals
  // ---------------------------------------------------

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

  const netEnergy =
    totalConsumed -
    totalBurned;

  // ---------------------------------------------------
  // Current week average
  // ---------------------------------------------------

  const averageConsumed =
    Math.round(
      totalConsumed / 7
    );

  const averageBurned =
    Math.round(
      totalBurned / 7
    );

  // ---------------------------------------------------
  // Chart
  // ---------------------------------------------------

  return (
    <View style={styles.card}>

      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>

          <View
            style={styles.headerIcon}
          >
            <Ionicons
              name="flash-outline"
              size={21}
              color={GREEN}
            />
          </View>

          <View>
            <Text
              style={styles.title}
            >
              Weekly Energy
            </Text>

            <Text
              style={styles.subtitle}
            >
              Calories consumed vs burned
            </Text>
          </View>

        </View>
      </View>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <View style={styles.summaryRow}>

        {/* -----------------------------------------------
            CONSUMED
        ----------------------------------------------- */}

        <View
          style={[
            styles.summaryBox,
            styles.consumedBox,
          ]}
        >
          <View
            style={styles.summaryTop}
          >
            <View
              style={[
                styles.summaryIcon,
                styles.consumedIcon,
              ]}
            >
              <Ionicons
                name="restaurant-outline"
                size={16}
                color={GREEN}
              />
            </View>

            <Text
              style={styles.summaryLabel}
            >
              Consumed
            </Text>
          </View>

          <View
            style={styles.valueRow}
          >
            <Text
              style={styles.summaryValue}
            >
              {totalConsumed.toLocaleString()}
            </Text>

            <Text
              style={styles.unit}
            >
              kcal
            </Text>
          </View>

          <Text
            style={styles.average}
          >
            {averageConsumed.toLocaleString()}
            {" "}avg/day
          </Text>
        </View>

        {/* -----------------------------------------------
            BURNED
        ----------------------------------------------- */}

        <View
          style={[
            styles.summaryBox,
            styles.burnedBox,
          ]}
        >
          <View
            style={styles.summaryTop}
          >
            <View
              style={[
                styles.summaryIcon,
                styles.burnedIcon,
              ]}
            >
              <Ionicons
                name="flame-outline"
                size={16}
                color={ORANGE}
              />
            </View>

            <Text
              style={styles.summaryLabel}
            >
              Burned
            </Text>
          </View>

          <View
            style={styles.valueRow}
          >
            <Text
              style={styles.summaryValue}
            >
              {totalBurned.toLocaleString()}
            </Text>

            <Text
              style={styles.unit}
            >
              kcal
            </Text>
          </View>

          <Text
            style={styles.average}
          >
            {averageBurned.toLocaleString()}
            {" "}avg/day
          </Text>
        </View>

      </View>

      {/* =================================================
          NET ENERGY
      ================================================= */}

      <View
        style={styles.netEnergyCard}
      >
        <View
          style={styles.netLeft}
        >
          <View
            style={styles.netIcon}
          >
            <Ionicons
              name={
                netEnergy >= 0
                  ? "trending-up-outline"
                  : "trending-down-outline"
              }
              size={18}
              color={
                netEnergy >= 0
                  ? GREEN
                  : ORANGE
              }
            />
          </View>

          <View>
            <Text
              style={styles.netTitle}
            >
              Net Energy
            </Text>

            <Text
              style={styles.netSubtitle}
            >
              Consumed − Burned
            </Text>
          </View>
        </View>

        <View
          style={styles.netValueContainer}
        >
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

          <Text
            style={styles.netUnit}
          >
            kcal
          </Text>
        </View>
      </View>

      {/* =================================================
          CHART TITLE
      ================================================= */}

      <View
        style={styles.chartHeader}
      >
        <Text
          style={styles.chartTitle}
        >
          Daily energy
        </Text>

        <Text
          style={styles.chartSubtitle}
        >
          Current week
        </Text>
      </View>

      {/* =================================================
          CHART
      ================================================= */}

      <View
        style={styles.chartWrapper}
      >
        <BarChart
          data={{
            labels: chartData.map(
              (day) =>
                day.label
            ),

            datasets: [
              {
                data:
                  consumedValues,

                color: () =>
                  GREEN,
              },

              {
                data:
                  burnedValues,

                color: () =>
                  ORANGE,
              },
            ],
          }}

          width={
            screenWidth - 36
          }

          height={235}

          fromZero

          showValuesOnTopOfBars={false}

          withInnerLines

          withVerticalLabels

          withHorizontalLabels

          yAxisLabel=""

          yAxisSuffix=""

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
              `rgba(33, 153, 49, ${opacity})`,

            labelColor: (
              opacity = 1
            ) =>
              `rgba(123, 129, 124, ${opacity})`,

            barPercentage: 0.38,

           // group: 2,

            propsForBackgroundLines:
              {
                stroke:
                  "#E8EDE8",

                strokeWidth:
                  "1",
              },

            propsForLabels: {
              fontSize: 10,
              fontWeight:
                "600",
            },
          }}

          style={
            styles.chart
          }
        />
      </View>

      {/* =================================================
          LEGEND
      ================================================= */}

      <View
        style={styles.legendContainer}
      >

        {/* Consumed */}

        <View
          style={styles.legendItem}
        >
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor:
                  GREEN,
              },
            ]}
          />

          <Text
            style={styles.legendText}
          >
            Consumed
          </Text>
        </View>

        {/* Burned */}

        <View
          style={styles.legendItem}
        >
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor:
                  ORANGE,
              },
            ]}
          />

          <Text
            style={styles.legendText}
          >
            Burned
          </Text>
        </View>

        <Text
          style={styles.legendHint}
        >
          kcal
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
      paddingBottom: 15,

      overflow: "hidden",

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
      paddingHorizontal: 17,
    },

    headerLeft: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    headerIcon: {
      width: 42,
      height: 42,

      borderRadius: 14,

      backgroundColor:
        LIGHT_GREEN,

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

      marginTop: 3,
    },

    // =================================================
    // SUMMARY
    // =================================================

    summaryRow: {
      flexDirection:
        "row",

      gap: 10,

      paddingHorizontal: 17,

      marginTop: 15,
    },

    summaryBox: {
      flex: 1,

      borderRadius: 17,

      padding: 12,

      borderWidth: 1,
    },

    consumedBox: {
      backgroundColor:
        "#F6FBF7",

      borderColor:
        "#DDEBDF",
    },

    burnedBox: {
      backgroundColor:
        "#FFF9F4",

      borderColor:
        "#F3E1D2",
    },

    summaryTop: {
      flexDirection:
        "row",

      alignItems:
        "center",
    },

    summaryIcon: {
      width: 28,
      height: 28,

      borderRadius: 9,

      alignItems:
        "center",

      justifyContent:
        "center",

      marginRight: 7,
    },

    consumedIcon: {
      backgroundColor:
        LIGHT_GREEN,
    },

    burnedIcon: {
      backgroundColor:
        LIGHT_ORANGE,
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

      marginTop: 7,
    },

    summaryValue: {
      fontSize: 19,

      fontWeight: "800",

      color: TEXT,
    },

    unit: {
      fontSize: 9,

      fontWeight: "600",

      color: MUTED,

      marginLeft: 3,
    },

    average: {
      fontSize: 9,

      color: MUTED,

      marginTop: 3,
    },

    // =================================================
    // NET ENERGY
    // =================================================

    netEnergyCard: {
      marginHorizontal: 17,

      marginTop: 10,

      paddingHorizontal: 12,

      paddingVertical: 11,

      borderRadius: 17,

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
      width: 32,
      height: 32,

      borderRadius: 10,

      backgroundColor:
        LIGHT_GREEN,

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

      marginTop: 2,
    },

    netValueContainer: {
      alignItems:
        "flex-end",
    },

    netValue: {
      fontSize: 18,

      fontWeight: "900",
    },

    netUnit: {
      fontSize: 9,

      color: MUTED,

      marginTop: 1,
    },

    // =================================================
    // CHART HEADER
    // =================================================

    chartHeader: {
      paddingHorizontal: 17,

      marginTop: 18,

      marginBottom: 2,

      flexDirection:
        "row",

      alignItems:
        "baseline",

      justifyContent:
        "space-between",
    },

    chartTitle: {
      fontSize: 13,

      fontWeight: "800",

      color: TEXT,
    },

    chartSubtitle: {
      fontSize: 9,

      color: MUTED,
    },

    // =================================================
    // CHART
    // =================================================

    chartWrapper: {
      marginTop: 4,

      marginLeft: -8,

      marginRight: -8,

      overflow: "hidden",
    },

    chart: {
      borderRadius: 18,
    },

    // =================================================
    // LEGEND
    // =================================================

    legendContainer: {
      flexDirection:
        "row",

      alignItems:
        "center",

      paddingHorizontal: 17,

      marginTop: -2,
    },

    legendItem: {
      flexDirection:
        "row",

      alignItems:
        "center",

      marginRight: 17,
    },

    legendDot: {
      width: 8,
      height: 8,

      borderRadius: 4,

      marginRight: 6,
    },

    legendText: {
      fontSize: 10,

      color: MUTED,

      fontWeight: "600",
    },

    legendHint: {
      marginLeft: "auto",

      fontSize: 9,

      color: MUTED,
    },
  });