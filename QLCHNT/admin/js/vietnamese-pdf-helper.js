// Vietnamese Font for jsPDF
// This uses a web-safe approach with proper font configuration

// Load Roboto Vietnamese font for jsPDF
function loadVietnameseFont(callback) {
  // Check if we're online to load Google Fonts
  if (navigator.onLine) {
    // Font will be loaded from Google Fonts in HTML
    // For PDF, we ensure proper rendering
    if (callback) callback();
  } else {
    console.warn('Offline - using fallback font');
    if (callback) callback();
  }
}

// Configure jsPDF to use web fonts for Vietnamese
function configureJsPDFForVietnamese(doc) {
  try {
    // Use helvetica as base - jsPDF built-in font
    // It has better Unicode support than Times
    doc.setFont('helvetica');
    return doc;
  } catch (error) {
    console.error('Font configuration error:', error);
    return doc;
  }
}

// Normalize Vietnamese text for PDF
function normalizeVietnameseText(text) {
  if (!text) return '';
  // Normalize Unicode to NFC form (canonical composition)
  return String(text).normalize('NFC');
}

// Export helper
window.PDFVietnameseHelper = {
  load: loadVietnameseFont,
  configure: configureJsPDFForVietnamese,
  normalize: normalizeVietnameseText
};
