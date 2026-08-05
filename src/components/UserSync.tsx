import { useAuth, useUser } from "@clerk/expo";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useRef } from "react";

import { db } from "../lib/firebase";
import { cacheUser } from "../lib/localUser";

export function UserSync() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();

  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (
      !db ||
      !isLoaded ||
      !isSignedIn ||
      !user ||
      syncedUserId.current === user.id
    ) {
      return;
    }

    syncedUserId.current = user.id;

    const syncUser = async () => {
      try {
        const email = user.primaryEmailAddress?.emailAddress ?? null;

        await cacheUser({
          id: user.id,
          firstName: user.firstName ?? null,
          email,
          imageUrl: user.imageUrl ?? null,
          cachedAt: new Date().toISOString(),
        });

        const userRef = doc(db, "users", user.id);

        const snap = await getDoc(userRef);

        // User already exists -> DO NOTHING
        if (snap.exists()) {
          console.log("User already exists. Skipping UserSync.");
          return;
        }

        console.log("Creating new Firestore profile...");

        await setDoc(userRef, {
          clerkId: user.id,
          email,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          fullName: user.fullName ?? null,
          imageUrl: user.imageUrl ?? null,

          onboardingCompleted: false,

          createdAt: serverTimestamp(),
        });

        console.log("New Firestore profile created.");
      } catch (error) {
        console.warn("UserSync failed:", error);
      }
    };
  //commit done 
    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return null;
}