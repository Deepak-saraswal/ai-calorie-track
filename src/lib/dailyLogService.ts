import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
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
  // Kept for backward compatibility
  calories: number;

  // Food calories
  consumedCalories: number;

  // Exercise/cardio calories
  burnedCalories: number;

  protein: number;

  fat: number;

  carbs: number;

  waterMl: number;
}


// =====================================================
// Weekly calories
//
// Sunday -> Saturday
//
// FOOD ONLY
// calories consumed per day
// =====================================================

export interface WeeklyCaloriesDay {
  date: Date;
  dateKey: string;
  label: string;
  calories: number;
}

// =====================================================
// Get current week's calories
//
// Returns food calories consumed
// for Sunday -> Saturday
// =====================================================

export async function getCurrentWeekCalories(
  userId: string
): Promise<WeeklyCaloriesDay[]> {
  if (!userId) {
    return [];
  }

  const today = new Date();

  const dayOfWeek = today.getDay();

  // Find Sunday of current week
  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayOfWeek
  );

  const labels = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
  ];

  const days: WeeklyCaloriesDay[] = [];

  // ===================================================
  // Fetch each day
  // ===================================================

  for (let i = 0; i < 7; i++) {
    const date = new Date(
      sunday.getFullYear(),
      sunday.getMonth(),
      sunday.getDate() + i
    );

    let calories = 0;

    try {
      const logs = await getDailyLogs(
        userId,
        date
      );

      // -----------------------------------------------
      // Only food calories count as consumed calories
      // -----------------------------------------------

      logs.forEach((log) => {
        if (log.type === "food") {
          calories += Number(
            log.calories || 0
          );
        }
      });
    } catch (error) {
      console.log(
        `WEEKLY CALORIES ERROR ${formatDateKey(
          date
        )}:`,
        error
      );
    }

    days.push({
      date,

      dateKey:
        formatDateKey(date),

      label:
        labels[i],

      calories:
        Math.round(calories),
    });
  }

  return days;
}

// =====================================================
// Weekly food data
// =====================================================

export interface WeeklyFoodData {
  date: string;

  foods: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }[];
}
// =====================================================
// Get current week's food logs
//
// Sunday -> Saturday
// =====================================================

export async function getCurrentWeekFoodData(
  userId: string
): Promise<WeeklyFoodData[]> {
  if (!userId) {
    return [];
  }

  const today = new Date();

  const dayOfWeek = today.getDay();

  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayOfWeek
  );

  const week: WeeklyFoodData[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(
      sunday.getFullYear(),
      sunday.getMonth(),
      sunday.getDate() + i
    );

    try {
      const logs = await getDailyLogs(
        userId,
        date
      );

      const foods = logs
        .filter(
          (log) =>
            log.type === "food"
        )
        .map((log) => ({
          name: log.title,

          calories: Math.round(
            Number(log.calories || 0)
          ),

          protein: Math.round(
            Number(log.protein || 0)
          ),

          carbs: Math.round(
            Number(log.carbs || 0)
          ),

          fat: Math.round(
            Number(log.fat || 0)
          ),
        }));

      week.push({
        date: formatDateKey(date),
        foods,
      });
    } catch (error) {
      console.log(
        `WEEKLY FOOD ERROR ${formatDateKey(date)}:`,
        error
      );

      week.push({
        date: formatDateKey(date),
        foods: [],
      });
    }
  }

  return week;
}


// =====================================================
// Cached AI Weekly Food Summary
// =====================================================

export interface CachedWeeklyFoodSummary {
  summary: string;
  highlight: string;
  insight: string;
  recommendation: string;
  eatingPattern: string;

  // Current week's Sunday
  weekStart: string;

  // Firebase timestamp
  generatedAt: Timestamp | null;
}
// =====================================================
// Weekly activity
// =====================================================

export interface WeeklyActivityDay {
  date: Date;
  dateKey: string;
  active: boolean;
}
// =====================================================
// AI FOOD SUMMARY CACHE
// =====================================================

