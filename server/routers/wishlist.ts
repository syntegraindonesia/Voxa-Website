import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { wishlists } from '../../drizzle/schema';

export const wishlistRouter = router({
  // Get all wishlist product IDs for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
    const rows = await db
      .select({ productId: wishlists.productId })
      .from(wishlists)
      .where(eq(wishlists.userId, ctx.user.id));
    return rows.map((r) => r.productId);
  }),

  // Toggle a product in/out of wishlist; returns new state
  toggle: protectedProcedure
    .input(z.object({ productId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

      const existing = await db
        .select({ id: wishlists.id })
        .from(wishlists)
        .where(
          and(
            eq(wishlists.userId, ctx.user.id),
            eq(wishlists.productId, input.productId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .delete(wishlists)
          .where(
            and(
              eq(wishlists.userId, ctx.user.id),
              eq(wishlists.productId, input.productId)
            )
          );
        return { saved: false };
      } else {
        await db.insert(wishlists).values({
          userId: ctx.user.id,
          productId: input.productId,
        });
        return { saved: true };
      }
    }),
});
