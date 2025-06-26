const { Resvg } = require('@resvg/resvg-js');
const PDFDocument = require('pdfkit');

exports.downloadCertificate = async(req, res) => {
  let svgContent = req.body.data;
  if (!svgContent) {
    return res.status(400).send('Missing SVG content in data field');
  }


  try {
    // 1. Render SVG to PNG using @resvg/resvg-js
    const resvg = new Resvg(svgContent, {
      fitTo: { mode: 'width', value: 1060 },
      background: 'transparent',
      font: { loadSystemFonts: true },
      fitTo: { mode: 'height', value: 750 }
    });
    const pngBuffer = resvg.render().asPng();

    // 2. Create PDF and embed PNG using pdfkit
    // Open image to get its dimensions
    const image = PDFDocument.prototype.openImage.call(PDFDocument, pngBuffer);
    const imgWidth = image.width;
    const imgHeight = image.height;
    const doc = new PDFDocument({ autoFirstPage: false });
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="output.pdf"'
    });
    doc.pipe(res);

    // Add a page sized to the image
    doc.addPage({ size: [imgWidth, imgHeight], margin: 0 });
    doc.image(pngBuffer, 0, 0, { width: imgWidth, height: imgHeight });
    doc.end();

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to convert SVG to PDF' });
  }
};