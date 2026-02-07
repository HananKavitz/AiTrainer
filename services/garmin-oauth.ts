import * as WebBrowser from 'expo-web-browser';
import CryptoJS from 'crypto-js';

// Garmin Connect OAuth configuration
const GARMIN_CLIENT_ID = process.env.GARMIN_CLIENT_ID || 'your-client-id';
const GARMIN_REDIRECT_URI = 'aitrainer://oauth/callback';

const GARMIN_OAUTH_URL =
  'https://connect.garmin.com/oauthConfirm';
const GARMIN_TOKEN_URL = 'https://connectapi.garmin.com/oauth-service/oauth/access_token';

/**
 * Generate a secure state parameter for OAuth
 */
function generateState(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

/**
 * Generate a code verifier for PKCE
 */
function generateCodeVerifier(): string {
  return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64url);
}

/**
 * Generate code challenge from code verifier
 */
function generateCodeChallenge(verifier: string): string {
  const hashed = CryptoJS.SHA256(verifier);
  return CryptoJS.enc.Base64url.stringify(hashed);
}

/**
 * Initiate Garmin Connect OAuth flow
 */
export async function initiateGarminOAuth(): Promise<{ userId: string; accessToken: string }> {
  WebBrowser.maybeCompleteAuthSession();

  const state = generateState();
  const verifier = generateCodeVerifier();
  const challenge = generateCodeChallenge(verifier);

  // Store verifier for token exchange (in production, use secure storage)
  const authRequestUrl = `${GARMIN_OAUTH_URL}?client_id=${GARMIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    GARMIN_REDIRECT_URI
  )}&response_type=code&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`;

  // For MVP, we'll mock the OAuth flow
  // In production, use AuthSession.startAsync from expo-auth-session
  return mockExchangeCodeForToken('mock_code');
}

/**
 * Mock implementation - In production, this should call your backend
 */
async function mockExchangeCodeForToken(code: string): Promise<{ userId: string; accessToken: string }> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock response - In production, make actual API call to Garmin
  const mockUserId = 'garmin_user_' + CryptoJS.lib.WordArray.random(8).toString();
  const mockAccessToken = 'mock_token_' + CryptoJS.lib.WordArray.random(32).toString();

  return {
    userId: mockUserId,
    accessToken: mockAccessToken,
  };
}

/**
 * Refresh Garmin access token
 */
export async function refreshGarminToken(refreshToken: string): Promise<string> {
  // Mock implementation - In production, make actual API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return 'mock_refreshed_token_' + CryptoJS.lib.WordArray.random(32).toString();
}

/**
 * Disconnect Garmin account
 */
export async function disconnectGarmin(): Promise<void> {
  // Clear stored tokens
  const { updateUserData } = await import('./storage');
  await updateUserData({
    garminUserId: null,
    garminAccessToken: null,
    garminRefreshToken: null,
    garminTokenExpiresAt: null,
  });
}
