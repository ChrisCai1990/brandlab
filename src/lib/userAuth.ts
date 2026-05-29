import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET ?? "dev-secret-change-in-production"
);
export const USER_COOKIE = "user_session";

export async function signUserToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifyUserToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { userId: payload.userId as string, email: payload.email as string };
  } catch {
    return null;
  }
}

export async function getUserSession(): Promise<{ userId: string; email: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(USER_COOKIE)?.value;
    if (!token) return null;
    return verifyUserToken(token);
  } catch {
    return null;
  }
}

export function isSubscriptionActive(plan: string, expiry: Date | null): boolean {
  if (plan === "free") return false;
  if (plan === "lifetime") return true;
  if (!expiry) return false;
  return new Date(expiry) > new Date();
}
