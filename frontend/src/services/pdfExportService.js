import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Captures an HTML element and exports it as a PDF document.
 * @param {string} elementId - The ID of the HTML element to render.
 * @param {string} filename - Output filename (default: RAKSHA-AI_Emergency_Dispatch_Plan.pdf).
 */
export async function exportElementToPDF(elementId, filename = 'RAKSHA-AI_Emergency_Dispatch_Plan.pdf') {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export.`);
    alert(`Could not locate element #${elementId} to export PDF.`);
    return false;
  }

  try {
    // Render element to canvas with high scale
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#090d16',
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 280; // A4 landscape width mm with margins
    const pageHeight = 195;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.setFillColor(9, 13, 22);
    pdf.rect(0, 0, 297, 210, 'F'); // Dark background color fill

    // Header Title in PDF
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.text('RAKSHA-AI Emergency Rescue Dispatch & Hazard Plan', 10, 12);
    pdf.setFontSize(9);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Generated: ${new Date().toLocaleString()} • SIH PS 26001 MDoNER Baseline`, 10, 17);

    pdf.addImage(imgData, 'PNG', 10, 22, imgWidth, Math.min(imgHeight, pageHeight - 25));

    pdf.save(filename);
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    alert('Failed to generate PDF document: ' + error.message);
    return false;
  }
}
