import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,

  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CalorieCard from "@/components/CalorieCard";
import DateSelector from "@/components/DateSelector";
import FoodlogItem from "@/components/FoodlogItem";
import HomeHeader from "@/components/HomeHeader";
import WaterIntake from "@/components/WaterIntake";

import { getUserProfile } from "@/lib/profileService";

import {
  addDailyLog,
  DailyLog,
  formatDateKey,
  getDailyLogs,
} from "@/lib/dailyLogService";

// ==================================================
// Colors
// ==================================================

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";

// ==================================================
// Types
// ==================================================

interface AIPlan {
  dailyCalories?: number;
  protein?: number;
  fats?: number;
  carbs?: number;
  waterLitres?: number;
}

interface UserProfile {
  firstName?: string;
  fullName?: string;
  aiPlan?: AIPlan;
}

// ==================================================
// Home
// ==================================================

export default function Home() {
  const { user } = useUser();

  // ==================================================
  // Profile
  // ==================================================

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ==================================================
  // Selected Date
  // ==================================================

  const [selectedDate, setSelectedDate] =
    useState(formatDateKey(new Date()));

  // ==================================================
  // Daily Logs
  // ==================================================

  const [dailyLogs, setDailyLogs] =
    useState<DailyLog[]>([]);

  const [logsLoading, setLogsLoading] =
    useState(false);

  // ==================================================
  // Intake Modal
  // ==================================================

  const [showIntakeModal, setShowIntakeModal] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [inputCalories, setInputCalories] =
    useState("");

  const [inputProtein, setInputProtein] =
    useState("");

  const [inputCarbs, setInputCarbs] =
    useState("");

  const [inputFat, setInputFat] =
    useState("");

  const [inputWater, setInputWater] =
    useState("");

  // ==================================================
  // Load Profile
  // ==================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    loadProfile();
  }, [user?.id]);

  async function loadProfile() {
    if (!user?.id) {
      return;
    }

    try {
      setLoading(true);

      const data =
        await getUserProfile(user.id);

      console.log(
        "HOME PROFILE:",
        JSON.stringify(data, null, 2)
      );

      setProfile(data);
    } catch (error) {
      console.log(
        "HOME PROFILE ERROR:",
        error
      );

      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // Load Daily Logs
  // ==================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    loadDailyLogs();
  }, [user?.id, selectedDate]);

  async function loadDailyLogs() {
    if (!user?.id) {
      return;
    }

    try {
      setLogsLoading(true);

      const [year, month, day] =
        selectedDate
          .split("-")
          .map(Number);

      const selectedDateObject =
        new Date(
          year,
          month - 1,
          day
        );

      const logs =
        await getDailyLogs(
          user.id,
          selectedDateObject
        );

      console.log(
        "SELECTED DATE:",
        selectedDate
      );

      console.log(
        "DAILY LOGS:",
        JSON.stringify(logs, null, 2)
      );

      setDailyLogs(logs);
    } catch (error) {
      console.log(
        "DAILY LOG ERROR:",
        error
      );

      setDailyLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }

  // ==================================================
  // Loading
  // ==================================================

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <ActivityIndicator
          size="small"
          color={GREEN}
        />

        <Text style={styles.loadingText}>
          Loading your plan...
        </Text>
      </SafeAreaView>
    );
  }

  // ==================================================
  // No Profile
  // ==================================================

  if (!profile) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <Text style={styles.emptyTitle}>
          Profile not found
        </Text>

        <Text style={styles.emptyText}>
          We couldn't load your profile data.
        </Text>
      </SafeAreaView>
    );
  }

  // ==================================================
  // AI Plan
  // ==================================================

  const plan = profile.aiPlan;

  if (!plan) {
    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <Text style={styles.emptyTitle}>
          No AI Plan Found
        </Text>

        <Text style={styles.emptyText}>
          Complete your fitness plan first.
        </Text>
      </SafeAreaView>
    );
  }

  // ==================================================
  // Goals
  // ==================================================

  const calorieGoal =
    Number(plan.dailyCalories ?? 0);

  const proteinGoal =
    Number(plan.protein ?? 0);

  const fatGoal =
    Number(plan.fats ?? 0);

  const carbsGoal =
    Number(plan.carbs ?? 0);

  const waterGoalLitres =
    Number(plan.waterLitres ?? 0);

  const waterGoalMl =
    waterGoalLitres * 1000;

  // ==================================================
  // Consumed
  // ==================================================

 const calories = dailyLogs.reduce(
  (total, log) => {
    const value = Number(log.calories ?? 0);

    if (log.type === "exercise") {
      return total - Math.abs(value);
    }

    return total + value;
  },
  0
);

  const protein = dailyLogs.reduce(
    (total, log) =>
      total +
      Number(log.protein ?? 0),
    0
  );

  const fat = dailyLogs.reduce(
    (total, log) =>
      total +
      Number(log.fat ?? 0),
    0
  );

  const carbs = dailyLogs.reduce(
    (total, log) =>
      total +
      Number(log.carbs ?? 0),
    0
  );

  const waterMl = dailyLogs.reduce(
    (total, log) =>
      total +
      Number(log.waterMl ?? 0),
    0
  );

  // ==================================================
  // Activities
  // ==================================================

  const recentActivities =
    dailyLogs;

  // ==================================================
  // Open Modal
  // ==================================================

  function openIntakeModal() {
    setInputCalories("");
    setInputProtein("");
    setInputCarbs("");
    setInputFat("");
    setInputWater("");

    setShowIntakeModal(true);
  }

  // ==================================================
  // Close Modal
  // ==================================================

  function closeIntakeModal() {
    if (saving) {
      return;
    }

    setShowIntakeModal(false);
  }

  // ==================================================
  // Save Intake
  // ==================================================

  async function handleSaveIntake() {
    if (!user?.id) {
      return;
    }

    const caloriesValue =
      Number(inputCalories || 0);

    const proteinValue =
      Number(inputProtein || 0);

    const carbsValue =
      Number(inputCarbs || 0);

    const fatValue =
      Number(inputFat || 0);

    const waterValue =
      Number(inputWater || 0);

    if (
      caloriesValue === 0 &&
      proteinValue === 0 &&
      carbsValue === 0 &&
      fatValue === 0 &&
      waterValue === 0
    ) {
      return;
    }

    try {
      setSaving(true);

      const [year, month, day] =
        selectedDate
          .split("-")
          .map(Number);

      const selectedDateObject =
        new Date(
          year,
          month - 1,
          day
        );

      await addDailyLog(
        user.id,
        selectedDateObject,
        {
          type: "food",

          title: "Daily Intake",

          time: new Date().toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
            }
          ),

          calories: caloriesValue,

          protein: proteinValue,

          fat: fatValue,

          carbs: carbsValue,

          waterMl: waterValue,
        }
      );

      console.log(
        "INTAKE SAVED:",
        {
          date: selectedDate,
          calories: caloriesValue,
          protein: proteinValue,
          carbs: carbsValue,
          fat: fatValue,
          waterMl: waterValue,
        }
      );

      setShowIntakeModal(false);

      setInputCalories("");
      setInputProtein("");
      setInputCarbs("");
      setInputFat("");
      setInputWater("");

      await loadDailyLogs();
    } catch (error) {
      console.log(
        "SAVE INTAKE ERROR:",
        error
      );
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // Food Log
  // ==================================================

  const renderFoodLog = ({
    item,
  }: {
    item: DailyLog;
  }) => {
    return (
      <FoodlogItem
  title={item.title}
  time={item.time}
  calories={
    item.type === "exercise"
      ? Math.abs(item.calories)
      : item.calories
  }
  type={
    item.type === "water"
      ? "food"
      : item.type
  }
  duration={
    item.duration
      ? `${item.duration} min`
      : undefined
  }
  intensity={
    item.intensity || undefined
  }
  onPress={() => {
    console.log(
      "Selected:",
      item.title
    );
  }}
/>
    );
  };

  // ==================================================
  // Water
  // 1 glass = 250ml
  // ==================================================

  const consumedGlasses =
    waterMl > 0
      ? Math.ceil(waterMl / 250)
      : 0;

  const goalGlasses =
    waterGoalMl > 0
      ? Math.ceil(
          waterGoalMl / 250
        )
      : 0;

  // ==================================================
  // Render
  // ==================================================

  return (
    <SafeAreaView
      style={styles.safeArea}
    >
      <View
        style={styles.container}
      >
        {/* Header */}

        <HomeHeader
          username={
            profile.firstName ||
            profile.fullName ||
            "User"
          }
          onNotificationPress={() => {
            console.log(
              "Notifications"
            );
          }}
        />

        {/* Date */}

        <DateSelector
          selectedDate={selectedDate}
          onDateChange={(date) => {
            setSelectedDate(date);
          }}
        />

        {/* Main */}

        <FlatList
          data={recentActivities}
          keyExtractor={(item) =>
            item.id
          }
          renderItem={
            renderFoodLog
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.mainList
          }
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <>
              {/* Calories */}

              <CalorieCard
                calories={calories}
                calorieGoal={
                  calorieGoal
                }
                protein={protein}
                proteinGoal={
                  proteinGoal
                }
                fat={fat}
                fatGoal={
                  fatGoal
                }
                carbs={carbs}
                carbsGoal={
                  carbsGoal
                }
                onEdit={
                  openIntakeModal
                }
              />

              {/* Water */}

              <WaterIntake
                glasses={
                  consumedGlasses
                }
                totalGlasses={
                  goalGlasses
                }
                onChange={(value) => {
                  console.log(
                    "Water glass:",
                    value
                  );
                }}
                onEdit={
                  openIntakeModal
                }
              />

              {/* Recent */}

              <View
                style={
                  styles.recentHeader
                }
              >
                <Text
                  style={
                    styles.recentTitle
                  }
                >
                  Recent Activity
                </Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    console.log(
                      "View all"
                    );
                  }}
                >
                  <Text
                    style={
                      styles.viewAll
                    }
                  >
                    View All
                  </Text>
                </TouchableOpacity>
              </View>

              {logsLoading && (
                <View
                  style={
                    styles.logsLoading
                  }
                >
                  <ActivityIndicator
                    size="small"
                    color={GREEN}
                  />

                  <Text
                    style={
                      styles.logsLoadingText
                    }
                  >
                    Loading activity...
                  </Text>
                </View>
              )}
            </>
          }
          ListEmptyComponent={
            logsLoading ? null : (
              <View
                style={
                  styles.emptyContainer
                }
              >
                <Ionicons
                  name="restaurant-outline"
                  size={40}
                  color={MUTED}
                />

                <Text
                  style={
                    styles.emptyTitle
                  }
                >
                  No activity yet
                </Text>

                <Text
                  style={
                    styles.emptyText
                  }
                >
                  Add your food, water or
                  exercise to start tracking.
                </Text>
              </View>
            )
          }
        />

        {/* Floating Button */}

       

        {/* ==================================================
            MODAL
        ================================================== */}

        <Modal
          visible={
            showIntakeModal
          }
          transparent
          animationType="slide"
          onRequestClose={
            closeIntakeModal
          }
        >
          <KeyboardAvoidingView
            style={
              styles.modalOverlay
            }
            behavior={
              Platform.OS === "ios"
                ? "padding"
                : undefined
            }
          >
            <View
              style={
                styles.modalContainer
              }
            >
              {/* Modal Header */}

              <View
                style={
                  styles.modalHeader
                }
              >
                <View
                  style={
                    styles.modalHeaderText
                  }
                >
                  <Text
                    style={
                      styles.modalTitle
                    }
                  >
                    Add Daily Intake
                  </Text>

                  <Text
                    style={
                      styles.modalSubtitle
                    }
                  >
                    Track what you consumed
                    today
                  </Text>
                </View>

                <TouchableOpacity
                  style={
                    styles.closeButton
                  }
                  activeOpacity={0.7}
                  onPress={
                    closeIntakeModal
                  }
                >
                  <Ionicons
                    name="close"
                    size={21}
                    color={TEXT}
                  />
                </TouchableOpacity>
              </View>

              {/* Scrollable Input Area */}

              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={
                  styles.modalScrollContent
                }
              >
                {/* ==============================
                    Calories + Protein
                ============================== */}

                <View
                  style={
                    styles.inputRow
                  }
                >
                  {/* Calories */}

                  <View
                    style={
                      styles.halfInput
                    }
                  >
                    <Text
                      style={
                        styles.inputLabel
                      }
                    >
                      Calories
                    </Text>

                    <View
                      style={
                        styles.inputWrapper
                      }
                    >
                      <TextInput
                        value={
                          inputCalories
                        }
                        onChangeText={
                          setInputCalories
                        }
                        placeholder="0"
                        placeholderTextColor="#A5AAA6"
                        keyboardType="numeric"
                        style={
                          styles.input
                        }
                      />

                      <Text
                        style={
                          styles.inputUnit
                        }
                      >
                        kcal
                      </Text>
                    </View>
                  </View>

                  {/* Protein */}

                  <View
                    style={
                      styles.halfInput
                    }
                  >
                    <Text
                      style={
                        styles.inputLabel
                      }
                    >
                      Protein
                    </Text>

                    <View
                      style={
                        styles.inputWrapper
                      }
                    >
                      <TextInput
                        value={
                          inputProtein
                        }
                        onChangeText={
                          setInputProtein
                        }
                        placeholder="0"
                        placeholderTextColor="#A5AAA6"
                        keyboardType="numeric"
                        style={
                          styles.input
                        }
                      />

                      <Text
                        style={
                          styles.inputUnit
                        }
                      >
                        g
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ==============================
                    Carbs + Fat
                ============================== */}

                <View
                  style={
                    styles.inputRow
                  }
                >
                  {/* Carbs */}

                  <View
                    style={
                      styles.halfInput
                    }
                  >
                    <Text
                      style={
                        styles.inputLabel
                      }
                    >
                      Carbs
                    </Text>

                    <View
                      style={
                        styles.inputWrapper
                      }
                    >
                      <TextInput
                        value={
                          inputCarbs
                        }
                        onChangeText={
                          setInputCarbs
                        }
                        placeholder="0"
                        placeholderTextColor="#A5AAA6"
                        keyboardType="numeric"
                        style={
                          styles.input
                        }
                      />

                      <Text
                        style={
                          styles.inputUnit
                        }
                      >
                        g
                      </Text>
                    </View>
                  </View>

                  {/* Fat */}

                  <View
                    style={
                      styles.halfInput
                    }
                  >
                    <Text
                      style={
                        styles.inputLabel
                      }
                    >
                      Fat
                    </Text>

                    <View
                      style={
                        styles.inputWrapper
                      }
                    >
                      <TextInput
                        value={
                          inputFat
                        }
                        onChangeText={
                          setInputFat
                        }
                        placeholder="0"
                        placeholderTextColor="#A5AAA6"
                        keyboardType="numeric"
                        style={
                          styles.input
                        }
                      />

                      <Text
                        style={
                          styles.inputUnit
                        }
                      >
                        g
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ==============================
                    Water
                ============================== */}

                <View
                  style={
                    styles.waterInputSection
                  }
                >
                  <View
                    style={
                      styles.waterLabelRow
                    }
                  >
                    <View
                      style={
                        styles.waterIcon
                      }
                    >
                      <Ionicons
                        name="water-outline"
                        size={17}
                        color={GREEN}
                      />
                    </View>

                    <Text
                      style={
                        styles.inputLabel
                      }
                    >
                      Water
                    </Text>
                  </View>

                  <View
                    style={
                      styles.inputWrapper
                    }
                  >
                    <TextInput
                      value={
                        inputWater
                      }
                      onChangeText={
                        setInputWater
                      }
                      placeholder="0"
                      placeholderTextColor="#A5AAA6"
                      keyboardType="numeric"
                      style={
                        styles.input
                      }
                    />

                    <Text
                      style={
                        styles.inputUnit
                      }
                    >
                      ml
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.waterHint
                    }
                  >
                    Enter the amount of water
                    you consumed.
                  </Text>
                </View>
              </ScrollView>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <View
                style={
                  styles.modalButtons
                }
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={
                    styles.cancelButton
                  }
                  onPress={
                    closeIntakeModal
                  }
                  disabled={
                    saving
                  }
                >
                  <Text
                    style={
                      styles.cancelText
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={
                    styles.saveButton
                  }
                  onPress={
                    handleSaveIntake
                  }
                  disabled={
                    saving
                  }
                >
                  {saving ? (
                    <ActivityIndicator
                      size="small"
                      color={WHITE}
                    />
                  ) : (
                    <Text
                      style={
                        styles.saveText
                      }
                    >
                      Save Intake
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

// ==================================================
// Styles
// ==================================================

const styles = StyleSheet.create({
  // ==================================================
  // Loading
  // ==================================================

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F7F8F7",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: MUTED,
  },

  // ==================================================
  // Main
  // ==================================================

  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F7",
  },

  container: {
    marginTop: 40,
    flex: 1,
    backgroundColor: "#F7F8F7",
  },

  mainList: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 120,
  },

  // ==================================================
  // Recent Activity
  // ==================================================

  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 10,
  },

  recentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
  },

  viewAll: {
    fontSize: 13,
    fontWeight: "700",
    color: GREEN,
  },

  // ==================================================
  // Logs
  // ==================================================

  logsLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },

  logsLoadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: MUTED,
  },

  // ==================================================
  // Empty
  // ==================================================

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: TEXT,
    marginTop: 10,
  },

  emptyText: {
    fontSize: 13,
    color: MUTED,
    textAlign: "center",
    marginTop: 5,
    maxWidth: 280,
    lineHeight: 19,
  },

  // ==================================================
  // Floating Button
  // ==================================================

  floatingButton: {
    position: "absolute",
    right: 22,
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: GREEN,
    justifyContent: "center",
    alignItems: "center",

    elevation: 7,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  // ==================================================
  // Modal Overlay
  // ==================================================

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  // ==================================================
  // Modal Container
  // ==================================================

  modalContainer: {
    backgroundColor: WHITE,

    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,

    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,

    maxHeight: "88%",
  },

  // ==================================================
  // Modal Header
  // ==================================================

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 14,
  },

  modalHeaderText: {
    flex: 1,
    paddingRight: 12,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: TEXT,
  },

  modalSubtitle: {
    fontSize: 12,
    color: MUTED,
    marginTop: 4,
  },

  closeButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",
  },

  // ==================================================
  // Scroll Content
  // ==================================================

  modalScrollContent: {
    paddingBottom: 8,
  },

  // ==================================================
  // Input Rows
  // ==================================================

  inputRow: {
    flexDirection: "row",
    gap: 10,

    marginBottom: 12,
  },

  halfInput: {
    flex: 1,
    minWidth: 0,
  },

  // ==================================================
  // Water
  // ==================================================

  waterInputSection: {
    marginTop: 2,
    marginBottom: 4,
  },

  waterLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  waterIcon: {
    width: 28,
    height: 28,

    borderRadius: 14,

    backgroundColor: LIGHT_GREEN,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 7,
  },

  waterHint: {
    fontSize: 11,
    color: MUTED,
    marginTop: 6,
  },

  // ==================================================
  // Labels
  // ==================================================

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT,
  },

  // ==================================================
  // Input
  // ==================================================

  inputWrapper: {
    height: 48,

    borderWidth: 1,
    borderColor: "#DDE3DD",

    borderRadius: 14,

    backgroundColor: "#F7F9F7",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
  },

  input: {
    flex: 1,

    height: 48,

    fontSize: 16,
    fontWeight: "600",

    color: TEXT,

    paddingVertical: 0,
  },

  inputUnit: {
    fontSize: 12,
    fontWeight: "700",
    color: MUTED,
    marginLeft: 6,
  },

  // ==================================================
  // Modal Buttons
  // ==================================================

  modalButtons: {
    flexDirection: "row",

    gap: 10,

    marginTop: 14,

    paddingTop: 4,

    backgroundColor: WHITE,
  },

  cancelButton: {
    flex: 1,

    height: 50,

    borderRadius: 15,

    borderWidth: 1,
    borderColor: "#D9DFD9",

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F8F9F8",
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT,
  },

  saveButton: {
    flex: 1,

    height: 50,

    borderRadius: 15,

    backgroundColor: GREEN,

    alignItems: "center",
    justifyContent: "center",
  },

  saveText: {
    fontSize: 14,
    fontWeight: "800",
    color: WHITE,
  },
});