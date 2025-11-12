// src/utils/googleAuth.js

import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

// ✅ WEB CLIENT ID (WAJIB untuk EXPO GO)
const CLIENT_ID =
  "1075657202477-9o8jd8hhhobq39hcl03h1u7fqfnaru50.apps.googleusercontent.com";

export async function signInWithGoogle() {
  // ✅ Redirect otomatis via Expo (tanpa scheme)
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true,
  });

  console.log("🔗 Redirect URI:", redirectUri);

  // ✅ Discovery (endpoint Google)
  const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/revoke",
  };

  const scopes = ["openid", "profile", "email"];

  // ✅ URL Login Google
  const authUrl =
    `${discovery.authorizationEndpoint}?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=token` +
    `&scope=${encodeURIComponent(scopes.join(" "))}`;

  try {
    // ✅ Start Login Google
    const result = await AuthSession.startAsync({
      authUrl,
      returnUrl: redirectUri,
    });

    if (result.type === "success" && result.params.access_token) {
      console.log("✅ Google Login Success:", result.params.access_token);

      // ✅ Ambil data user dari Google API
      const user = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: {
          Authorization: `Bearer ${result.params.access_token}`,
        },
      }).then((res) => res.json());

      console.log("👤 User Info:", user);

      return user; // ✅ Berikan data user ke app kamu
    } else {
      console.log("❌ Login dibatalkan:", result);
      return null;
    }
  } catch (err) {
    console.log("🚨 Google Login ERROR:", err);
    return null;
  }
}