import { jsPDF } from 'jspdf';
import { Note } from '../types';

export const exportToPDF = (note: Note): void => {
  const doc = new jsPDF();
  let yPosition = 20;

  // Add title
  doc.setFontSize(20);
  doc.text('Smart Notes Summary', 20, yPosition);
  yPosition += 20;

  // Add summary
  doc.setFontSize(12);
  doc.text('Summary:', 20, yPosition);
  yPosition += 10;

  // Split summary into lines that fit the page width
  const summaryLines = doc.splitTextToSize(note.summary, 170);
  doc.text(summaryLines, 20, yPosition);
  yPosition += (summaryLines.length * 7) + 20;

  // Add flashcards
  doc.text('Flashcards:', 20, yPosition);
  yPosition += 10;

  note.flashcards.forEach((card, index) => {
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont(undefined, 'bold');
    doc.text(`Q${index + 1}: ${card.question}`, 20, yPosition);
    yPosition += 7;
    
    doc.setFont(undefined, 'normal');
    const answerLines = doc.splitTextToSize(`A: ${card.answer}`, 170);
    doc.text(answerLines, 20, yPosition);
    yPosition += (answerLines.length * 7) + 10;
  });

  // Save the PDF
  doc.save('smart-notes.pdf');
};