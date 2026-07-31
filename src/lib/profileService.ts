import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "./firebase";

export async function getUserProfile(userId: string) {
  if (!db) return null;

  const snapshot = await getDoc(doc(db, "users", userId));

  if (!snapshot.exists()) return null;

  return snapshot.data();
}

export async function saveUserProfile(
  userId: string,
  data: any
) {
  if (!db) return;

  await setDoc(
    doc(db, "users", userId),
    {
      ...data,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString(),
    },
    {
      merge: true,
    }
  );
}