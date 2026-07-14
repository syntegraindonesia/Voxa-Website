import type { Express, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { orders } from '../../drizzle/schema';
import { ENV } from './env';

interface XenditInvoicePayload {
  id: string;
  external_id: string;
  status: string; // 'PAID' | 'EXPIRED' | 'SETTLED'
}

export function registerXenditWebhook(app: Express) {
  // NOTE: global express.json() middleware in index.ts already parses req.body for us.
  app.post('/api/webhooks/xendit', async (req: Request, res: Response) => {
    // Verify Xendit callback token to reject forged webhooks
    const token = req.headers['x-callback-token'];
    if (!ENV.xenditWebhookToken || token !== ENV.xenditWebhookToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const payload = req.body as XenditInvoicePayload;
    if (!payload?.external_id || !payload?.status) {
      res.status(400).json({ error: 'Invalid payload' });
      return;
    }

    // Respond 200 immediately — Xendit retries if we're slow
    res.status(200).json({ received: true });

    // Process DB update asynchronously
    setImmediate(async () => {
      try {
        const db = await getDb();
        if (!db) return;

        const statusMap: Record<string, 'paid' | 'expired' | 'failed'> = {
          PAID: 'paid',
          SETTLED: 'paid',
          EXPIRED: 'expired',
        };
        const newStatus = statusMap[payload.status?.toUpperCase()];
        if (!newStatus) return;

        await db
          .update(orders)
          .set({
            status: newStatus,
            ...(newStatus === 'paid' ? { paidAt: new Date() } : {}),
          })
          .where(eq(orders.externalId, payload.external_id));
      } catch (err) {
        console.error('[xendit-webhook] error updating order:', err);
      }
    });
  });
}
