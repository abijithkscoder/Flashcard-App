import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFlashcardSchema, type InsertFlashcard } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { createFlashcard } from "@/lib/flashcard-service";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export function CreateFlashcard() {
  const { toast } = useToast();
  const form = useForm<InsertFlashcard>({
    resolver: zodResolver(insertFlashcardSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createFlashcard,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Flashcard created successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/flashcards"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create flashcard",
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4 max-w-xl mx-auto p-4"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter your question" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter the answer" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          Create Flashcard
        </Button>
      </form>
    </Form>
  );
}
