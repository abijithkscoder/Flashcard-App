import { useQuery, useMutation } from "@tanstack/react-query";
import { FlashcardView } from "./flashcard";
import { updateFlashcardBox } from "@/lib/flashcard-service";
import { queryClient } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export function StudyMode() {
  const { toast } = useToast();
  const { data: flashcards, isLoading } = useQuery({
    queryKey: ["/api/flashcards"],
  });

  const mutation = useMutation({
    mutationFn: ({ id, correct }: { id: number; correct: boolean }) =>
      updateFlashcardBox(id, correct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update flashcard",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!flashcards?.length) {
    return (
      <Card className="p-6 text-center">
        <p>No flashcards available. Create some to start studying!</p>
      </Card>
    );
  }

  const currentCard = flashcards[0];
  const boxCounts = flashcards.reduce((acc, card) => {
    acc[card.box - 1]++;
    return acc;
  }, Array(5).fill(0));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-2">
        {boxCounts.map((count, i) => (
          <div key={i} className="text-center">
            <div className="text-sm text-muted-foreground">Box {i + 1}</div>
            <div className="font-bold">{count}</div>
          </div>
        ))}
      </div>
      
      <Progress
        value={(boxCounts[4] / flashcards.length) * 100}
        className="w-full"
      />

      <FlashcardView
        card={currentCard}
        onResponse={(correct) =>
          mutation.mutate({ id: currentCard.id, correct })
        }
      />
    </div>
  );
}
