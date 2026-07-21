import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { wishlistRouter } from "./routers/wishlist";
import { cartRouter } from "./routers/cart";
import { articlesRouter } from "./routers/articles";
import { ordersRouter } from "./routers/orders";
import { googleAdsRouter } from "./routers/googleAds";
import { seoRouter } from "./routers/seo";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  wishlist: wishlistRouter,
  cart: cartRouter,
  articles: articlesRouter,
  orders: ordersRouter,
  googleAds: googleAdsRouter,
  seo: seoRouter,
});

export type AppRouter = typeof appRouter;
