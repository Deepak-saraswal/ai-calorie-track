import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY!,
});

export async function generateFitnessPlan(profile: any) {
  const prompt = `
You are an expert fitness coach and certified nutritionist.

Based on the user's details, calculate scientifically accurate values.

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
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    console.log("Gemini Response:");
    console.log(text);

    return JSON.parse(text);
  } catch (error) {
    console.log("Gemini Error:", error);
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
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",

      contents: [
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

      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error(
        "Gemini returned an empty food analysis response."
      );
    }

    console.log("🍎 Gemini Food Response:");
    console.log(text);

    const result = JSON.parse(text);

    // Basic validation
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

    return result;
  } catch (error) {
    console.log(
      "❌ Gemini Food Analysis Error:",
      error
    );

    throw error;
  }
}