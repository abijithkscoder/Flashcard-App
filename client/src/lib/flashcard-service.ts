import { apiRequest } from "./queryClient";
import type { Flashcard, InsertFlashcard } from "@shared/schema";

export async function updateFlashcardBox(
  id: number,
  correct: boolean
): Promise<Flashcard> {
  const intervals = [1, 2, 5, 10, 30]; // Days for each box
  const flashcard = await apiRequest(
    "GET",
    `/api/flashcards/${id}`
  ).then(r => r.json());
  
  const newBox = correct 
    ? Math.min(5, flashcard.box + 1)
    : 1;
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervals[newBox - 1]);

  return apiRequest("PUT", `/api/flashcards/${id}`, {
    box: newBox,
    nextReview,
  }).then(r => r.json());
}

export async function createFlashcard(
  data: InsertFlashcard
): Promise<Flashcard> {
  return apiRequest("POST", "/api/flashcards", data).then(r => r.json());
}

export async function deleteFlashcard(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/flashcards/${id}`);
}