const AI_SUMMARY_COLLECTION =
  "aiSummaries";

const WEEKLY_FOOD_SUMMARY_DOCUMENT =
  "weeklyFoodSummary";

const AI_SUMMARY_CACHE_DURATION =
  6 * 60 * 60 * 1000; // 6 hours


// =====================================================
// Get current week's Sunday
// =====================================================

export function getCurrentWeekStartKey(): string {
  const today = new Date();

  const dayOfWeek =
    today.getDay();

  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayOfWeek
  );

  return formatDateKey(sunday);
}


// =====================================================
// Get cached AI food summary
// =====================================================

export async function getCachedWeeklyFoodSummary(
  userId: string
): Promise<{
  summary: CachedWeeklyFoodSummary | null;
  shouldGenerate: boolean;
}> {
  if (!db || !userId) {
    return {
      summary: null,
      shouldGenerate: true,
    };
  }

  try {
    const summaryRef = doc(
      db,
      "users",
      userId,
      AI_SUMMARY_COLLECTION,
      WEEKLY_FOOD_SUMMARY_DOCUMENT
    );

    const snapshot =
      await getDoc(summaryRef);

    // =============================================
    // No cached result
    // =============================================

    if (!snapshot.exists()) {
      console.log(
        "🤖 No cached AI food summary found."
      );

      return {
        summary: null,
        shouldGenerate: true,
      };
    }

    const data =
      snapshot.data();

    const generatedAt =
      data.generatedAt instanceof Timestamp
        ? data.generatedAt
        : null;

    const weekStart =
      data.weekStart ?? "";

    const currentWeekStart =
      getCurrentWeekStartKey();

    // =============================================
    // Make sure cached result belongs to
    // the current week
    // =============================================

    if (
      weekStart !== currentWeekStart
    ) {
      console.log(
        "🤖 Cached AI summary belongs to an old week."
      );

      return {
        summary: null,
        shouldGenerate: true,
      };
    }

    // =============================================
    // Missing timestamp
    // =============================================

    if (!generatedAt) {
      console.log(
        "🤖 Cached AI summary has no generation time."
      );

      return {
        summary: null,
        shouldGenerate: true,
      };
    }

    // =============================================
    // Check 6 hour expiration
    // =============================================

    const generatedTime =
      generatedAt.toMillis();

    const currentTime =
      Date.now();

    const age =
      currentTime -
      generatedTime;

    const isExpired =
      age >= AI_SUMMARY_CACHE_DURATION;

    console.log(
      "🤖 AI summary age:",
      Math.round(
        age / (60 * 60 * 1000)
      ),
      "hours"
    );

    // =============================================
    // Cached result still valid
    // =============================================

    if (!isExpired) {
      console.log(
        "✅ Using cached AI food summary."
      );

      return {
        summary: {
          summary:
            data.summary ?? "",

          highlight:
            data.highlight ?? "",

          insight:
            data.insight ?? "",

          recommendation:
            data.recommendation ?? "",

          eatingPattern:
            data.eatingPattern ?? "",

          weekStart,

          generatedAt,
        },

        shouldGenerate: false,
      };
    }

    // =============================================
    // Cache expired
    // =============================================

    console.log(
      "⏰ AI food summary is older than 6 hours."
    );

    return {
      summary: null,
      shouldGenerate: true,
    };

  } catch (error) {
    console.log(
      "❌ GET CACHED AI SUMMARY ERROR:",
      error
    );

    // If cache lookup fails, allow generation
    return {
      summary: null,
      shouldGenerate: true,
    };
  }
}


// =====================================================
// Save AI weekly food summary
// =====================================================

