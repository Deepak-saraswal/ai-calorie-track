import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserProfile = {
  gender: "Male" | "Female" | "Other";

  goal:
    | "Gain Weight"
    | "Lose Weight"
    | "Maintain Weight";

  workout:
    | "2-3 Days"
    | "3-4 Days"
    | "5-7 Days";

  birthDate: string;

  height: {
    feet: number;
    inches: number;
  };

  weight: number;

  onboardingCompleted?: boolean;
};


const PROFILE_KEY = "fitness_profile";


export async function saveProfile(profile: UserProfile) {
  await AsyncStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(profile)
  );
}


export async function getProfile(): Promise<UserProfile | null> {

  const value = await AsyncStorage.getItem(PROFILE_KEY);

  if (!value) return null;

  return JSON.parse(value);

}


export async function clearProfile() {
  await AsyncStorage.removeItem(PROFILE_KEY);
}