import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateFlashcard } from "@/components/create-flashcard";
import { StudyMode } from "@/components/study-mode";

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Leitner System Flashcards
      </h1>

      <Tabs defaultValue="study" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>
        <TabsContent value="study">
          <StudyMode />
        </TabsContent>
        <TabsContent value="create">
          <CreateFlashcard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
