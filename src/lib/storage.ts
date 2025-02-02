import { Note } from '../types';

const STORAGE_KEY = 'smart-notes';

export const saveNote = (note: Note): void => {
  try {
    const existingNotes = getNotes();
    const updatedNotes = [...existingNotes, { ...note, id: Date.now().toString() }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error saving note:', error);
    throw new Error('Failed to save note');
  }
};

export const getNotes = (): Note[] => {
  try {
    const notes = localStorage.getItem(STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error getting notes:', error);
    return [];
  }
};

export const deleteNote = (id: string): void => {
  try {
    const notes = getNotes();
    const updatedNotes = notes.filter(note => note.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
};