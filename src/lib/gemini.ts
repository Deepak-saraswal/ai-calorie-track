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