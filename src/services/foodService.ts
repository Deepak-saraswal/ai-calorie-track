// ============================================================
// Food Service
// ============================================================
//
// This service connects the Food Database screen
// to the FatSecret service.
//
// ============================================================

import {
    FatSecretFood,
    searchFoods as searchFatSecretFoods,
} from "@/lib/fatsecret";

// ============================================================
// Types
// ============================================================

export interface FoodSearchResult {
  food_id: string;

  food_name: string;

  brand_name?: string;

  food_type?: string;

  food_description?: string;

  serving_description?: string;

  calories?: number;

  protein?: number;

  fat?: number;

  carbohydrate?: number;
}

// ============================================================
// Search Food Database
// ============================================================

export async function searchFoodDatabase(
  searchTerm: string
): Promise<FoodSearchResult[]> {
  const trimmed =
    searchTerm.trim();

  // ----------------------------------------------------------
  // Minimum 3 characters
  // ----------------------------------------------------------

  if (trimmed.length < 3) {
    return [];
  }

  try {
    const foods =
      await searchFatSecretFoods(
        trimmed
      );

    return foods
      .slice(0, 5)
      .map(
        (
          food: FatSecretFood
        ): FoodSearchResult => {
          const serving =
            getFirstServing(food);

          return {
            food_id:
              String(
                food.food_id ?? ""
              ),

            food_name:
              String(
                food.food_name ?? ""
              ),

            brand_name:
              food.brand_name,

            food_type:
              food.food_type,

            food_description:
              food.food_description,

            serving_description:
              serving
                ?.serving_description,

            calories:
              toNumber(
                serving?.calories
              ),

            protein:
              toNumber(
                serving?.protein
              ),

            fat:
              toNumber(
                serving?.fat
              ),

            carbohydrate:
              toNumber(
                serving?.carbohydrate
              ),
          };
        }
      );
  } catch (error) {
    console.log(
      "FOOD DATABASE SEARCH ERROR:",
      error
    );

    throw error;
  }
}

// ============================================================
// Get First Serving
// ============================================================

function getFirstServing(
  food: FatSecretFood
) {
  const servings =
    food.servings?.serving;

  if (!servings) {
    return undefined;
  }

  if (Array.isArray(servings)) {
    return servings[0];
  }

  return servings;
}

// ============================================================
// Convert Number
// ============================================================

function toNumber(
  value?: string | number
): number | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const number =
    Number(value);

  return Number.isNaN(number)
    ? undefined
    : number;
}