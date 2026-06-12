import { Context } from "npm:hono";

// Service account credentials (embedded for demo — move to Supabase secrets for production)
const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "n8n-whatsapp-497803",
  private_key_id: "97cce810de58de31ba1ee56f1e5586519410888c",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDANZ3vMc9I4TQo\nynybONwfVq7h8V3ZgExLy+nQACWjIPgNsDaWoDw4sDaz+3ukuSVs+SDq/pXMkc3V\nHQ3vDJYd8Dc2O6Be5O1RvBh8dhAHGisiWMR7lm6z0r+oikIclhU8MdlXw6rdu0jY\na8avbJ0WUuy7AUG0y2oAICPDXvbGLCa8zYcK9QbAA72rHtJJ4wBzoSC9fGZlTezh\nJE/g3Zds7VFdDrY4ST9L3cqiziy0Hs4reAY+MaRg+520jfrpbtx/ThkOYGl0BRAj\nfaSAys5XCDcrA8F+r4dhs7CGx4xdWj0IQzp50mpV/X4fLhQBIwQmKkrkHs8RsP2T\nyLnXwQ81AgMBAAECggEAIYSYFICuoYpoIp7g6N6bADoJCCyjjYzCgUs/bD7CUXar\n2xM6Cb1KkyYje/JkZt7EiILPOzuHGuPoLXxCFEgxG2pq7mGqfzHTsrem23lpJRvq\nnrQ1G0op5uDe/ECT89E2Rcd5m8Tq1HzW4Kq2vJunrx9p2diHwUPhqcDxC55RUVBP\nLlmgIcrraCxJyTtvpJGEPdGPJxFvwz0R7GlNbQ/UmhHiE4Edtwp1xQLKbsi3m8GP\nM/k5cl1Qz3dmcHFF3NpZda9daHYJ+sfUKtV+ws0/jAUBeO74YeT81Fm8D4BJ4z6J\naisj9xavCClvlvazhYwFzXipcITUaY48U7JP5U8/1wKBgQDs9OsRZZvHM8o7eIIM\nntw9EaryqOfLz5wB6DK3QgQ4vEoH4A1393Zx+FCJNsxwpKS22CEW5h9gJO7emCsn\nzow+a5n66p2wdqXEdyxaFfHll8gDE+HzI5pPbqYMCpurU1+yR0pepeSRVx6e96xj\ntNio0zlEPb5HtcT61rlgZCd1IwKBgQDPqBSrfIjPek+1QiRUUsFN/LqKT2Pajj1P\nb/7TvM20+kGYxq+RPgIgaL2vmGaGxWg3eu73atNaEYHYalVx5ZRPkE7sSsWL3mLN\naTyXQSB4RRzjzGUwmDobR+dRYBAG59qP71EXAP6tu7F7vqf+RHAuyAzcMpWvkeRJ\nCBvHiMmLxwKBgGmUY1z4CiYDJHvFISUgb39ibOn8anO8iIWtAVP4PUtOUioaIcYv\nY/46JyBMY2FZau7xdCTw2lALhMd3w9rTxFdXuF89xI9I/mmAtClbl9G2BG+in02n\nsmzsH15EJ8J5vqz/6NotTp+X0tQABTbT8Kmgm+aVIEBxdFhT7ntNhOtDAoGAXPfW\nUTRPF/ydhPwYwbvPGXhFl7iVbvrxjggJIYjM2/KSvbBuV+tYDmR2UBA+DqaA0x3x\nsMmd2BwwctCgcn6jWL+15epP6R/mQiqUWu9odxASMBaJUylEEoStlmwYoM7atkgh\nmNf0LZnziwA/vAGt6/PadhcbluANQXkk3r9p5G8CgYEA2bPOPlSbprV4XzQIaafR\nG6SeA2VpNbzX63sqqOnIFb8ZXyqV+WLldlZ+CM6QuzxKoIvLjaJ46uZRfawZhvpq\n77qSd/3cYIYMl8ib/GWWKpoBe4tAV+hDC6irnavmn3wm6JLJnLtAp6MYpKqzOOZQ\nk3zAjqPInuwhFUKVpZswgac=\n-----END PRIVATE KEY-----\n",
  client_email: "n8n-vertex@n8n-whatsapp-497803.iam.gserviceaccount.com",
  client_id: "112728867694731929562",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/n8n-vertex%40n8n-whatsapp-497803.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const VERTEX_AI_URL =
  "https://us-central1-aiplatform.googleapis.com/v1/projects/n8n-whatsapp-497803/locations/us-central1/publishers/google/models/gemini-2.5-flash:generateContent";

// Base64url encode helper
function base64url(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Import private key from PEM for signing
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");

  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    "pkcs8",
    binaryDer.buffer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

// Generate a signed JWT for OAuth2 token exchange
async function createSignedJWT(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const oneHour = 3600;

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: SERVICE_ACCOUNT.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + oneHour,
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerB64 = base64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64url(encoder.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const privateKey = await importPrivateKey(SERVICE_ACCOUNT.private_key);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    encoder.encode(signingInput)
  );

  const signatureB64 = base64url(new Uint8Array(signature));
  return `${signingInput}.${signatureB64}`;
}

// Exchange JWT for a short-lived access token
async function getAccessToken(): Promise<string> {
  const jwt = await createSignedJWT();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

// Call Vertex AI Gemini model
async function callGemini(prompt: string): Promise<string> {
  const accessToken = await getAccessToken();

  const response = await fetch(VERTEX_AI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vertex AI error: ${response.status} - ${error}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content: { parts: Array<{ text: string }> };
    }>;
  };

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error("No candidates returned from Gemini");
  }

  return data.candidates[0].content.parts[0].text;
}

// Hono route handler
export async function handleGemini(c: Context): Promise<Response> {
  try {
    const body = (await c.req.json()) as { prompt: string };
    const { prompt } = body;

    if (!prompt || prompt.trim().length === 0) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    console.log(`🤖 Generating routine with Gemini...`);
    const text = await callGemini(prompt);
    console.log(`✅ Gemini response received`);

    return c.json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return c.json({ error: "Gemini generation failed", details: message }, 500);
  }
}
