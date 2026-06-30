import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

function getCallbackUrl(req: Request): string {
  // Use configured callback URL or derive from request
  return (
    process.env.GOOGLE_CALLBACK_URL ||
    `${req.protocol}://${req.get("host")}/api/auth/google/callback`
  );
}

export function registerGoogleAuthRoutes(app: Express) {
  // Step 1: Redirect to Google
  app.get("/api/auth/google", (req: Request, res: Response) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      res.status(500).send("Google OAuth not configured");
      return;
    }

    const callbackUrl = getCallbackUrl(req);
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "select_account",
    });

    res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
  });

  // Step 2: Handle Google callback
  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const error = req.query.error as string;

    if (error || !code) {
      console.error("[GoogleAuth] Error from Google:", error);
      res.redirect("/?auth=error");
      return;
    }

    try {
      const clientId = process.env.GOOGLE_CLIENT_ID!;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
      const callbackUrl = getCallbackUrl(req);

      // Exchange code for tokens
      const tokenResp = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResp.ok) {
        const body = await tokenResp.text();
        console.error("[GoogleAuth] Token exchange failed:", body);
        res.redirect("/?auth=error");
        return;
      }

      const tokens = (await tokenResp.json()) as { access_token: string };

      // Get user info from Google
      const userResp = await fetch(GOOGLE_USERINFO_URL, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });

      if (!userResp.ok) {
        console.error("[GoogleAuth] Failed to get user info");
        res.redirect("/?auth=error");
        return;
      }

      const googleUser = (await userResp.json()) as {
        sub: string;
        name: string;
        email: string;
        picture: string;
      };

      const openId = `google:${googleUser.sub}`;
      const adminEmail = process.env.ADMIN_EMAIL || ENV.ownerOpenId;
      const isAdmin = googleUser.email === adminEmail;

      // Upsert user in DB
      await db.upsertUser({
        openId,
        name: googleUser.name || null,
        email: googleUser.email || null,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });

      // Set admin role if this is the admin email
      if (isAdmin) {
        await db.setUserRole(openId, "admin");
      }

      // Create session JWT
      const sessionToken = await sdk.createSessionToken(openId, {
        name: googleUser.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect("/");
    } catch (err) {
      console.error("[GoogleAuth] Callback failed:", err);
      res.redirect("/?auth=error");
    }
  });
}
