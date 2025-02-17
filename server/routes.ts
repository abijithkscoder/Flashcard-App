import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFlashcardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  app.get("/api/flashcards", async (req, res) => {
    const flashcards = await storage.getFlashcards();
    res.json(flashcards);
  });

  app.post("/api/flashcards", async (req, res) => {
    const result = insertFlashcardSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    const flashcard = await storage.createFlashcard(result.data);
    res.status(201).json(flashcard);
  });

  app.put("/api/flashcards/:id", async (req, res) => {
    const schema = z.object({
      box: z.number().min(1).max(5),
      nextReview: z.coerce.date(),
    });
    
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    try {
      const flashcard = await storage.updateFlashcard(
        parseInt(req.params.id),
        result.data.box,
        result.data.nextReview
      );
      res.json(flashcard);
    } catch (error) {
      res.status(404).json({ error: "Flashcard not found" });
    }
  });

  app.delete("/api/flashcards/:id", async (req, res) => {
    try {
      await storage.deleteFlashcard(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: "Flashcard not found" });
    }
  });

  return createServer(app);
}
