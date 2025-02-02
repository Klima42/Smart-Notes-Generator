export interface Flashcard {
  question: string;
  answer: string;
}

export interface Note {
  id?: string;
  title: string;
  originalText: string;
  summary: string;
  flashcards: Flashcard[];
  createdAt?: Date;
}