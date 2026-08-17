// ============================================================
// FatSecret Service - OAuth 1.0
// ============================================================
//
// DEVELOPMENT ONLY
//
// FatSecret OAuth 1.0 requires:
//
//   Consumer Key
//   Shared Secret
//   HMAC-SHA1 signature
//
// Food search does NOT require a FatSecret user login.
//
// IMPORTANT:
// Do NOT ship the Shared Secret inside a production Expo app.
// Move this API call to your backend before production.
//
// ============================================================

import CryptoJS from "crypto-js";

// ============================================================
// FatSecret Configuration
// ============================================================
//
// IMPORTANT:
// These MUST be your OAuth 1.0 credentials:
//
//   Consumer Key
//   Shared Secret
//
// DO NOT put OAuth 2.0 Client ID / Client Secret here.
//

const FATSECRET_CONSUMER_KEY =
  "f3314c3a59374952b0ec9f2e234918f4";

const FATSECRET_SHARED_SECRET =
  "b99069e0c681431aa115e0220d54cb59";

// FatSecret OAuth 1.0 REST endpoint
const FATSECRET_API_URL =
  "https://platform.fatsecret.com/rest/server.api";

// ============================================================
// Types
// ============================================================

export interface FatSecretServing {
  serving_id?: string;

  serving_description?: string;

  calories?: string | number;

  protein?: string | number;

  fat?: string | number;

  carbohydrate?: string | number;
}

export interface FatSecretFood {
  food_id?: string;

  food_name?: string;

  brand_name?: string;

  food_type?: string;

  food_description?: string;

  food_url?: string;

  servings?: {
    serving?:
      | FatSecretServing
      | FatSecretServing[];
  };
}

interface FatSecretSearchResponse {
  foods?: {
    max_results?: number | string;

    total_results?: number | string;

    page_number?: number | string;

    food?:
      | FatSecretFood
      | FatSecretFood[];
  };

  error?: {
    code?: string | number;

    message?: string;
  };
}

// ============================================================
// OAuth 1.0 Helpers
// ============================================================

/**
 * OAuth 1.0 requires RFC 3986 percent encoding.
 */
function oauthEncode(
  value: string
): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (character) =>
      `%${character
        .charCodeAt(0)
        .toString(16)
        .toUpperCase()}`
  );
}

/**
 * Generate a unique OAuth nonce.
 */
