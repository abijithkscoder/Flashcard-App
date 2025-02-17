import { Flashcard, InsertFlashcard } from "@shared/schema";

export interface IStorage {
  getFlashcards(): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: number, box: number, nextReview: Date): Promise<Flashcard>;
  deleteFlashcard(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private flashcards: Map<number, Flashcard>;
  private currentId: number;

  constructor() {
    this.flashcards = new Map();
    this.currentId = 1;
  }

  async getFlashcards(): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values());
  }

  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const id = this.currentId++;
    const flashcard: Flashcard = {
      ...insertFlashcard,
      id,
      box: 1,
      nextReview: new Date(),
    };
    this.flashcards.set(id, flashcard);
    return flashcard;
  }

  async updateFlashcard(
    id: number,
    box: number,
    nextReview: Date
  ): Promise<Flashcard> {
    const flashcard = this.flashcards.get(id);
    if (!flashcard) {
      throw new Error("Flashcard not found");
    }
    const updatedFlashcard = { ...flashcard, box, nextReview };
    this.flashcards.set(id, updatedFlashcard);
    return updatedFlashcard;
  }

  async deleteFlashcard(id: number): Promise<void> {
    if (!this.flashcards.delete(id)) {
      throw new Error("Flashcard not found");
    }
  }
}

export const storage = new MemStorage();
