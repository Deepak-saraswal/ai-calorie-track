import { getUserProfile } from "@/lib/profileService";
import { useUser } from "@clerk/expo";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Report() {
  const { user } = useUser();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  async function loadProfile() {
    try {
      const data = await getUserProfile(user!.id);

      console.log("PROFILE");
      console.log(JSON.stringify(data, null, 2));

      setProfile(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!profile || !profile.aiPlan) {
    return (
      <View style={styles.loader}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          No AI Plan Found
        </Text>
      </View>
    );
  }

  const plan = profile.aiPlan;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.heading}>🏋️ Fitness Report</Text>

      <Text style={styles.name}>{profile.fullName}</Text>

      <Text style={styles.goal}>{profile.goal}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Daily Calories</Text>
        <Text style={styles.big}>{plan.dailyCalories} kcal</Text>
      </View>

      <View style={styles.row}>
        <SmallCard title="💪 Protein" value={`${plan.protein} g`} />
        <SmallCard title="🍚 Carbs" value={`${plan.carbs} g`} />
      </View>

      <View style={styles.row}>
        <SmallCard title="🥑 Fats" value={`${plan.fats} g`} />
        <SmallCard title="💧 Water" value={`${plan.waterLitres} L`} />
      </View>

      <View style={styles.row}>
        <SmallCard title="📏 BMI" value={String(plan.bmi)} />
        <SmallCard title="🔥 BMR" value={String(plan.bmr)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Information</Text>

        <Info
          label="Height"
          value={`${profile.height.feet}' ${profile.height.inches}"`}
        />

        <Info
          label="Weight"
          value={`${profile.weight} kg`}
        />

        <Info
          label="Body Type"
          value={plan.bodyType}
        />

        <Info
          label="Ideal Weight"
          value={plan.idealWeight}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Summary</Text>

        <Text style={styles.paragraph}>
          {plan.workoutSummary}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition Tips</Text>

        {plan.nutritionTips.map((tip: string, index: number) => (
          <Text key={index} style={styles.listItem}>
            • {tip}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Habits</Text>

        {plan.dailyHabits.map((habit: string, index: number) => (
          <Text key={index} style={styles.listItem}>
            • {habit}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

function SmallCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <View style={styles.smallCard}>
      <Text style={styles.smallValue}>{value}</Text>
      <Text style={styles.smallTitle}>{title}</Text>
    </View>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    paddingTop: 50,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  heading: {
    fontSize: 30,
    fontWeight: "800",
    marginHorizontal: 20,
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 10,
  },

  goal: {
    fontSize: 18,
    color: "#6366F1",
    marginHorizontal: 20,
    marginBottom: 20,
  },

  card: {
    marginHorizontal: 20,
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 18,
  },

  big: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "800",
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 15,
  },

  smallCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  smallValue: {
    fontSize: 24,
    fontWeight: "700",
  },

  smallTitle: {
    marginTop: 8,
    color: "#666",
  },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 18,
    padding: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  infoLabel: {
    color: "#666",
    fontSize: 16,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  paragraph: {
    lineHeight: 26,
    fontSize: 16,
    color: "#444",
  },

  listItem: {
    fontSize: 16,
    color: "#444",
    lineHeight: 28,
    marginBottom: 8,
  },
});