export async function saveWeeklyFoodSummary(
  userId: string,
  summary: {
    summary: string;
    highlight: string;
    insight: string;
    recommendation: string;
    eatingPattern: string;
  }
) {
  if (!db || !userId) {
    throw new Error(
      "Firebase database is not initialized."
    );
  }

  const summaryRef = doc(
    db,
    "users",
    userId,
    AI_SUMMARY_COLLECTION,
    WEEKLY_FOOD_SUMMARY_DOCUMENT
  );

  await setDoc(
    summaryRef,
    {
      summary:
        summary.summary,

      highlight:
        summary.highlight,

      insight:
        summary.insight,

      recommendation:
        summary.recommendation,

      eatingPattern:
        summary.eatingPattern,

      weekStart:
        getCurrentWeekStartKey(),

      generatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    }
  );

  console.log(
    "✅ AI weekly food summary saved to Firebase."
  );
}

// =====================================================
// Weekly energy
// =====================================================

export interface WeeklyEnergyDay {
  date: Date;
  dateKey: string;
  label: string;

  // Food
  consumed: number;

  // Exercise/cardio
  burned: number;
}

// =====================================================
// Local date formatter
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
// Weekly water
//
// Sunday -> Saturday
//
// Water consumed per day in ml
// =====================================================

export interface WeeklyWaterDay {
  date: Date;
  dateKey: string;
  label: string;
  waterMl: number;
}

// =====================================================
// Get current week's water consumption
//
// Returns water consumed per day
// for Sunday -> Saturday
// =====================================================

export async function getCurrentWeekWater(
  userId: string
): Promise<WeeklyWaterDay[]> {
  if (!userId) {
    return [];
  }

  const today = new Date();

  const dayOfWeek = today.getDay();

  // Find Sunday of current week
  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayOfWeek
  );

  const labels = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
  ];

  const days: WeeklyWaterDay[] = [];

  // ===================================================
  // Fetch each day
  // ===================================================

  for (let i = 0; i < 7; i++) {
    const date = new Date(
      sunday.getFullYear(),
      sunday.getMonth(),
      sunday.getDate() + i
    );

    let waterMl = 0;

    try {
      const logs = await getDailyLogs(
        userId,
        date
      );
     
      // -----------------------------------------------
      // Sum water from all logs
      // -----------------------------------------------

      logs.forEach((log) => {
        waterMl += Number(
          log.waterMl || 0
        );
      });
    } catch (error) {
      console.log(
        `WEEKLY WATER ERROR ${formatDateKey(
          date
        )}:`,
        error
      );
    }

    days.push({
      date,

      dateKey:
        formatDateKey(date),

      label:
        labels[i],

      waterMl:
        Math.round(waterMl),
    });
  }

  return days;
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
    getDailyLogsRef(
      userId,
      date
    );

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
// Check whether a date has activity
// =====================================================

export async function hasDailyActivity(
  userId: string,
  date: Date
): Promise<boolean> {
  if (!db) {
    return false;
  }

  const logsRef =
    getDailyLogsRef(
      userId,
      date
    );

  if (!logsRef) {
    return false;
  }

  const snapshot =
    await getDocs(logsRef);

  return !snapshot.empty;
}

// =====================================================
// Get current week's activity
//
// Sunday -> Saturday
// =====================================================

export async function getCurrentWeekActivity(
  userId: string
): Promise<WeeklyActivityDay[]> {
  if (!userId) {
    return [];
  }

  const today = new Date();

  const dayOfWeek =
    today.getDay();

  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - dayOfWeek
  );

  const days: WeeklyActivityDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(
      sunday.getFullYear(),
      sunday.getMonth(),
      sunday.getDate() + i
    );

    const active =
      await hasDailyActivity(
        userId,
        date
      );

    days.push({
      date,

      dateKey:
        formatDateKey(date),

      active,
    });
  }

  return days;
}

// =====================================================
// Calculate current streak
//
// Counts consecutive active days
// ending today.
// =====================================================

