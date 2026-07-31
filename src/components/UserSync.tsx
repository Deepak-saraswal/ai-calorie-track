import { useAuth, useUser } from "@clerk/expo";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useRef } from "react";

import { db } from "../lib/firebase";
import { cacheUser } from "../lib/localUser";

/** Creates or updates the Firestore profile directly. */
export function UserSync() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!db || !isLoaded || !isSignedIn || !user || syncedUserId.current === user.id) {
      return;
    }

    syncedUserId.current = user.id;

    const email = user.primaryEmailAddress?.emailAddress ?? null;

    const profile = {
  clerkId: user.id,

  email,

  firstName: user.firstName ?? null,

  lastName: user.lastName ?? null,

  fullName: user.fullName ?? null,

  imageUrl: user.imageUrl ?? null,

  

  createdAt: new Date().toISOString(),
};

    cacheUser({
      id: user.id,
      firstName: profile.firstName,
      email,
      imageUrl: profile.imageUrl,
      cachedAt: new Date().toISOString(),
    }).catch(() => undefined);

    (async () => {
      await setDoc(
        doc(db, "users", user.id),
        profile,
        { merge: true }
      );
    })().catch((error) => {
      console.warn("Unable to create Firestore user profile:", error);
    });
  }, [isLoaded, isSignedIn, user]);

  return null;
}