import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { cartItems } from '../../drizzle/schema';

export const cartRouter = router({
  // Get all cart items for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
    return db
      .select()
      .from(cartItems)
      .where(eq(cartItems.userId, ctx.user.id));
  }),

  // Add or increment a cart item
  addItem: protectedProcedure
    .input(z.object({
      productId: z.string().min(1),
      color: z.string().default('Default'),
      quantity: z.number().int().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });

      const existing = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.userId, ctx.user.id),
            eq(cartItems.productId, input.productId),
            eq(cartItems.color, input.color)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        const newQty = existing[0].quantity + input.quantity;
        await db
          .update(cartItems)
          .set({ quantity: newQty })
          .where(eq(cartItems.id, existing[0].id));
        return { ...existing[0], quantity: newQty };
      } else {
        await db.insert(cartItems).values({
          userId: ctx.user.id,
          productId: input.productId,
          color: input.color,
          quantity: input.quantity,
        });
        const inserted = await db
          .select()
          .from(cartItems)
          .where(
            and(
              eq(cartItems.userId, ctx.user.id),
              eq(cartItems.productId, input.productId),
              eq(cartItems.color, input.color)
            )
          )
          .limit(1);
        return inserted[0];
      }
    }),

  // Update quantity of a specific cart item
  updateQuantity: protectedProcedure
    .input(z.object({ itemId: z.number().int(), quantity: z.number().int().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      await db
        .update(cartItems)
        .set({ quantity: input.quantity })
        .where(
          and(eq(cartItems.id, input.itemId), eq(cartItems.userId, ctx.user.id))
        );
      return { success: true };
    }),

  // Remove a specific cart item
  removeItem: protectedProcedure
    .input(z.object({ itemId: z.number().int() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
      await db
        .delete(cartItems)
        .where(
          and(eq(cartItems.id, input.itemId), eq(cartItems.userId, ctx.user.id))
        );
      return { success: true };
    }),

  // Clear all items from cart
  clear: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database unavailable' });
    await db.delete(cartItems).where(eq(cartItems.userId, ctx.user.id));
    return { success: true };
  }),
});
