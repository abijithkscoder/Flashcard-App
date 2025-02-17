import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { Flashcard } from "@shared/schema";

interface FlashcardProps {
  card: Flashcard;
  onResponse: (correct: boolean) => void;
}

export function FlashcardView({ card, onResponse }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full max-w 2xl mx-auto p-4">
      <motion.div
        className="relative w-full aspect-[3/2] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={isFlipped ? "back" : "front"}
            initial={{ rotateY: isFlipped ? -90 : 90 }}
            animate={{ rotateY: 0 }}
            exit={{ rotateY: isFlipped ? 90 : -90 }}
            transition={{ duration: 0.3 }}
            className="absolute w-full h-full"
          >
            <Card className="w-full h-full flex items-center justify-center p-6">
              <CardContent className="text-center">
                <p className="text-2xl font-semibold">
                  {isFlipped ? card.answer : card.question}
                </p>
                <p className="text-sm text-muted-foreground mt-4">
                  {isFlipped ? "Click to see question" : "Click to see answer"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="destructive"
          onClick={() => onResponse(false)}
          disabled={!isFlipped}
        >
          Incorrect
        </Button>
        <Button
          variant="default"
          onClick={() => onResponse(true)}
          disabled={!isFlipped}
        >
          Correct
        </Button>
      </div>
    </div>
  );
}