function generateNonce(): string {
  return (
    `${Date.now()}-` +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

/**
 * OAuth timestamp.
 *
 * FatSecret expects Unix timestamp
 * in seconds.
 */
function generateTimestamp(): string {
  return Math.floor(
    Date.now() / 1000
  ).toString();
}

// ============================================================
// Normalize Parameters
// ============================================================

function normalizeParameters(
  parameters: Record<string, string>
): string {
  return Object.entries(parameters)
    .map(([key, value]) => ({
      key: oauthEncode(key),
      value: oauthEncode(value),
    }))
    .sort((a, b) => {
      if (a.key === b.key) {
        return a.value.localeCompare(
          b.value
        );
      }

      return a.key.localeCompare(
        b.key
      );
    })
    .map(
      ({ key, value }) =>
        `${key}=${value}`
    )
    .join("&");
}

// ============================================================
// Create Signature Base String
// ============================================================

function createSignatureBaseString(
  httpMethod: string,
  url: string,
  parameters: Record<string, string>
): string {
  const normalizedParameters =
    normalizeParameters(
      parameters
    );

  return [
    httpMethod.toUpperCase(),

    oauthEncode(url),

    oauthEncode(
      normalizedParameters
    ),
  ].join("&");
}

// ============================================================
// Create HMAC-SHA1 Signature
// ============================================================

function createSignature(
  signatureBaseString: string
): string {
  /**
   * For a signed request without an access token:
   *
   * Consumer Secret + "&"
   *
   * FatSecret explicitly requires the "&"
   * even when there is no Access Secret.
   */
  const signingKey =
    `${oauthEncode(
      FATSECRET_SHARED_SECRET
    )}&`;

  const digest =
    CryptoJS.HmacSHA1(
      signatureBaseString,
      signingKey
    );

  return digest.toString(
    CryptoJS.enc.Base64
  );
}

// ============================================================
// Create OAuth Parameters
// ============================================================

function createOAuthParameters(): Record<
  string,
  string
> {
  return {
    oauth_consumer_key:
      FATSECRET_CONSUMER_KEY,

    oauth_signature_method:
      "HMAC-SHA1",

    oauth_timestamp:
      generateTimestamp(),

    oauth_nonce:
      generateNonce(),

    oauth_version:
      "1.0",
  };
}

// ============================================================
// Build Signed Request
// ============================================================

function buildSignedRequest(
  apiParameters: Record<string, string>
): string {
  // ----------------------------------------------------------
  // Create OAuth parameters
  // ----------------------------------------------------------

  const oauthParameters =
    createOAuthParameters();

  // ----------------------------------------------------------
  // Combine API + OAuth parameters
  // ----------------------------------------------------------

  const allParameters: Record<
    string,
    string
  > = {
    ...apiParameters,
    ...oauthParameters,
  };

  // ----------------------------------------------------------
  // Create signature base string
  // ----------------------------------------------------------

  const signatureBaseString =
    createSignatureBaseString(
      "GET",
      FATSECRET_API_URL,
      allParameters
    );

  // ----------------------------------------------------------
  // Generate HMAC-SHA1 signature
  // ----------------------------------------------------------

  const signature =
    createSignature(
      signatureBaseString
    );

  // ----------------------------------------------------------
  // Add signature
  // ----------------------------------------------------------

  allParameters.oauth_signature =
    signature;

  // ----------------------------------------------------------
  // Build final URL
  // ----------------------------------------------------------

  const queryString =
    Object.entries(
      allParameters
    )
      .map(
        ([key, value]) =>
          `${oauthEncode(
            key
          )}=${oauthEncode(
            value
          )}`
      )
      .join("&");

  return `${FATSECRET_API_URL}?${queryString}`;
}

// ============================================================
// Search Foods
// ============================================================

export async function searchFoods(
  searchExpression: string
): Promise<FatSecretFood[]> {
  const trimmed =
    searchExpression.trim();

  // ----------------------------------------------------------
  // Don't search with less than 3 characters
  // ----------------------------------------------------------

  if (trimmed.length < 3) {
    return [];
  }

  try {
    console.log(
      "FATSECRET: Searching:",
      trimmed
    );

    const foods =
      await performFoodSearch(
        trimmed
      );

    console.log(
      "FATSECRET: Found",
      foods.length,
      "foods"
    );

    return foods;
  } catch (error) {
    console.log(
      "FATSECRET FOOD SEARCH ERROR:",
      error
    );

    throw error;
  }
}

// ============================================================
// Perform Food Search
// ============================================================

async function performFoodSearch(
  searchExpression: string
): Promise<FatSecretFood[]> {
  // ----------------------------------------------------------
  // FatSecret API parameters
  // ----------------------------------------------------------

  const apiParameters: Record<
    string,
    string
  > = {
    method:
      "foods.search",

    search_expression:
      searchExpression,

    page_number:
      "0",

    max_results:
      "5",

    format:
      "json",
  };

  // ----------------------------------------------------------
  // Build OAuth 1.0 signed URL
  // ----------------------------------------------------------

  const url =
    buildSignedRequest(
      apiParameters
    );

  console.log(
    "FATSECRET SEARCH:",
    searchExpression
  );

  // Don't log the complete URL because
  // it contains the OAuth signature.

  console.log(
    "FATSECRET: Sending signed OAuth 1.0 request..."
  );

  // ----------------------------------------------------------
  // Make request
  // ----------------------------------------------------------

  const response =
    await fetch(
      url,
      {
        method: "GET",

        headers: {
          Accept:
            "application/json",
        },
      }
    );

  // ----------------------------------------------------------
  // Read response as text first
  // ----------------------------------------------------------

  const responseText =
    await response.text();

  console.log(
    "FATSECRET SEARCH STATUS:",
    response.status
  );

  // ----------------------------------------------------------
  // HTTP error
  // ----------------------------------------------------------

  if (!response.ok) {
    console.log(
      "FATSECRET HTTP ERROR:",
      responseText.substring(
        0,
        2000
      )
    );

    throw new Error(
      `FatSecret food search failed: ${response.status}`
    );
  }

  // ----------------------------------------------------------
  // Parse JSON safely
  // ----------------------------------------------------------

  let data:
    FatSecretSearchResponse;

  try {
    data =
      JSON.parse(
        responseText
      ) as FatSecretSearchResponse;
  } catch (error) {
    console.log(
      "FATSECRET INVALID JSON:"
    );

    console.log(
      responseText.substring(
        0,
        2000
      )
    );

    throw new Error(
      "FatSecret returned invalid JSON."
    );
  }

  // ----------------------------------------------------------
  // FatSecret API error
  // ----------------------------------------------------------

  if (data.error) {
    console.log(
      "FATSECRET API ERROR:",
      data.error
    );

    throw new Error(
      data.error.message ||
        `FatSecret API error: ${data.error.code}`
    );
  }

  // ----------------------------------------------------------
  // Log response
  // ----------------------------------------------------------

  console.log(
    "FATSECRET SEARCH RESPONSE:",
    JSON.stringify(
      data,
      null,
      2
    )
  );

  // ----------------------------------------------------------
  // Parse results
  // ----------------------------------------------------------

  return parseFoodResults(
    data
  );
}

// ============================================================
// Parse Food Results
// ============================================================

function parseFoodResults(
  data: FatSecretSearchResponse
): FatSecretFood[] {
  const foodData =
    data.foods?.food;

  if (!foodData) {
    return [];
  }

  const foods =
    Array.isArray(foodData)
      ? foodData
      : [foodData];

  return foods.slice(
    0,
    5
  );
}

// ============================================================
// Get Food By ID
// ============================================================
//
// Useful after the user selects a food.
//
// Example:
// const food = await getFoodById("36421");
//

export async function getFoodById(
  foodId: string
): Promise<FatSecretFood | null> {
  const trimmed =
    foodId.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const apiParameters: Record<
      string,
      string
    > = {
      method:
        "food.get",

      food_id:
        trimmed,

      format:
        "json",
    };

    const url =
      buildSignedRequest(
        apiParameters
      );

    console.log(
      "FATSECRET: Getting food:",
      trimmed
    );

    const response =
      await fetch(
        url,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },
        }
      );

    const responseText =
      await response.text();

    console.log(
      "FATSECRET FOOD STATUS:",
      response.status
    );

    if (!response.ok) {
      console.log(
        "FATSECRET FOOD ERROR:",
        responseText.substring(
          0,
          2000
        )
      );

      throw new Error(
        `FatSecret food request failed: ${response.status}`
      );
    }

    let data: {
      food?: FatSecretFood;

      error?: {
        code?: string | number;

        message?: string;
      };
    };

    try {
      data =
        JSON.parse(
          responseText
        );
    } catch (error) {
      console.log(
        "FATSECRET FOOD INVALID JSON:",
        responseText.substring(
          0,
          2000
        )
      );

      throw new Error(
        "FatSecret food request returned invalid JSON."
      );
    }

    if (data.error) {
      throw new Error(
        data.error.message ||
          `FatSecret API error: ${data.error.code}`
      );
    }

    return data.food || null;
  } catch (error) {
    console.log(
      "FATSECRET GET FOOD ERROR:",
      error
    );

    throw error;
  }
}