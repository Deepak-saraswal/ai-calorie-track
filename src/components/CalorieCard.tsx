import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { HalfProgressbar } from "./HalfProgressbar";

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";

interface CalorieCardProps {
  // Calories
  calories: number;
  calorieGoal: number;

  // Protein
  protein?: number;
  proteinGoal?: number;

  // Fat
  fat?: number;
  fatGoal?: number;

  // Carbs
  carbs?: number;
  carbsGoal?: number;

  onEdit?: () => void;
}

export default function CalorieCard({
  calories,
  calorieGoal,

  protein = 0,
  proteinGoal = 0,

  fat = 0,
  fatGoal = 0,

  carbs = 0,
  carbsGoal = 0,

  onEdit,
}: CalorieCardProps) {
  // ==================================
  // Calorie progress
  // ==================================

  const progress =
    calorieGoal > 0
      ? calories / calorieGoal
      : 0;

  // ==================================
  // Remaining values
  // ==================================

  const remainingCalories = Math.max(
    calorieGoal - calories,
    0
  );

  const remainingProtein = Math.max(
    proteinGoal - protein,
    0
  );

  const remainingFat = Math.max(
    fatGoal - fat,
    0
  );

  const remainingCarbs = Math.max(
    carbsGoal - carbs,
    0
  );

  return (
    <View style={styles.card}>

      {/* ================================
          Header
      ================================= */}

      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          Calories
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onEdit}
        >
          <Text style={styles.editText}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================================
          Half Progress
      ================================= */}

      <View style={styles.progressWrapper}>
        <HalfProgressbar
          progress={Math.min(progress, 1)}
          size={240}
          strokeWidth={6}
          segments={21}
          value={calories}
          label="kcal"
        />
      </View>

      {/* ================================
          Daily Goal / Remaining
      ================================= */}

      <View style={styles.goalContainer}>
        <Text style={styles.goalLabel}>
          Remaining
        </Text>

        <Text style={styles.goalValue}>
          {remainingCalories} kcal
        </Text>

        <Text style={styles.goalSubText}>
          of {calorieGoal} kcal daily goal
        </Text>
      </View>

      {/* ================================
          Macros
      ================================= */}

      <View style={styles.macroContainer}>

        {/* Protein */}

        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>
            Protein
          </Text>

          <Text style={styles.macroValue}>
            {remainingProtein}g
          </Text>

          <Text style={styles.macroSubText}>
            of {proteinGoal}g
          </Text>
        </View>

        {/* Fat */}

        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>
            Fat
          </Text>

          <Text style={styles.macroValue}>
            {remainingFat}g
          </Text>

          <Text style={styles.macroSubText}>
            of {fatGoal}g
          </Text>
        </View>

        {/* Carbs */}

        <View style={styles.macroBox}>
          <Text style={styles.macroTitle}>
            Carbs
          </Text>

          <Text style={styles.macroValue}>
            {remainingCarbs}g
          </Text>

          <Text style={styles.macroSubText}>
            of {carbsGoal}g
          </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ==================================
  // Card
  // ==================================

  card: {
    backgroundColor: WHITE,

    borderRadius: 20,

    paddingHorizontal: 17,
    paddingTop: 17,
    paddingBottom: 17,

    marginBottom: 14,

    borderWidth: 1,
    borderColor: "#E5E9E5",
  },

  // ==================================
  // Header
  // ==================================

  cardHeader: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 2,
  },

  cardTitle: {
    fontSize: 17,

    fontWeight: "700",

    color: TEXT,
  },

  editText: {
    fontSize: 14,

    fontWeight: "700",

    color: GREEN,
  },

  // ==================================
  // Progress
  // ==================================

  progressWrapper: {
    alignItems: "center",

    justifyContent: "center",

    marginTop: 2,
  },

  // ==================================
  // Goal
  // ==================================

  goalContainer: {
    alignItems: "center",

    marginTop: -2,

    marginBottom: 15,
  },

  goalLabel: {
    fontSize: 12,

    color: MUTED,
  },

  goalValue: {
    fontSize: 17,

    fontWeight: "700",

    color: DARK_GREEN,

    marginTop: 2,
  },

  goalSubText: {
    fontSize: 10,

    color: MUTED,

    marginTop: 2,
  },

  // ==================================
  // Macros
  // ==================================

  macroContainer: {
    flexDirection: "row",

    gap: 9,
  },

  macroBox: {
    flex: 1,

    backgroundColor: "#F4F6F4",

    borderRadius: 13,

    paddingVertical: 12,

    alignItems: "center",
  },

  macroTitle: {
    fontSize: 12,

    color: MUTED,

    marginBottom: 5,
  },

  macroValue: {
    fontSize: 17,

    fontWeight: "700",

    color: DARK_GREEN,
  },

  macroSubText: {
    fontSize: 10,

    color: MUTED,

    marginTop: 2,
  },
});