import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";

interface EditIntakeModalProps {
  visible: boolean;

  onClose: () => void;

  onSave: (data: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    waterMl: number;
  }) => void;

  initialValues?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    waterMl?: number;
  };
}

export default function EditIntakeModal({
  visible,
  onClose,
  onSave,
  initialValues,
}: EditIntakeModalProps) {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [waterMl, setWaterMl] = useState("");

  // =====================================================
  // Load current values whenever modal opens
  // =====================================================

  useEffect(() => {
    if (!visible) return;

    setCalories(
      initialValues?.calories !== undefined
        ? String(initialValues.calories)
        : ""
    );

    setProtein(
      initialValues?.protein !== undefined
        ? String(initialValues.protein)
        : ""
    );

    setCarbs(
      initialValues?.carbs !== undefined
        ? String(initialValues.carbs)
        : ""
    );

    setFat(
      initialValues?.fat !== undefined
        ? String(initialValues.fat)
        : ""
    );

    setWaterMl(
      initialValues?.waterMl !== undefined
        ? String(initialValues.waterMl)
        : ""
    );
  }, [visible, initialValues]);

  // =====================================================
  // Save
  // =====================================================

  const handleSave = () => {
    onSave({
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      waterMl: Number(waterMl) || 0,
    });
  };

  // =====================================================
  // Numeric input
  // =====================================================

  const cleanNumber = (value: string) => {
    return value.replace(/[^0-9.]/g, "");
  };

  // =====================================================
  // Small Input
  // =====================================================

  const renderSmallInput = (
    label: string,
    value: string,
    setValue: (value: string) => void,
    unit: string,
    icon: keyof typeof Ionicons.glyphMap
  ) => {
    return (
      <View style={styles.inputGroupHalf}>
        <Text style={styles.inputLabel}>{label}</Text>

        <View style={styles.inputBox}>
          <View style={styles.iconCircle}>
            <Ionicons
              name={icon}
              size={17}
              color={GREEN}
            />
          </View>

          <TextInput
            value={value}
            onChangeText={(text) =>
              setValue(cleanNumber(text))
            }
            placeholder="0"
            placeholderTextColor="#A8AEA9"
            keyboardType="decimal-pad"
            style={styles.input}
          />

          <Text style={styles.unit}>{unit}</Text>
        </View>
      </View>
    );
  };

  // =====================================================
  // Full Width Water Input
  // =====================================================

  const renderWaterInput = () => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          Water Intake
        </Text>

        <View style={styles.waterInputBox}>
          <View style={styles.waterIcon}>
            <Ionicons
              name="water"
              size={20}
              color={GREEN}
            />
          </View>

          <View style={styles.waterInputContent}>
            <TextInput
              value={waterMl}
              onChangeText={(text) =>
                setWaterMl(cleanNumber(text))
              }
              placeholder="0"
              placeholderTextColor="#A8AEA9"
              keyboardType="decimal-pad"
              style={styles.waterInput}
            />

            <Text style={styles.unit}>ml</Text>
          </View>

          <Text style={styles.waterHint}>
            Daily consumed
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View style={styles.modal}>
          {/* =================================================
              Handle
          ================================================= */}

          <View style={styles.handle} />

          {/* =================================================
              Header
          ================================================= */}

          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Ionicons
                  name="create-outline"
                  size={21}
                  color={GREEN}
                />
              </View>

              <View>
                <Text style={styles.title}>
                  Daily Intake
                </Text>

                <Text style={styles.subtitle}>
                  Update today's nutrition
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close"
                size={21}
                color={TEXT}
              />
            </TouchableOpacity>
          </View>

          {/* =================================================
              Inputs
          ================================================= */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.scrollContent
            }
          >
            {/* Protein + Fat */}

            <View style={styles.row}>
              {renderSmallInput(
                "Protein",
                protein,
                setProtein,
                "g",
                "fitness-outline"
              )}

              {renderSmallInput(
                "Fat",
                fat,
                setFat,
                "g",
                "nutrition-outline"
              )}
            </View>

            {/* Carbs + Calories */}

            <View style={styles.row}>
              {renderSmallInput(
                "Carbs",
                carbs,
                setCarbs,
                "g",
                "restaurant-outline"
              )}

              {renderSmallInput(
                "Calories",
                calories,
                setCalories,
                "kcal",
                "flame-outline"
              )}
            </View>

            {/* Water */}

            {renderWaterInput()}

            {/* Information */}

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={GREEN}
              />

              <Text style={styles.infoText}>
                These values represent what you have
                consumed today. Your progress will update
                automatically after saving.
              </Text>
            </View>
          </ScrollView>

          {/* =================================================
              Buttons
          ================================================= */}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.85}
              onPress={handleSave}
            >
              <Ionicons
                name="checkmark"
                size={19}
                color={WHITE}
              />

              <Text style={styles.saveText}>
                Save Intake
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(20, 30, 22, 0.38)",
    justifyContent: "flex-end",
  },

  modal: {
    backgroundColor: WHITE,

    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 24,

    maxHeight: "88%",
  },

  handle: {
    width: 42,
    height: 4,

    borderRadius: 4,

    backgroundColor: "#D7DDD8",

    alignSelf: "center",

    marginBottom: 18,
  },

  // =====================================================
  // Header
  // =====================================================

  header: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 22,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: LIGHT_GREEN,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 11,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",

    color: TEXT,
  },

  subtitle: {
    fontSize: 12,

    color: MUTED,

    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,

    borderRadius: 19,

    backgroundColor: "#F3F5F3",

    justifyContent: "center",
    alignItems: "center",
  },

  // =====================================================
  // Scroll
  // =====================================================

  scrollContent: {
    paddingBottom: 8,
  },

  // =====================================================
  // Rows
  // =====================================================

  row: {
    flexDirection: "row",

    gap: 11,

    marginBottom: 15,
  },

  // =====================================================
  // Inputs
  // =====================================================

  inputGroupHalf: {
    flex: 1,
  },

  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },

  inputLabel: {
    fontSize: 12,

    fontWeight: "700",

    color: TEXT,

    marginBottom: 7,

    marginLeft: 2,
  },

  inputBox: {
    height: 58,

    borderRadius: 16,

    backgroundColor: "#F6F8F6",

    borderWidth: 1,

    borderColor: "#E4E9E4",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 10,
  },

  iconCircle: {
    width: 34,
    height: 34,

    borderRadius: 11,

    backgroundColor: LIGHT_GREEN,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 7,
  },

  input: {
    flex: 1,

    height: "100%",

    fontSize: 17,

    fontWeight: "700",

    color: TEXT,

    paddingVertical: 0,
  },

  unit: {
    fontSize: 11,

    fontWeight: "700",

    color: MUTED,

    marginLeft: 4,
  },

  // =====================================================
  // Water
  // =====================================================

  waterInputBox: {
    height: 64,

    borderRadius: 17,

    backgroundColor: LIGHT_GREEN,

    borderWidth: 1,

    borderColor: "#D9E6DB",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 11,
  },

  waterIcon: {
    width: 40,
    height: 40,

    borderRadius: 13,

    backgroundColor: WHITE,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 9,
  },

  waterInputContent: {
    flexDirection: "row",

    alignItems: "center",

    flex: 1,
  },

  waterInput: {
    minWidth: 55,

    fontSize: 18,

    fontWeight: "800",

    color: TEXT,

    paddingVertical: 0,
  },

  waterHint: {
    fontSize: 11,

    color: MUTED,

    fontWeight: "600",
  },

  // =====================================================
  // Information
  // =====================================================

  infoBox: {
    flexDirection: "row",

    alignItems: "flex-start",

    backgroundColor: "#F7F9F7",

    borderRadius: 14,

    padding: 12,

    marginTop: 2,
  },

  infoText: {
    flex: 1,

    fontSize: 11,

    lineHeight: 17,

    color: MUTED,

    marginLeft: 8,
  },

  // =====================================================
  // Buttons
  // =====================================================

  buttonRow: {
    flexDirection: "row",

    gap: 10,

    marginTop: 16,
  },

  cancelButton: {
    flex: 0.8,

    height: 52,

    borderRadius: 16,

    backgroundColor: "#F1F3F1",

    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontSize: 14,

    fontWeight: "700",

    color: MUTED,
  },

  saveButton: {
    flex: 1.5,

    height: 52,

    borderRadius: 16,

    backgroundColor: GREEN,

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    gap: 7,
  },

  saveText: {
    fontSize: 14,

    fontWeight: "800",

    color: WHITE,
  },
});