export function calculateCurrentStreak(
  weeklyActivity: WeeklyActivityDay[]
): number {
  if (
    weeklyActivity.length !== 7
  ) {
    return 0;
  }

  const today =
    new Date();

  const todayIndex =
    today.getDay();

  let streak = 0;

  for (
    let index = todayIndex;
    index >= 0;
    index--
  ) {
    if (
      !weeklyActivity[index]?.active
    ) {
      break;
    }

    streak++;
  }

  return streak;
}

// =====================================================
// Calculate daily totals
//
// FOOD
// -> consumed calories
//
// EXERCISE
// -> burned calories
// =====================================================

export function calculateDailyTotals(
  logs: DailyLog[]
): DailyTotals {
  return logs.reduce(
    (totals, log) => {
      const calories =
        Number(log.calories || 0);

      // -----------------------------------------------
      // Food
      // -----------------------------------------------

      if (log.type === "food") {
        totals.consumedCalories +=
          calories;

        totals.protein +=
          Number(
            log.protein || 0
          );

        totals.fat +=
          Number(
            log.fat || 0
          );

        totals.carbs +=
          Number(
            log.carbs || 0
          );
      }

      // -----------------------------------------------
      // Exercise
      // -----------------------------------------------

      if (log.type === "exercise") {
        totals.burnedCalories +=
          calories;
      }

      // -----------------------------------------------
      // Water
      // -----------------------------------------------

      totals.waterMl +=
        Number(
          log.waterMl || 0
        );

      // -----------------------------------------------
      // Backward compatibility
      // -----------------------------------------------

      totals.calories +=
        calories;

      return totals;
    },
    {
      calories: 0,

      consumedCalories: 0,

      burnedCalories: 0,

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
    calculateDailyTotals(
      logs
    );

  return {
    logs,
    totals,
  };
}

// =====================================================
// Get current week's energy
//
// Sunday -> Saturday
//
// FOOD
// consumed
//
// EXERCISE
// burned
// =====================================================

export async function getCurrentWeekEnergy(
  userId: string
): Promise<WeeklyEnergyDay[]> {
  if (!userId) {
    return [];
  }

  const today =
    new Date();

  const dayOfWeek =
    today.getDay();

  const sunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() -
      dayOfWeek
  );

  const labels = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
  ];

  const days: WeeklyEnergyDay[] =
    [];

  // ===================================================
  // Fetch each day
  // ===================================================

  for (
    let i = 0;
    i < 7;
    i++
  ) {
    const date = new Date(
      sunday.getFullYear(),
      sunday.getMonth(),
      sunday.getDate() + i
    );

    let consumed = 0;

    let burned = 0;

    try {
      const logs =
        await getDailyLogs(
          userId,
          date
        );

      logs.forEach((log) => {
        const calories =
          Number(
            log.calories || 0
          );

        // ---------------------------------------------
        // Food = consumed
        // ---------------------------------------------

        if (
          log.type ===
          "food"
        ) {
          consumed +=
            calories;
        }

        // ---------------------------------------------
        // Exercise = burned
        // ---------------------------------------------

        if (
          log.type ===
          "exercise"
        ) {
          burned +=
            calories;
        }
      });
    } catch (error) {
      console.log(
        `WEEKLY ENERGY ERROR ${formatDateKey(
          date
        )}:`,
        error
      );
    }

    days.push({
      date,

      dateKey:
        formatDateKey(date),

      label:
        labels[i],

      consumed:
        Math.round(
          consumed
        ),

      burned:
        Math.round(
          burned
        ),
    });
  }

  return days;
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
    getDailyLogsRef(
      userId,
      date
    );

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
      Number(
        log.calories ?? 0
      ),

    protein:
      Number(
        log.protein ?? 0
      ),

    fat:
      Number(
        log.fat ?? 0
      ),

    carbs:
      Number(
        log.carbs ?? 0
      ),

    waterMl:
      Number(
        log.waterMl ?? 0
      ),

    duration:
      log.duration ?? null,

    intensity:
      log.intensity ?? null,

    createdAt:
      serverTimestamp(),
  });
}