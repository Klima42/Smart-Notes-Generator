import React, { useState, useEffect } from 'react';
import { BookOpen, BrainCog, FileText, FlaskConical, Lightbulb, Loader2, Download, Save, Trash2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { generateSummary, generateFlashcards } from './lib/openai';
import { saveNote, getNotes, deleteNote } from './lib/storage';
import { exportToPDF } from './lib/export';
import { Note } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [title, setTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards'>('summary');

  useEffect(() => {
    // Load saved notes on component mount
    setSavedNotes(getNotes());
  }, []);

  const processText = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title for your notes');
      return;
    }

    if (!inputText.trim()) {
      toast.error('Please enter some text to process');
      return;
    }

    setIsProcessing(true);
    
    try {
      const [summary, flashcards] = await Promise.all([
        generateSummary(inputText),
        generateFlashcards(inputText)
      ]);

      const newNote: Note = {
        title: title.trim(),
        originalText: inputText,
        summary,
        flashcards,
        createdAt: new Date()
      };

      setCurrentNote(newNote);
      toast.success('Notes generated successfully!');
    } catch (error) {
      console.error('Error processing text:', error);
      toast.error('Failed to process text. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!currentNote) return;

    try {
      saveNote(currentNote);
      setSavedNotes(getNotes());
      toast.success('Notes saved successfully!');
    } catch (error) {
      toast.error('Failed to save notes');
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteNote(id);
      setSavedNotes(getNotes());
      toast.success('Notes deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete notes');
    }
  };

  const handleExport = () => {
    if (!currentNote) return;
    
    try {
      exportToPDF(currentNote);
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <BrainCog className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Smart Notes Generator</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold">Create New Notes</h2>
              </div>

              <input
                type="text"
                placeholder="Enter a title for your notes..."
                className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <textarea
                className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Paste your lecture notes, meeting minutes, or text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              
              <button
                className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                onClick={processText}
                disabled={!inputText.trim() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FlaskConical className="-ml-1 mr-2 h-5 w-5" />
                    Generate Smart Notes
                  </>
                )}
              </button>
            </div>

            {/* Saved Notes List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold">Saved Notes</h2>
              </div>

              <div className="space-y-2">
                {savedNotes.map((note) => (
                  <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">{note.title}</span>
                    <button
                      onClick={() => note.id && handleDelete(note.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-gray-500" />
                <h2 className="text-lg font-semibold">Generated Notes</h2>
              </div>
              
              {currentNote && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleExport}
                    className="flex items-center px-3 py-1 text-sm text-gray-700 hover:text-gray-900"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export PDF
                  </button>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`${
                    activeTab === 'summary'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                  onClick={() => setActiveTab('summary')}
                >
                  Summary
                </button>
                <button
                  className={`${
                    activeTab === 'flashcards'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium`}
                  onClick={() => setActiveTab('flashcards')}
                >
                  Flashcards
                </button>
              </nav>
            </div>

            {/* Content */}
            {!currentNote ? (
              <div className="text-center text-gray-500 py-12">
                <BookOpen className="mx-auto h-12 w-12 mb-4" />
                <p>Your generated notes will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeTab === 'summary' ? (
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">{currentNote.title}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{currentNote.summary}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentNote.flashcards.map((card, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium text-gray-900 mb-2">Q: {card.question}</h3>
                        <p className="text-gray-600">A: {card.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;