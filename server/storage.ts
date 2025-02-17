import { flashcards, Flashcard, InsertFlashcard } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getFlashcards(): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: number, box: number, nextReview: Date): Promise<Flashcard>;
  deleteFlashcard(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getFlashcards(): Promise<Flashcard[]> {
    return await db.select().from(flashcards);
  }

  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const [flashcard] = await db
      .insert(flashcards)
      .values({
        ...insertFlashcard,
        box: 1,
        nextReview: new Date(),
      })
      .returning();
    return flashcard;
  }

  async updateFlashcard(
    id: number,
    box: number,
    nextReview: Date
  ): Promise<Flashcard> {
    const [flashcard] = await db
      .update(flashcards)
      .set({ box, nextReview })
      .where(eq(flashcards.id, id))
      .returning();

    if (!flashcard) {
      throw new Error("Flashcard not found");
    }

    return flashcard;
  }

  async deleteFlashcard(id: number): Promise<void> {
    const [flashcard] = await db
      .delete(flashcards)
      .where(eq(flashcards.id, id))
      .returning();

    if (!flashcard) {
      throw new Error("Flashcard not found");
    }
  }
}

export const storage = new DatabaseStorage();