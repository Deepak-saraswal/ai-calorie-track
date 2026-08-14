import { StyleSheet, Text, View } from "react-native";
import Svg, { Line } from "react-native-svg";

type Props = {
  progress: number;
  size?: number;
  strokeWidth?: number;
  segments?: number;
  value?: number;
  label?: string;
};

export function HalfProgressbar({
  progress,
  size = 240,
  strokeWidth = 6,
  segments = 21,
  value,
  label = "kcal",
}: Props) {
  const clampedProgress = Math.max(
    0,
    Math.min(1, progress)
  );

  const center = size / 2;

  // Distance from center to OUTSIDE of each line
  const outerRadius = size / 2 - 12;

  // Same length for EVERY line
  const tickLength = 26;

  const innerRadius =
    outerRadius - tickLength;

  // 180° half circle
  const angleStep =
    180 / (segments - 1);

  const activeSegments = Math.round(
    clampedProgress * segments
  );

  const getPoint = (
    radius: number,
    angle: number
  ) => {
    const radians =
      (angle * Math.PI) / 180;

    return {
      x:
        center +
        radius * Math.cos(radians),

      y:
        center -
        radius * Math.sin(radians),
    };
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size / 2 + 35,
        },
      ]}
    >
      <Svg
        width={size}
        height={size / 2 + 35}
      >
        {Array.from({
          length: segments,
        }).map((_, index) => {
          // Exactly evenly spaced
          const angle =
            180 - index * angleStep;

          // Same radius for every line
          const start = getPoint(
            innerRadius,
            angle
          );

          const end = getPoint(
            outerRadius,
            angle
          );

          const isActive =
            index < activeSegments;

          return (
            <Line
              key={index}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={
                isActive
                  ? "#219931"
                  : "#E1E6E1"
              }
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        })}
      </Svg>

      {/* Center Value */}
      <View style={styles.textOverlay}>
        {value !== undefined && (
          <Text style={styles.mainText}>
            {value}
          </Text>
        )}

        <Text style={styles.subText}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start",
  },

  textOverlay: {
    position: "absolute",
    bottom: 0,

    alignItems: "center",
    justifyContent: "center",
  },

  mainText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#252825",
  },

  subText: {
    fontSize: 12,
    color: "#7B817C",
    marginTop: 1,
  },
});