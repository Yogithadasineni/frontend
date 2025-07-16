import RNHTMLtoPDF from 'react-native-html-to-pdf';

export async function generatePdf(data) {
  try {
    const options = {
      html: `<h1>Scanned Data</h1><p>${data}</p>`,
      fileName: `scanned_data_${Date.now()}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    console.log('PDF saved at:', file.filePath);
    return file.filePath;
  } catch (err) {
    console.error('PDF generation error:', err);
  }
}
