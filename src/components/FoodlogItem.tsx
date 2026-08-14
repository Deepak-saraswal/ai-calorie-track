import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";

export type LogType = "food" | "exercise" | "water";

interface FoodlogItemProps {
  title: string;
  time: string;
  calories: number;
  type?: LogType;
  duration?: string;
  intensity?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
}

export default function FoodlogItem({
  title,
  time,
  calories,
  type = "exercise",
  duration,
  intensity,
  icon,
  onPress,
}: FoodlogItemProps) {
  // ---------------------------------------
  // Default icon based on activity type
  // ---------------------------------------

  const defaultIcon =
    type === "food"
      ? "food-outline"
      : type === "water"
      ? "water-outline"
      : "dumbbell";

  // ---------------------------------------
  // Calorie icon
  // ---------------------------------------

  const calorieIcon =
    type === "food"
      ? "restaurant-outline"
      : type === "water"
      ? "water-outline"
      : "flame-outline";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={icon || defaultIcon}
          size={27}
          color={GREEN}
        />
      </View>

      {/* Information */}
      <View style={styles.info}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Text>

        <View style={styles.calorieRow}>
          <Ionicons
            name={calorieIcon}
            size={16}
            color={GREEN}
          />

          <Text style={styles.calorieText}>
            {type === "water"
              ? `${calories} ml`
              : `${calories} Calories`}
          </Text>
        </View>

        {duration || intensity ? (
          <Text style={styles.details}>
            {intensity
              ? `Intensity: ${intensity}`
              : ""}

            {intensity && duration
              ? " • "
              : ""}

            {duration
              ? `Duration: ${duration}`
              : ""}
          </Text>
        ) : null}
      </View>

      {/* Time */}
      <Text style={styles.time}>
        {time}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: WHITE,
    minHeight: 88,
    borderRadius: 16,
    marginBottom: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E9E5",
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: LIGHT_GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  info: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT,
    marginBottom: 4,
  },

  calorieRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  calorieText: {
    fontSize: 13,
    color: DARK_GREEN,
    marginLeft: 4,
    fontWeight: "600",
  },

  details: {
    fontSize: 10,
    color: MUTED,
    marginTop: 5,
  },

  time: {
    fontSize: 10,
    color: MUTED,
    alignSelf: "flex-start",
  },
});