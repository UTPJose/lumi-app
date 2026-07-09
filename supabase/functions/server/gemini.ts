import { Context } from "npm:hono";

// Service account credentials (embedded for demo — move to Supabase secrets for production)
const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "n8n-whatsapp-497803",
  private_key_id: "0d3ab993820245d7fc83a889f7aacefdcee46d29",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEtubHXS7b4sfU\nEqTzLgY5iQL0CxnJTvjiialVYEorkKV9TFKuuwGUdal9b5XqzruE0U/1YKnKX89q\nxY/pxyqA0+aN4/QplBIZvFGDyG1DB7c4sHtr6n5mx/TOu9gnjJ8E6bUtt7B7dWgU\ntvi4m3+KRV0xNaaaZzKZ+5qC6x0XcRGaR9HSHphpIObQrcsrb/1qVZIW6D0Wbp1i\ncjPtaxtIn9QKDssTF9D8vwQtBbHn3Qq6xVW8I3oUzbUa9tZBYHCpgagIXWvfT/ZZ\nIAU2GxegyTqp3f72KqIArOesPkBPUlAQeNn01OWT/2mhcRvTLOzrNNJYP0paQzm/\nngZCTFNTAgMBAAECggEAQB/NN/Twxv30nPWc7qa0ocG/hDUwKTbEm/g7ClkypGPp\nBmDAXTQZrj7yyrB6wsm0R/YBZiAmCRHVZ91R7eeeO9OXhu5lk74wblI8kkReFako\nuWKSQRn2LWQGMfP64N2OosfaZzZHYd9iV8pTZr5Nw5Gb8OQn1JJKZPanJgElgROo\nrVGfoCefvkqB1hRqMP4jiCYsqirZbte/759gec7saGq9gT5S56YRhvMk2/LRFmLz\nPLlR1xcYIlj4QaTMzYFeoP+APd7fDDQnUx7xq0CDz3x87i7+mkMxhvauKad//R0b\n1Obc6eV/j1/iPo4GDx8BO3UEIRNP/fBGzTCqG+QrgQKBgQDrMbzqw1FZV47RoHJH\n/IgF1SJgfdThDckQCbW+K985h0sew3qHWY0IlBOTDLDHiczAQ0rUjHSFuzYRQUIn\nfHKoyEXptRI/EZlRr62N17GIfy3jPWJNJVk2UEq99PepsCItkKM9umONdvdrRvlQ\nLQW4yVhe5YdtReGI7UvWz7BN0wKBgQDWHb2iLQaojO1cttdTKYikQVP+XDzLs5nL\nHWRv8SmL20jPU7oD8HX1znOjnBvKtjXl8dxdDWy1oBfpUiD67g135odAdn+erXoD\nvPhlvUetH/Yn9PJ2EjM1/bUmbC0M/r1fqq75Hinug6YXMGLgsg664da0PUlWSow7\n0cUtWZj0gQKBgQDkBxEWu8+/Qzjg3SJv0NNAdGgkDVu751WtCvz+KCMA779RUE0X\ntScbzhU8WO18SIoPTi7a7GJ81gmRqSeuiOXR5nqCIGBUbYesvxsRjrI9mLCwxO7t\nxOw90JLmoP8NsgsxCi56xp+GpHU1uVY2+a+2fOAFAZzPwRTtYMRKvIo+qQKBgC6f\nHzF22GJO/UgYz93dx1DsoJtb/ijknHIrnjj5q/A1+S6brn85FpZFM8zGKw8Cic3d\n0fu49pi9mTdGmMPKncgjvAN/Sd6FK3Iw7W1Jv5ekw/aDUWAAKoJxEcah+1U/CoEQ\nKzU3Ki4zIDEgagc+/hIXJqbsSVGuvcYwsNxlC/cBAoGBAOd8GcF4y1OR5rZBLPPs\nbHy3mg5lsWBQmCR90mk85IHJrHpAWnG39tWAT7mHQXrKm3GFJV9lYDF3afHujKdG\nwBD+HkEPpgwXgo0zc90g+4lgDdhwSz3CCOi6MPUKl4hNtzvdo8Wz3g6DtzBO+YQc\n3N0zUizbtWRs2JuiGRcL4Wyx\n-----END PRIVATE KEY-----\n",
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
