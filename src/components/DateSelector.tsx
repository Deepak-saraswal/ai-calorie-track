
import { useEffect, useMemo, useRef } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GREEN = "#219931";
const GREY = "#F3F4F3";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";

interface DateItem {
  id: string;
  date: Date;
  day: string;
  dateNumber: number;
  month: string;
  isToday: boolean;
}

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  numberOfDays?: number;
}

const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const getDays = (numberOfDays: number): DateItem[] => {
  const days: DateItem[] = [];

  // Oldest -> Today
  for (let i = numberOfDays; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);

    days.push({
      id: formatDate(date),
      date,

      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),

      dateNumber: date.getDate(),

      month: date.toLocaleDateString("en-US", {
        month: "short",
      }),

      isToday: i === 0,
    });
  }

  return days;
};

export default function DateSelector({
  selectedDate,
  onDateChange,
  numberOfDays = 30,
}: DateSelectorProps) {
  const flatListRef = useRef<FlatList>(null);

  const days = useMemo(
    () => getDays(numberOfDays),
    [numberOfDays]
  );

  /*
   * Today is the last item.
   *
   * When the component opens, scroll to today.
   */
  useEffect(() => {
    const todayIndex = days.length - 1;

    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: todayIndex,
        animated: false,
        viewPosition: 1,
      });
    }, 100);
  }, [days.length]);

  const renderDay = ({
    item,
  }: {
    item: DateItem;
  }) => {
    const selected = item.id === selectedDate;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onDateChange(item.id)}
        style={[
          styles.dayItem,
          selected && styles.selectedDayItem,
        ]}
      >
        {/* Day */}
        <Text
          style={[
            styles.dayName,
            selected && styles.selectedDayText,
          ]}
        >
          {item.day}
        </Text>

        {/* Date */}
        <View
          style={[
            styles.dateCircle,
            selected && styles.selectedDateCircle,
          ]}
        >
          <Text
            style={[
              styles.dateNumber,
              selected && styles.selectedDateNumber,
            ]}
          >
            {item.dateNumber}
          </Text>
        </View>

        {/* Month */}
        <Text
          style={[
            styles.monthText,
            selected && styles.selectedDayText,
          ]}
        >
          {item.month}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Your Days
        </Text>

        <Text style={styles.selectedDateText}>
          {new Date(selectedDate).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          )}
        </Text>
      </View>

      {/* Dates */}
      <FlatList
        ref={flatListRef}
        data={days}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderDay}
        contentContainerStyle={styles.daysList}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false,
            });
          }, 100);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,

    paddingTop: 15,
    paddingBottom: 13,

    borderBottomWidth: 1,
    borderBottomColor: "#E6E9E6",
  },

  sectionHeader: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 20,

    marginBottom: 11,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",

    color: TEXT,
  },

  selectedDateText: {
    fontSize: 13,
    fontWeight: "600",

    color: GREEN,
  },

  daysList: {
    paddingHorizontal: 15,
  },

  dayItem: {
    width: 62,
    height: 86,

    borderRadius: 17,

    marginHorizontal: 4,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: GREY,
  },

  selectedDayItem: {
    backgroundColor: GREEN,
  },

  dayName: {
    fontSize: 12,
    fontWeight: "600",

    color: MUTED,

    marginBottom: 5,
  },

  selectedDayText: {
    color: WHITE,
  },

  dateCircle: {
    width: 31,
    height: 31,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
  },

  selectedDateCircle: {
    backgroundColor: WHITE,
  },

  dateNumber: {
    fontSize: 15,
    fontWeight: "700",

    color: TEXT,
  },

  selectedDateNumber: {
    color: GREEN,
  },

  monthText: {
    fontSize: 10,

    color: MUTED,

    marginTop: 4,
  },
});