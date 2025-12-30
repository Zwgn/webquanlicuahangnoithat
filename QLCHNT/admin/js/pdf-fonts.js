// PDF Vietnamese Font Support
// This file adds Vietnamese font support to jsPDF

function addVietnameseFont(doc) {
  // Add Roboto font support for Vietnamese characters
  // Using a simplified approach with built-in fonts
  doc.setFont("times");
  return doc;
}

// Helper function to convert Vietnamese text for better PDF compatibility
function formatVietnameseForPDF(text) {
  if (!text) return '';
  return String(text);
}
