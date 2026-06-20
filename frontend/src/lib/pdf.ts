import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportHtmlToPdf(containerId: string, filename: string = 'trip-itinerary.pdf') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Element with id ${containerId} not found.`);
    return;
  }

  const pages = container.querySelectorAll('.pdf-page');
  if (pages.length === 0) {
    console.error('No .pdf-page elements found inside the container.');
    return;
  }

  // Create A4 PDF: Portrait, millimeters, A4 size
  const pdf = new jsPDF('p', 'mm', 'a4');

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i] as HTMLElement;
    
    // Convert page element to canvas at high resolution (scale: 2)
    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // Scale A4 dimensions: 210 x 297 mm
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  }

  pdf.save(filename);
}
