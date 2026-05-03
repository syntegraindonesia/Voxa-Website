import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { COOKIE_NAME } from "../shared/const";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: { name: string; options: Record<string, unknown> }[] } {
  const clearedCookies: { name: string; options: Record<string, unknown> }[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "voxa-test-user",
    email: "test@voxa.co.id",
    name: "VOXA Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("VOXA Website - Auth", () => {
  it("auth.me returns null for unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("auth.me returns user for authenticated users", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("test@voxa.co.id");
  });

  it("auth.logout clears session cookie and returns success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({ maxAge: -1 });
  });
});

describe("VOXA Website - Product Data", () => {
  it("should have exactly 15 sepeda listrik products", async () => {
    const { sepedaListrik } = await import("../client/src/data/products");
    expect(sepedaListrik).toHaveLength(15);
  });

  it("should have exactly 9 batre products", async () => {
    const { batre } = await import("../client/src/data/products");
    expect(batre).toHaveLength(9);
  });

  it("all sepeda listrik should have required fields", async () => {
    const { sepedaListrik } = await import("../client/src/data/products");
    for (const product of sepedaListrik) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.price).toBeTruthy();
      expect(product.specs.jarakTempuh).toBeTruthy();
      expect(product.specs.baterai).toBeTruthy();
      expect(product.specs.kecepatan).toBeTruthy();
      expect(product.category).toBe("sepeda-listrik");
    }
  });

  it("all batre should have required fields", async () => {
    const { batre } = await import("../client/src/data/products");
    for (const product of batre) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.price).toBeTruthy();
      expect(product.category).toBe("batre");
    }
  });

  it("getProductById should return correct product", async () => {
    const { getProductById } = await import("../client/src/data/products");
    const product = getProductById("liberty");
    expect(product).not.toBeUndefined();
    expect(product?.name).toBe("Liberty");
  });

  it("getProductById should return undefined for non-existent product", async () => {
    const { getProductById } = await import("../client/src/data/products");
    const product = getProductById("non-existent-product");
    expect(product).toBeUndefined();
  });
});
