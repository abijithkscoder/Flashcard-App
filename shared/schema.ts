import { pgTable, text, serial, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  box: integer("box").notNull().default(1),
  nextReview: date("next_review").notNull().default(new Date()),
});

export const insertFlashcardSchema = createInsertSchema(flashcards)
  .pick({
    question: true,
    answer: true,
  })
  .extend({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
  });

export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcards.$inferSelect;
