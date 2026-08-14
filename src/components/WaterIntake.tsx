import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GREEN = "#219931";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";

interface WaterIntakeProps {
  glasses: number;
  totalGlasses: number;
  onEdit?: () => void;
  onChange?: (glasses: number) => void;
}

export default function WaterIntake({
  glasses,
  totalGlasses,
  onEdit,
  onChange,
}: WaterIntakeProps) {

  const handleGlassPress = (index: number) => {
    const newValue = index + 1;

    onChange?.(newValue);
  };

  const progress =
    totalGlasses > 0
      ? Math.min(
          (glasses / totalGlasses) * 100,
          100
        )
      : 0;

  return (
    <View style={styles.card}>

      {/* ==========================================
          Header
      ========================================== */}

      <View style={styles.cardHeader}>

        <Text style={styles.cardTitle}>
          Water
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


      {/* ==========================================
          Water Droplets
      ========================================== */}

    <View style={styles.glassesContainer}>
  {Array.from({
    length: totalGlasses,
  }).map((_, index) => {
    const filled = index < glasses;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.7}
        onPress={() => handleGlassPress(index)}
        style={styles.glassButton}
      >
        <Ionicons
          name={
            filled
              ? "water"
              : "water-outline"
          }
          size={24}
          color={
            filled
              ? GREEN
              : "#B8C1BA"
          }
        />
      </TouchableOpacity>
    );
  })}
</View>

      {/* ==========================================
          Consumed
      ========================================== */}

      <View style={styles.bottomSection}>

        <View style={styles.waterIcon}>

          <Ionicons
            name="water-outline"
            size={17}
            color={GREEN}
          />

        </View>

        <Text style={styles.waterText}>

          {glasses} Glass
          {glasses !== 1 ? "es" : ""} Consumed

        </Text>

      </View>


      {/* ==========================================
          Progress
      ========================================== */}

      <View style={styles.progressBackground}>

        <View
          style={[
            styles.progress,
            {
              width: `${progress}%`,
            },
          ]}
        />

      </View>


      {/* ==========================================
          Goal
      ========================================== */}

      <Text style={styles.goalText}>
        Goal: {totalGlasses} glasses
      </Text>

    </View>
  );
}


// ==================================================
// Styles
// ==================================================

const styles = StyleSheet.create({

  // ================================================
  // Card
  // ================================================

  card: {
    backgroundColor: WHITE,

    borderRadius: 20,

    padding: 17,

    marginBottom: 16,

    borderWidth: 1,

    borderColor: "#E5E9E5",
  },


  // ================================================
  // Header
  // ================================================

  cardHeader: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 14,
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


  // ================================================
  // Droplets
  // ================================================

  glassesContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  paddingHorizontal: 2,
},

 glassButton: {
  width: "10%",
  height: 42,
  justifyContent: "center",
  alignItems: "center",
},


  // ================================================
  // Consumed
  // ================================================

  bottomSection: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 8,
  },

  waterIcon: {
    width: 27,

    height: 27,

    borderRadius: 14,

    backgroundColor:
      LIGHT_GREEN,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 7,
  },

  waterText: {
    fontSize: 13,

    color: MUTED,

    fontWeight: "600",
  },


  // ================================================
  // Progress
  // ================================================

  progressBackground: {
    height: 6,

    backgroundColor:
      "#E6EBE6",

    borderRadius: 5,

    overflow: "hidden",

    marginTop: 13,
  },

  progress: {
    height: "100%",

    backgroundColor: GREEN,

    borderRadius: 5,
  },


  // ================================================
  // Goal
  // ================================================

  goalText: {
    fontSize: 10,

    color: MUTED,

    textAlign: "right",

    marginTop: 5,
  },

});