import {
    addDoc,
    collection,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

// =====================================================
// Types
// =====================================================

export type LogType =
  | "food"
  | "exercise"
  | "water";

export interface DailyLog {
  id: string;

  type: LogType;

  title: string;

  time: string;

  calories: number;

  protein: number;

  fat: number;

  carbs: number;

  waterMl: number;

  duration?: number;

  intensity?: string;

  createdAt?: any;
}


// =====================================================
// Daily totals
// =====================================================

export interface DailyTotals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  waterMl: number;
}


// =====================================================
// Local date formatter
// IMPORTANT:
// Don't use toISOString() here because it can shift
// the date depending on timezone.
// =====================================================

export function formatDateKey(date: Date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


// =====================================================
// Get logs reference
// =====================================================

function getDailyLogsRef(
  userId: string,
  date: Date
) {
  if (!db) {
    return null;
  }

  const dateKey =
    formatDateKey(date);

  return collection(
    db,
    "users",
    userId,
    "dailyLogs",
    dateKey,
    "entries"
  );
}


// =====================================================
// Get selected day's logs
// =====================================================

export async function getDailyLogs(
  userId: string,
  date: Date
): Promise<DailyLog[]> {
  if (!db) {
    return [];
  }

  const logsRef =
    getDailyLogsRef(userId, date);

  if (!logsRef) {
    return [];
  }

  const logsQuery = query(
    logsRef,
    orderBy("createdAt", "desc")
  );

  const snapshot =
    await getDocs(logsQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,

      type:
        data.type ?? "food",

      title:
        data.title ?? "Activity",

      time:
        data.time ?? "",

      calories:
        Number(data.calories ?? 0),

      protein:
        Number(data.protein ?? 0),

      fat:
        Number(data.fat ?? 0),

      carbs:
        Number(data.carbs ?? 0),

      waterMl:
        Number(data.waterMl ?? 0),

      duration:
        data.duration != null
          ? Number(data.duration)
          : undefined,

      intensity:
        data.intensity ?? "",

      createdAt:
        data.createdAt,
    };
  });
}


// =====================================================
// Calculate daily totals
// =====================================================

export function calculateDailyTotals(
  logs: DailyLog[]
): DailyTotals {
  return logs.reduce(
    (totals, log) => {
      return {
        calories:
          totals.calories +
          Number(log.calories || 0),

        protein:
          totals.protein +
          Number(log.protein || 0),

        fat:
          totals.fat +
          Number(log.fat || 0),

        carbs:
          totals.carbs +
          Number(log.carbs || 0),

        waterMl:
          totals.waterMl +
          Number(log.waterMl || 0),
      };
    },
    {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      waterMl: 0,
    }
  );
}


// =====================================================
// Get selected day's logs + totals
// =====================================================

export async function getDailyData(
  userId: string,
  date: Date
) {
  const logs =
    await getDailyLogs(
      userId,
      date
    );

  const totals =
    calculateDailyTotals(logs);

  return {
    logs,
    totals,
  };
}


// =====================================================
// Add log
// =====================================================

export async function addDailyLog(
  userId: string,
  date: Date,
  log: Omit<
    DailyLog,
    "id" | "createdAt"
  >
) {
  if (!db) {
    throw new Error(
      "Firebase database is not initialized."
    );
  }

  const logsRef =
    getDailyLogsRef(userId, date);

  if (!logsRef) {
    throw new Error(
      "Firebase database is not initialized."
    );
  }

  await addDoc(logsRef, {
    type:
      log.type,

    title:
      log.title,

    time:
      log.time,

    calories:
      Number(log.calories ?? 0),

    protein:
      Number(log.protein ?? 0),

    fat:
      Number(log.fat ?? 0),

    carbs:
      Number(log.carbs ?? 0),

    waterMl:
      Number(log.waterMl ?? 0),

    duration:
      log.duration ?? null,

    intensity:
      log.intensity ?? null,

    createdAt:
      serverTimestamp(),
  });
}