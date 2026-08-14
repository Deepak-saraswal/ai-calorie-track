
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GREEN = "#219931";
const DARK_GREEN = "#185726";
const LIGHT_GREEN = "#E8EFE9";
const TEXT = "#252825";
const MUTED = "#7B817C";
const WHITE = "#FFFFFF";

interface HomeHeaderProps {
  username?: string;
  onNotificationPress?: () => void;
}

export default function HomeHeader({
  username = "Tubeguruji",
  onNotificationPress,
}: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      {/* User */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View>
          <Text style={styles.welcomeText}>Welcome,</Text>

          <Text style={styles.username}>
            {username}
          </Text>
        </View>
      </View>

      {/* Notification */}
      <TouchableOpacity
        style={styles.notificationButton}
        activeOpacity={0.7}
        onPress={onNotificationPress}
      >
        <Ionicons
          name="notifications-outline"
          size={27}
          color={TEXT}
        />

        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: WHITE,

    borderBottomWidth: 1,
    borderBottomColor: "#E7EAE7",
  },

  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,

    borderRadius: 26,

    backgroundColor: LIGHT_GREEN,

    borderWidth: 1,
    borderColor: GREEN,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 13,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: DARK_GREEN,
  },

  welcomeText: {
    fontSize: 15,
    color: MUTED,
    marginBottom: 2,
  },

  username: {
    fontSize: 21,
    fontWeight: "700",
    color: TEXT,
  },

  notificationButton: {
    width: 45,
    height: 45,

    borderRadius: 23,

    justifyContent: "center",
    alignItems: "center",
  },

  notificationDot: {
    position: "absolute",

    right: 9,
    top: 8,

    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: GREEN,
  },
});