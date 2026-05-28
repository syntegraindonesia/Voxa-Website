import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { articlesTable } from "../../drizzle/schema";
import { invokeLLM } from "../_core/llm";
import { generateImage } from "../_core/imageGeneration";
// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 200);
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Article Router ────────────────────────────────────────────────────────────

export const articlesRouter = router({
  // Generate a new article draft using AI (admin only)
  generate: protectedProcedure
    .input(
      z.object({
        topic: z.string().min(3).max(300),
        category: z.string().default("Berita VOXA"),
        articleType: z
          .enum(["educational", "trend", "soft-sell", "hard-sell"])
          .default("educational"),
        keywords: z.string().optional(), // comma-separated extra keywords
        count: z.number().min(1).max(3).default(1), // generate 1-3 drafts
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const typeDescriptions: Record<string, string> = {
        educational: "artikel edukatif yang menjelaskan konsep, tips, atau panduan praktis",
        trend: "artikel tren yang membahas perkembangan terbaru industri kendaraan listrik",
        "soft-sell": "artikel soft sell yang secara halus mempromosikan produk VOXA dalam konteks informatif",
        "hard-sell": "artikel hard sell yang secara langsung mempromosikan produk VOXA dengan ajakan beli yang kuat",
      };

      const extraKeywords = input.keywords
        ? `, ${input.keywords}`
        : "";

      const systemPrompt = `Kamu adalah penulis konten SEO profesional untuk VOXA, merek sepeda listrik asli Indonesia. 
Tulis artikel dalam Bahasa Indonesia yang berkualitas tinggi, informatif, dan SEO-friendly.
Setiap artikel HARUS menyertakan kata kunci 'voxa' dan kata kunci relevan lainnya secara alami.
Format output HARUS berupa JSON yang valid dengan struktur berikut:
{
  "title": "judul artikel yang menarik dan SEO-friendly",
  "excerpt": "ringkasan 2-3 kalimat yang menarik pembaca",
  "content": "konten artikel lengkap dalam format Markdown (gunakan ## untuk heading, **bold**, *italic*, bullet points dengan -)",
  "seoKeywords": "kata kunci 1, kata kunci 2, kata kunci 3, voxa",
  "tags": ["tag1", "tag2", "tag3"]
}`;

      const userPrompt = `Tulis ${typeDescriptions[input.articleType]} tentang topik: "${input.topic}"
Kategori: ${input.category}
Kata kunci utama: voxa, sepeda listrik, kendaraan listrik Indonesia${extraKeywords}
Panjang artikel: minimal 600 kata, maksimal 1200 kata.
Pastikan artikel relevan dengan produk VOXA dan pasar Indonesia.`;

      const drafts = [];

      for (let i = 0; i < input.count; i++) {
        const variation = i === 0 ? "" : i === 1 ? " (variasi sudut pandang berbeda)" : " (variasi gaya penulisan berbeda)";
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt + variation },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "article_draft",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  excerpt: { type: "string" },
                  content: { type: "string" },
                  seoKeywords: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                },
                required: ["title", "excerpt", "content", "seoKeywords", "tags"],
                additionalProperties: false,
              },
            },
          },
        });

        const raw = (response.choices[0]?.message?.content as string) ?? "{}";
        let parsed: { title: string; excerpt: string; content: string; seoKeywords: string; tags: string[] };
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI returned invalid JSON" });
        }

        const baseSlug = slugify(parsed.title);
        const slug = `${baseSlug}-${Date.now()}-${i}`;

        // Save as draft to DB
        await db.insert(articlesTable).values({
          slug,
          title: parsed.title,
          excerpt: parsed.excerpt,
          content: parsed.content,
          category: input.category,
          seoKeywords: parsed.seoKeywords,
          tags: JSON.stringify(parsed.tags),
          readTime: estimateReadTime(parsed.content),
          status: "draft",
          featured: "no",
          author: "Tim Redaksi VOXA",
        });

        const [saved] = await db
          .select()
          .from(articlesTable)
          .where(eq(articlesTable.slug, slug))
          .limit(1);

        drafts.push(saved);
      }

      return { drafts };
    }),

  // List all articles (admin: all, public: published only)
  list: publicProcedure
    .input(
      z.object({
        status: z.enum(["draft", "published", "all"]).default("published"),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { articles: [], total: 0 };

      const isAdmin = (ctx as any)?.user?.role === "admin";

      let rows;
      if (input.status === "all" && isAdmin) {
        rows = await db
          .select()
          .from(articlesTable)
          .orderBy(desc(articlesTable.createdAt))
          .limit(input.limit)
          .offset(input.offset);
      } else {
        const statusFilter = input.status === "all" ? "published" : input.status;
        rows = await db
          .select()
          .from(articlesTable)
          .where(eq(articlesTable.status, statusFilter as "draft" | "published"))
          .orderBy(desc(articlesTable.publishedAt))
          .limit(input.limit)
          .offset(input.offset);
      }

      return {
        articles: rows.map((r) => ({
          ...r,
          tags: r.tags ? JSON.parse(r.tags) : [],
        })),
      };
    }),

  // Get single article by slug (public: published only; admin: any status)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const isAdmin = (ctx as any)?.user?.role === "admin";

      const [row] = await db
        .select()
        .from(articlesTable)
        .where(
          isAdmin
            ? eq(articlesTable.slug, input.slug)
            : and(eq(articlesTable.slug, input.slug), eq(articlesTable.status, "published"))
        )
        .limit(1);

      if (!row) return null;
      return { ...row, tags: row.tags ? JSON.parse(row.tags) : [] };
    }),

  // Update article (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        seoKeywords: z.string().optional(),
        tags: z.array(z.string()).optional(),
        featured: z.enum(["yes", "no"]).optional(),
        imageUrl: z.string().optional(),
        author: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { id, tags, ...rest } = input;
      const updateData: Record<string, unknown> = { ...rest };
      if (tags !== undefined) updateData.tags = JSON.stringify(tags);
      if (rest.title) {
        updateData.slug = `${slugify(rest.title)}-${id}`;
        updateData.readTime = rest.content ? estimateReadTime(rest.content) : undefined;
      }

      await db.update(articlesTable).set(updateData).where(eq(articlesTable.id, id));
      const [updated] = await db.select().from(articlesTable).where(eq(articlesTable.id, id)).limit(1);
      return { ...updated, tags: updated.tags ? JSON.parse(updated.tags) : [] };
    }),

  // Publish a draft article (admin only)
  publish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(articlesTable)
        .set({ status: "published", publishedAt: new Date() })
        .where(eq(articlesTable.id, input.id));

      const [row] = await db.select().from(articlesTable).where(eq(articlesTable.id, input.id)).limit(1);
      return { ...row, tags: row.tags ? JSON.parse(row.tags) : [] };
    }),

  // Unpublish (revert to draft) (admin only)
  unpublish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(articlesTable)
        .set({ status: "draft", publishedAt: null })
        .where(eq(articlesTable.id, input.id));

      return { success: true };
    }),

  // Delete article (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.delete(articlesTable).where(eq(articlesTable.id, input.id));
      return { success: true };
    }),

  // Suggest article topics (admin only)
  suggestTopics: protectedProcedure
    .input(
      z.object({
        category: z.string().default("Berita VOXA"),
        articleType: z.enum(["educational", "trend", "soft-sell", "hard-sell"]).default("educational"),
        count: z.number().min(3).max(10).default(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const typeLabel: Record<string, string> = {
        educational: "edukatif",
        trend: "tren industri",
        "soft-sell": "soft sell",
        "hard-sell": "hard sell promosi",
      };

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah editor konten ahli untuk brand sepeda listrik VOXA di Indonesia. " +
              "Tugasmu adalah menyarankan topik artikel yang relevan, menarik, dan SEO-friendly.",
          },
          {
            role: "user",
            content:
              `Sarankan ${input.count} topik artikel ${typeLabel[input.articleType]} untuk kategori "${input.category}" ` +
              `tentang sepeda listrik VOXA dan industri kendaraan listrik Indonesia. \n` +
              `Setiap topik harus berupa kalimat atau frasa lengkap yang spesifik dan menarik. ` +
              `Sertakan kata 'VOXA' atau konteks kendaraan listrik Indonesia di beberapa topik. \n` +
              `Kembalikan HANYA array JSON berisi string topik, tanpa penjelasan tambahan. \n` +
              `Contoh format: ["Topik 1", "Topik 2", "Topik 3"]`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "topic_suggestions",
            strict: true,
            schema: {
              type: "object",
              properties: {
                topics: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of suggested article topics",
                },
              },
              required: ["topics"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(typeof content === "string" ? content : JSON.stringify(content));
      return { topics: (parsed.topics ?? []) as string[] };
    }),

  // Suggest SEO keywords (admin only)
  suggestKeywords: protectedProcedure
    .input(
      z.object({
        topic: z.string().min(3).max(300),
        category: z.string().default("Berita VOXA"),
        count: z.number().min(5).max(20).default(12),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah pakar SEO untuk brand sepeda listrik VOXA di Indonesia. " +
              "Tugasmu adalah menyarankan kata kunci SEO yang relevan dan memiliki volume pencarian tinggi.",
          },
          {
            role: "user",
            content:
              `Sarankan ${input.count} kata kunci SEO untuk artikel dengan topik: "${input.topic}" ` +
              `dalam kategori "${input.category}". \n` +
              `Kata kunci harus: singkat (1-3 kata), relevan dengan topik, ` +
              `mencakup variasi long-tail dan short-tail, dan cocok untuk pasar Indonesia. ` +
              `Selalu sertakan 'voxa' sebagai salah satu kata kunci. \n` +
              `Kembalikan HANYA array JSON berisi string kata kunci, tanpa penjelasan. \n` +
              `Contoh: ["voxa", "sepeda listrik", "kendaraan listrik indonesia"]`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "keyword_suggestions",
            strict: true,
            schema: {
              type: "object",
              properties: {
                keywords: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of suggested SEO keywords",
                },
              },
              required: ["keywords"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(typeof content === "string" ? content : JSON.stringify(content));
      return { keywords: (parsed.keywords ?? []) as string[] };
    }),

  // Generate a hero image for an article using its content (admin only)
  generateHeroImage: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Fetch the article
      const [article] = await db
        .select()
        .from(articlesTable)
        .where(eq(articlesTable.id, input.id))
        .limit(1);

      if (!article) throw new TRPCError({ code: "NOT_FOUND", message: "Artikel tidak ditemukan" });

      // Ask LLM to craft an image prompt from the article context
      const promptResponse = await invokeLLM({
        messages: [
          {
            role: "system",
            content:
              "Kamu adalah direktur seni untuk brand sepeda listrik VOXA Indonesia. " +
              "Tugasmu adalah membuat prompt gambar yang vivid dan spesifik untuk hero image artikel.",
          },
          {
            role: "user",
            content:
              `Buatkan satu prompt bahasa Inggris untuk menghasilkan hero image artikel berikut:\n` +
              `Judul: ${article.title}\n` +
              `Kategori: ${article.category}\n` +
              `Ringkasan: ${article.excerpt}\n` +
              `Konten (ringkasan): ${article.content.slice(0, 600)}\n\n` +
              `Syarat prompt:\n` +
              `- Bahasa Inggris, deskriptif dan vivid\n` +
              `- Menampilkan sepeda listrik modern atau suasana urban Indonesia\n` +
              `- Gaya fotografi profesional, pencahayaan natural, resolusi tinggi\n` +
              `- Cocok sebagai hero image artikel blog (landscape 16:9)\n` +
              `- JANGAN sertakan teks atau tulisan dalam gambar\n` +
              `Kembalikan HANYA string prompt, tanpa penjelasan.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "image_prompt",
            strict: true,
            schema: {
              type: "object",
              properties: {
                prompt: { type: "string", description: "The image generation prompt" },
              },
              required: ["prompt"],
              additionalProperties: false,
            },
          },
        },
      });

      const promptContent = promptResponse.choices[0]?.message?.content ?? "{}";
      const { prompt } = JSON.parse(typeof promptContent === "string" ? promptContent : JSON.stringify(promptContent));

      // Generate the image
      const { url: imageUrl } = await generateImage({ prompt });

      if (!imageUrl) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Gagal menghasilkan gambar" });

      // Save imageUrl back to the article
      await db.update(articlesTable).set({ imageUrl }).where(eq(articlesTable.id, input.id));

      return { imageUrl, prompt };
    }),
});
