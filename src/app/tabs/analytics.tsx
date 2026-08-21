import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
   ActivityIndicator,
   Image,
   Modal,
   Pressable,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";

import { getUserProfile } from "@/lib/profileService";

import Report from "../report";

import {
   calculateCurrentStreak,
   getCurrentWeekActivity,
   WeeklyActivityDay,
} from "../../lib/dailyLogService";

// =====================================================
// Colors
// =====================================================

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";
const BACKGROUND = "#F7F8F7";
const BORDER = "#E5EAE5";
const ORANGE = "#FF7A00";

// =====================================================
// Week labels
// =====================================================

const WEEK_LABELS = [
  "S",
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
];

// =====================================================
// Analytics
// =====================================================

export default function Analytics() {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);

  const [hasPlan, setHasPlan] = useState(false);

  const [weight, setWeight] = useState<number | null>(null);

  const [weeklyActivity, setWeeklyActivity] =
    useState<WeeklyActivityDay[]>([]);

  const [currentStreak, setCurrentStreak] =
    useState(0);

  const [showStreakModal, setShowStreakModal] =
    useState(false);

  // ===================================================
  // Load Analytics Data
  // ===================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    loadAnalytics();
  }, [user?.id]);

  async function loadAnalytics() {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);

      // ===============================================
      // Load profile
      // ===============================================

      const profile = await getUserProfile(user.id);

      if (profile?.aiPlan) {
        setHasPlan(true);
      } else {
        setHasPlan(false);
      }

      // ===============================================
      // Load weight
      // ===============================================

      if (
        profile?.weight !== undefined &&
        profile?.weight !== null
      ) {
        const userWeight = Number(profile.weight);

        if (!Number.isNaN(userWeight)) {
          setWeight(userWeight);
        }
      }

      // ===============================================
      // Load current week activity
      // ===============================================

      const activity =
        await getCurrentWeekActivity(user.id);

      setWeeklyActivity(activity);

      // ===============================================
      // Calculate streak
      // ===============================================

      const streak =
        calculateCurrentStreak(activity);

      setCurrentStreak(streak);
    } catch (error) {
      console.log(
        "ANALYTICS LOAD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // Loading
  // ===================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={GREEN}
          />

          <Text style={styles.loadingText}>
            Loading your progress...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ===================================================
  // Week Day Helper
  // ===================================================

  function getWeekDayActivity(index: number) {
    return (
      weeklyActivity[index]?.active ?? false
    );
  }

  // ===================================================
  // Render
  // ===================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* =========================================
            HEADER
        ========================================= */}

        <Text style={styles.heading}>
          Progress
        </Text>

        <Text style={styles.subtitle}>
          Stay consistent and track your progress
        </Text>

        {/* =========================================
            PROGRESS CARDS
        ========================================= */}

        <View style={styles.cardsRow}>
          {/* =======================================
              DAILY STREAK
          ======================================= */}

          <Pressable
            onPress={() =>
              setShowStreakModal(true)
            }
            style={({ pressed }) => [
              styles.progressCard,
              styles.streakCard,
              pressed && styles.cardPressed,
            ]}
          >
            {/* Fire */}

            <View style={styles.streakTopRow}>
  <View style={styles.fireContainer}>
    <Image
      source={require("../../../assets/images/fire.png")}
      style={styles.fireImage}
      resizeMode="contain"
    />
  </View>

  <View style={styles.streakArrow}>
    <Ionicons
      name="chevron-forward"
      size={17}
      color={MUTED}
    />
  </View>
</View>

            {/* Streak */}

            <Text style={styles.streakNumber}>
              {currentStreak}
            </Text>

            <Text style={styles.cardTitle}>
              Daily Streak
            </Text>

            {/* Current Week */}

            <Text style={styles.weekTitle}>
              Current Week
            </Text>

            {/* Week */}

            <View style={styles.weekRow}>
              {WEEK_LABELS.map(
                (day, index) => {
                  const active =
                    getWeekDayActivity(index);

                  return (
                    <View
                      key={`${day}-${index}`}
                      style={styles.weekDay}
                    >
                      {/* Day */}

                      <Text
                        style={[
                          styles.dayLabel,
                          active &&
                            styles.activeDayLabel,
                        ]}
                      >
                        {day}
                      </Text>

                      {/* Check */}

                      <View
                        style={[
                          styles.checkCircle,
                          active &&
                            styles.activeCheckCircle,
                        ]}
                      >
                        {active && (
                          <Ionicons
                            name="checkmark"
                            size={11}
                            color={WHITE}
                          />
                        )}
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          </Pressable>

          {/* =======================================
              WEIGHT
          ======================================= */}

          <View
            style={[
              styles.progressCard,
              styles.weightCard,
            ]}
          >
            {/* Icon */}

            <View style={styles.weightIcon}>
              <Ionicons
                name="scale-outline"
                size={25}
                color={GREEN}
              />
            </View>

            {/* Weight */}

            <View
              style={styles.weightValueRow}
            >
              <Text
                style={styles.weightValue}
              >
                {weight !== null
                  ? weight
                  : "--"}
              </Text>

              {weight !== null && (
                <Text
                  style={styles.weightUnit}
                >
                  kg
                </Text>
              )}
            </View>

            <Text style={styles.cardTitle}>
              My Weight
            </Text>

            <Text style={styles.weightHint}>
              Current weight
            </Text>
          </View>
        </View>

        {/* =========================================
            EXISTING REPORT
        ========================================= */}

        {hasPlan ? (
          <View
            style={styles.reportContainer}
          >
            <Report />
          </View>
        ) : (
          <View
            style={styles.noPlanContainer}
          >
            <Ionicons
              name="analytics-outline"
              size={36}
              color={MUTED}
            />

            <Text
              style={styles.noPlanTitle}
            >
              Fitness plan not available
            </Text>

            <Text
              style={styles.noPlanText}
            >
              Complete your fitness plan to
              see your detailed progress.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* =================================================
          DAILY STREAK MODAL
      ================================================= */}

      <Modal
        visible={showStreakModal}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowStreakModal(false)
        }
      >
        <View style={styles.modalOverlay}>
          {/* Backdrop */}

          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() =>
              setShowStreakModal(false)
            }
          />

          {/* Modal */}

          <View style={styles.streakModal}>
            {/* =========================================
                CLOSE BUTTON
            ========================================= */}

            <Pressable
              style={styles.closeButton}
              onPress={() =>
                setShowStreakModal(false)
              }
            >
              <Ionicons
                name="close"
                size={22}
                color={MUTED}
              />
            </Pressable>

            {/* =========================================
                FIRE
            ========================================= */}

            <View
              style={
                styles.modalFireContainer
              }
            >
              <Image
                source={require("../../../assets/images/fire.png")}
                style={styles.modalFire}
                resizeMode="contain"
              />
            </View>

            {/* =========================================
                TITLE
            ========================================= */}

            <Text style={styles.modalTitle}>
              Daily Streak
            </Text>

            <Text
              style={styles.modalSubtitle}
            >
              Keep showing up every day
            </Text>

            {/* =========================================
                BIG STREAK CARD
            ========================================= */}

            <View
              style={styles.bigStreakCard}
            >
              <View>
                <Text
                  style={
                    styles.bigStreakLabel
                  }
                >
                  Current streak
                </Text>

                <View
                  style={
                    styles.bigStreakNumberRow
                  }
                >
                  <Text
                    style={
                      styles.bigStreakNumber
                    }
                  >
                    {currentStreak}
                  </Text>

                  <Text
                    style={
                      styles.bigStreakDays
                    }
                  >
                    {currentStreak === 1
                      ? "day"
                      : "days"}
                  </Text>
                </View>
              </View>

              {/* Fire chip */}

              <View style={styles.fireChip}>
                <Text
                  style={styles.fireEmoji}
                >
                  🔥
                </Text>

                <Text
                  style={
                    styles.fireChipText
                  }
                >
                  Keep it going
                </Text>
              </View>
            </View>

            {/* =========================================
                WEEK
            ========================================= */}

            <Text
              style={styles.modalWeekTitle}
            >
              This Week
            </Text>

            <View
              style={styles.modalWeekCard}
            >
              {WEEK_LABELS.map(
                (day, index) => {
                  const active =
                    getWeekDayActivity(index);

                  return (
                    <View
                      key={`${day}-modal-${index}`}
                      style={styles.modalDayItem}
                    >
                      <Text
                        style={
                          styles.modalDayLetter
                        }
                      >
                        {day}
                      </Text>

                      <View
                        style={[
                          styles.modalDayCircle,
                          active &&
                            styles.modalDayCompleted,
                        ]}
                      >
                        {active ? (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={WHITE}
                          />
                        ) : (
                          <View
                            style={
                              styles.modalEmptyDot
                            }
                          />
                        )}
                      </View>
                    </View>
                  );
                }
              )}
            </View>

            {/* =========================================
                MOTIVATION
            ========================================= */}

            <View
              style={styles.motivationBox}
            >
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={GREEN}
              />

              <Text
                style={
                  styles.motivationText
                }
              >
                Log at least one activity every
                day to keep your streak alive.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  // ===================================================
  // Screen
  // ===================================================

  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 120,
  },

  // ===================================================
  // Header
  // ===================================================

  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: TEXT,
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: 13,
    color: MUTED,
    marginTop: 5,
    marginBottom: 22,
  },

  // ===================================================
  // Cards
  // ===================================================

  cardsRow: {
    flexDirection: "row",
    gap: 12,
  },

  progressCard: {
    flex: 1,

    minHeight: 225,

    backgroundColor: WHITE,

    borderRadius: 22,

    borderWidth: 1,
    borderColor: BORDER,

    padding: 15,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  streakCard: {
    backgroundColor: WHITE,
  },

  weightCard: {
    justifyContent: "flex-start",
  },

  cardPressed: {
    transform: [
      {
        scale: 0.98,
      },
    ],
    opacity: 0.92,
  },

  // ===================================================
  // Fire
  // ===================================================

  fireContainer: {
    width: 43,
    height: 43,

    borderRadius: 15,

    backgroundColor: "#FFF3E8",

    alignItems: "center",
    justifyContent: "center",
  },
streakTopRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

streakArrow: {
  width: 30,
  height: 30,

  borderRadius: 15,

  backgroundColor: "#F5F7F5",

  alignItems: "center",
  justifyContent: "center",
},
  fireImage: {
    width: 29,
    height: 29,
  },

  // ===================================================
  // Streak
  // ===================================================

  streakNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: TEXT,
    marginTop: 7,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: TEXT,
    marginTop: 1,
  },

  weekTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: MUTED,
    marginTop: 14,
    marginBottom: 8,
  },

  // ===================================================
  // Week
  // ===================================================

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  weekDay: {
    alignItems: "center",
    justifyContent: "center",
  },

  dayLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: MUTED,
    marginBottom: 5,
  },

  activeDayLabel: {
    color: GREEN,
  },

  checkCircle: {
    width: 19,
    height: 19,

    borderRadius: 9.5,

    borderWidth: 1.5,
    borderColor: "#D9DFD9",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F5F7F5",
  },

  activeCheckCircle: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },

  // ===================================================
  // Weight
  // ===================================================

  weightIcon: {
    width: 46,
    height: 46,

    borderRadius: 15,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",
  },

  weightValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 19,
  },

  weightValue: {
    fontSize: 30,
    fontWeight: "800",
    color: TEXT,
  },

  weightUnit: {
    fontSize: 13,
    fontWeight: "700",
    color: MUTED,
    marginLeft: 4,
  },

  weightHint: {
    fontSize: 11,
    color: MUTED,
    marginTop: 7,
  },

  // ===================================================
  // Report
  // ===================================================

  reportContainer: {
    marginTop: 24,
  },

  // ===================================================
  // No Plan
  // ===================================================

  noPlanContainer: {
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: WHITE,

    borderRadius: 20,

    padding: 30,

    marginTop: 24,

    borderWidth: 1,
    borderColor: BORDER,
  },

  noPlanTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,
    marginTop: 10,
  },

  noPlanText: {
    fontSize: 12,
    color: MUTED,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 5,
  },

  // ===================================================
  // Loading
  // ===================================================

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 13,
    color: MUTED,
    marginTop: 10,
  },

  // ===================================================
  // MODAL
  // ===================================================

  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.45)",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 18,
  },

  streakModal: {
    width: "100%",

    backgroundColor: WHITE,

    borderRadius: 30,

    padding: 22,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: {
      width: 0,
      height: 12,
    },

    elevation: 15,
  },

  closeButton: {
    position: "absolute",

    right: 18,
    top: 18,

    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: "#F3F5F3",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 10,
  },

  modalFireContainer: {
    width: 76,
    height: 76,

    borderRadius: 25,

    backgroundColor: "#FFF3E6",

    alignItems: "center",
    justifyContent: "center",

    alignSelf: "center",

    marginTop: 8,
  },

  modalFire: {
    width: 52,
    height: 52,
  },

  modalTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: TEXT,

    textAlign: "center",

    marginTop: 16,
  },

  modalSubtitle: {
    fontSize: 13,
    color: MUTED,

    textAlign: "center",

    marginTop: 5,
  },

  // ===================================================
  // BIG STREAK
  // ===================================================

  bigStreakCard: {
    marginTop: 22,

    backgroundColor: GREEN,

    borderRadius: 24,

    padding: 20,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: GREEN,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 7,
    },

    elevation: 5,
  },

  bigStreakLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },

  bigStreakNumberRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 2,
  },

  bigStreakNumber: {
    fontSize: 48,
    fontWeight: "900",
    color: WHITE,
    letterSpacing: -2,
  },

  bigStreakDays: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    marginLeft: 5,
  },

  fireChip: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: WHITE,

    paddingHorizontal: 10,
    paddingVertical: 8,

    borderRadius: 20,
  },

  fireEmoji: {
    fontSize: 16,
    marginRight: 5,
  },

  fireChipText: {
    fontSize: 11,
    fontWeight: "800",
    color: DARK_GREEN,
  },

  // ===================================================
  // MODAL WEEK
  // ===================================================

  modalWeekTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT,

    marginTop: 22,
    marginBottom: 12,
  },

  modalWeekCard: {
    flexDirection: "row",

    justifyContent: "space-between",

    backgroundColor: "#FAFBFA",

    borderRadius: 20,

    borderWidth: 1,
    borderColor: BORDER,

    paddingHorizontal: 12,
    paddingVertical: 15,
  },

  modalDayItem: {
    alignItems: "center",
  },

  modalDayLetter: {
    fontSize: 11,
    fontWeight: "700",
    color: MUTED,

    marginBottom: 7,
  },

  modalDayCircle: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: WHITE,

    borderWidth: 1.5,
    borderColor: BORDER,

    alignItems: "center",
    justifyContent: "center",
  },

  modalDayCompleted: {
    backgroundColor: GREEN,
    borderColor: GREEN,
  },

  modalEmptyDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor: "#D5DBD6",
  },

  // ===================================================
  // MOTIVATION
  // ===================================================

  motivationBox: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: LIGHT_GREEN,

    borderRadius: 18,

    padding: 14,

    marginTop: 16,
  },

  motivationText: {
    flex: 1,

    fontSize: 12,
    lineHeight: 18,

    color: DARK_GREEN,

    marginLeft: 10,
  },
});
