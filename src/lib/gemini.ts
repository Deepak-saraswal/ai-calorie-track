import { GoogleGenAI } from "@google/genai";

// ==================================================
// Gemini Client
// ==================================================

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Gemini API key is missing.");
}

const ai = new GoogleGenAI({
  apiKey,
});

// ==================================================
// Constants
// ==================================================

const GEMINI_MODEL = "gemini-3.6-flash";

const MAX_RETRIES = 3;

// ==================================================
// Helper: Delay
// ==================================================

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==================================================
// Helper: Check Retryable Gemini Error
// ==================================================

function isRetryableError(error: any) {
  const message = String(
    error?.message || error || ""
  ).toLowerCase();

  return (
    message.includes("503") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("temporarily") ||
    message.includes("overloaded") ||
    message.includes("429") ||
    message.includes("rate limit")
  );
}

// ==================================================
// Helper: Generate Gemini Content With Retry
// ==================================================

async function generateWithRetry(
  contents: any,
  config: any
) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `🤖 Gemini request - attempt ${attempt}/${MAX_RETRIES}`
      );

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents,
        config,
      });

      return response;
    } catch (error) {
      lastError = error;

      console.log(
        `❌ Gemini attempt ${attempt} failed:`,
        error
      );

      // Do not retry permanent errors such as 404
      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt === MAX_RETRIES) {
        break;
      }

      const waitTime = attempt * 1500;

      console.log(
        `⏳ Retrying Gemini in ${waitTime}ms...`
      );

      await delay(waitTime);
    }
  }

  throw lastError;
}

// ==================================================
// Fitness Plan
// ==================================================

export async function generateFitnessPlan(
  profile: any
) {
  const prompt = `
You are an expert fitness coach and certified nutritionist.

Based on the user's details, calculate scientifically reasonable values.

User Details

Gender: ${profile.gender}

Goal: ${profile.goal}

Workout Frequency: ${profile.workout}

Birth Date: ${profile.birthDate}

Height:
${profile.height.feet} feet
${profile.height.inches} inches

Weight:
${profile.weight} kg

Return ONLY valid JSON.

{
  "dailyCalories": 0,
  "protein": 0,
  "carbs": 0,
  "fats": 0,
  "waterLitres": 0,
  "bmi": 0,
  "bmr": 0,
  "idealWeight": "",
  "bodyType": "",
  "workoutSummary": "",
  "nutritionTips": [
    "",
    "",
    ""
  ],
  "dailyHabits": [
    "",
    "",
    ""
  ]
}

Rules:

- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.
- All numeric values must be numbers.
- dailyCalories must be a number.
- protein must be grams as a number.
- carbs must be grams as a number.
- fats must be grams as a number.
- waterLitres must be a number.
- bmi must be a number.
- bmr must be a number.
- idealWeight must be a string.
- bodyType must be a string.
- workoutSummary must be a string.
- nutritionTips must contain exactly 3 strings.
- dailyHabits must contain exactly 3 strings.
`;

  try {
    console.log("=================================");
    console.log("🤖 Generating Fitness Plan...");
    console.log("=================================");

    const response = await generateWithRetry(
      prompt,
      {
        responseMimeType: "application/json",
        temperature: 0.4,
      }
    );

    const text = response.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty fitness plan response."
      );
    }

    console.log("🏋️ Gemini Fitness Response:");
    console.log(text);

    const result = JSON.parse(text);

    // ==================================================
    // Validate Response
    // ==================================================

    if (
      typeof result.dailyCalories !== "number" ||
      typeof result.protein !== "number" ||
      typeof result.carbs !== "number" ||
      typeof result.fats !== "number" ||
      typeof result.waterLitres !== "number" ||
      typeof result.bmi !== "number" ||
      typeof result.bmr !== "number" ||
      typeof result.idealWeight !== "string" ||
      typeof result.bodyType !== "string" ||
      typeof result.workoutSummary !== "string" ||
      !Array.isArray(result.nutritionTips) ||
      !Array.isArray(result.dailyHabits)
    ) {
      throw new Error(
        "Gemini returned invalid fitness plan data."
      );
    }

    if (
      result.nutritionTips.length !== 3 ||
      result.dailyHabits.length !== 3
    ) {
      throw new Error(
        "Gemini returned an invalid number of tips or habits."
      );
    }

    console.log(
      "✅ Fitness plan generated successfully."
    );

    return result;
  } catch (error) {
    console.log(
      "❌ Gemini Fitness Plan Error:",
      error
    );

    throw error;
  }
}

// ==================================================
// Food Image Analysis
// ==================================================

export async function analyzeFoodImage(
  base64Image: string,
  mimeType: string = "image/jpeg"
) {
  const prompt = `
You are an expert nutritionist and food recognition AI.

Analyze the provided food image carefully.

Identify the most likely food/dish shown in the image and estimate its nutritional information.

Return ONLY valid JSON in exactly this structure:

{
  "foodName": "",
  "servingSize": "",
  "calories": 0,
  "protein": 0,
  "carbs": 0,
  "fat": 0
}

Rules:

- foodName: name of the food or dish.
- servingSize: estimated serving size such as "1 plate", "1 cup", "2 pieces", etc.
- calories: estimated calories for the identified serving.
- protein: estimated protein in grams.
- carbs: estimated carbohydrates in grams.
- fat: estimated fat in grams.
- All nutrition values must be numbers.
- Do not include units inside numeric values.
- Do not return null.
- Do not return markdown.
- Do not return a code block.
- Do not include any explanation.
- Return ONLY valid JSON.
`;

  try {
    console.log("=================================");
    console.log("🍎 Analyzing Food Image...");
    console.log("=================================");

    if (!base64Image) {
      throw new Error(
        "Food image data is missing."
      );
    }

    const response = await generateWithRetry(
      [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    );

    const text = response.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty food analysis response."
      );
    }

    console.log("🍎 Gemini Food Response:");
    console.log(text);

    const result = JSON.parse(text);

    // ==================================================
    // Validate Response
    // ==================================================

    if (
      !result.foodName ||
      !result.servingSize ||
      typeof result.calories !== "number" ||
      typeof result.protein !== "number" ||
      typeof result.carbs !== "number" ||
      typeof result.fat !== "number"
    ) {
      throw new Error(
        "Gemini returned invalid food nutrition data."
      );
    }

    console.log(
      "✅ Food analysis completed successfully."
    );

    return result;
  } catch (error) {
    console.log(
      "❌ Gemini Food Analysis Error:",
      error
    );

    throw error;
  }
}