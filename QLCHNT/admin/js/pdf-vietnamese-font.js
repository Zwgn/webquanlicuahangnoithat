// Vietnamese Font Support for PDF Export
// Add Roboto font from Google Fonts to jsPDF

function addRobotoFont(doc) {
  // Roboto font will be loaded from Google Fonts in HTML
  // For PDF, we use a fallback to ensure Vietnamese characters work
  doc.addFont('https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2', 'Roboto', 'normal');
  doc.setFont('Roboto');
  return doc;
}

// Helper to prepare text for PDF with proper encoding
function prepareVietnameseText(text) {
  if (!text) return '';
  // Ensure proper Unicode normalization for Vietnamese
  return String(text).normalize('NFC');
}
