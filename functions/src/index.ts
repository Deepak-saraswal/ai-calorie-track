import { verifyToken } from "@clerk/backend";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";

initializeApp();

const clerkSecretKey = defineSecret("CLERK_SECRET_KEY");
const db = getFirestore();

type UserProfileInput = {
  token?: unknown;
  clerkId?: unknown;
  email?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  fullName?: unknown;
  imageUrl?: unknown;
};

const asNullableString = (value: unknown) => (typeof value === "string" ? value.slice(0, 500) : null);

/** Creates a minimal user profile after a Clerk-authenticated sign-in or sign-up. */
export const ensureUserProfile = onCall(
  { region: "asia-south1", secrets: [clerkSecretKey] },
  async (request) => {
    const input = request.data as UserProfileInput;
    if (typeof input.token !== "string") {
      throw new HttpsError("unauthenticated", "A Clerk session token is required.");
    }

    let session;
    try {
      session = await verifyToken(input.token, { secretKey: clerkSecretKey.value() });
    } catch {
      throw new HttpsError("unauthenticated", "The Clerk session token is invalid or expired.");
    }

    const clerkId = session.sub;
    if (!clerkId || input.clerkId !== clerkId) {
      throw new HttpsError("permission-denied", "The profile must belong to the authenticated Clerk user.");
    }

    const userReference = db.collection("users").doc(clerkId);
    const created = await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(userReference);
      if (existing.exists) return false;

      transaction.set(userReference, {
        clerkId,
        email: asNullableString(input.email),
        firstName: asNullableString(input.firstName),
        lastName: asNullableString(input.lastName),
        fullName: asNullableString(input.fullName),
        imageUrl: asNullableString(input.imageUrl),
        createdAt: FieldValue.serverTimestamp(),
      });
      return true;
    });

    return { created };
  },
);
