import { z } from 'zod';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../_core/trpc';
import { getDb } from '../db';
import { orders } from '../../drizzle/schema';
import { ENV } from '../_core/env';
import { PRODUCT_PRICES } from '../../shared/productPrices';

const CartItemInput = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
  color: z.string().default('Default'),
});

const CustomerInput = z.object({
  name: z.string().min(2).max(256),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  address: z.string().optional(),
});

export const ordersRouter = router({
  create: publicProcedure
    .input(z.object({
      items: z.array(CartItemInput).min(1).max(20),
      customer: CustomerInput,
    }))
    .mutation(async ({ input }) => {
      if (!ENV.xenditSecretKey) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Payment service not configured' });
      }

      // Server-side price calculation — never trust client totals
      const lineItems: { productId: string; name: string; quantity: number; unitPrice: number }[] = [];
      let totalAmount = 0;

      for (const item of input.items) {
        const product = PRODUCT_PRICES[item.productId];
        if (!product) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Produk tidak ditemukan: ${item.productId}`,
          });
        }
        lineItems.push({
          productId: item.productId,
          name: product.name,
          quantity: item.quantity,
          unitPrice: product.priceNum,
        });
        totalAmount += product.priceNum * item.quantity;
      }

      const externalId = `VOXA-${nanoid(12)}`;
      const successUrl = `${ENV.frontendUrl}/checkout/success?order=${externalId}`;
      const failureUrl = `${ENV.frontendUrl}/checkout/pending?order=${externalId}`;

      // Create Xendit invoice
      let xenditData: { id: string; invoice_url: string };
      try {
        const response = await axios.post(
          'https://api.xendit.co/v2/invoices',
          {
            external_id: externalId,
            amount: totalAmount,
            description: `Pesanan VOXA — ${lineItems.map(i => `${i.name} x${i.quantity}`).join(', ')}`,
            payer_email: input.customer.email,
            customer: {
              given_names: input.customer.name,
              email: input.customer.email,
              mobile_number: input.customer.phone,
            },
            customer_notification_preference: {
              invoice_created: ['email', 'whatsapp'],
              invoice_paid: ['email', 'whatsapp'],
            },
            success_redirect_url: successUrl,
            failure_redirect_url: failureUrl,
            currency: 'IDR',
            items: lineItems.map(i => ({
              name: i.name,
              quantity: i.quantity,
              price: i.unitPrice,
            })),
          },
          {
            auth: { username: ENV.xenditSecretKey, password: '' },
            timeout: 15_000,
          }
        );
        xenditData = response.data as { id: string; invoice_url: string };
      } catch (err: unknown) {
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ?? err.message
          : String(err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Gagal membuat invoice: ${message}`,
        });
      }

      // Persist order to DB
      const db = await getDb();
      if (db) {
        await db.insert(orders).values({
          xenditInvoiceId: xenditData.id,
          externalId,
          status: 'pending',
          totalAmount,
          customerName: input.customer.name,
          customerEmail: input.customer.email,
          customerPhone: input.customer.phone,
          customerAddress: input.customer.address ?? null,
          items: JSON.stringify(lineItems),
          invoiceUrl: xenditData.invoice_url,
        });
      }
      // If DB is down we still return the invoice URL so the customer can pay

      return {
        invoiceUrl: xenditData.invoice_url,
        externalId,
        totalAmount,
      };
    }),
});
