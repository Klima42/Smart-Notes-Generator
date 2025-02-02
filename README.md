# Smart Notes Generator

A modern web application that uses AI to generate summaries and flashcards from your text content. Built with React, TypeScript, and Hugging Face's AI models.

## Features

* **Text Summarization**: Generate concise summaries from long-form content
* **Flashcard Generation**: Automatically create study flashcards from your notes
* **PDF Export**: Export your summaries and flashcards to PDF format
* **Local Storage**: Save and manage your generated notes locally
* **Modern UI**: Clean, responsive interface with dark mode support

## Technologies Used

* React 18
* TypeScript
* Tailwind CSS
* Hugging Face Inference API
* Lucide React Icons
* jsPDF for PDF generation

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Hugging Face API key:
```bash
HUGGINGFACE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Enter a title for your notes
2. Paste or type your text content in the input area
3. Click "Generate Smart Notes"
4. View your generated summary and flashcards
5. Save your notes or export them to PDF
6. Access your saved notes anytime from the sidebar

## Project Structure

```
src/
├── lib/
│   ├── export.ts      # PDF export functionality
│   ├── openai.ts      # AI integration with Hugging Face
│   └── storage.ts     # Local storage management
├── types/
│   └── index.ts       # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

* Hugging Face for providing the AI models
* Lucide for the beautiful icons
* Tailwind CSS for the styling system
* jsPDF for PDF generation capabilities
