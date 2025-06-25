const puppeteer = require('puppeteer');

exports.downloadCertificate = async (req, res) => {
  let data = req.body.data;
  if (!data) {
    return res.status(400).json({ error: 'Missing SVG content' });
  }
  try {
    // 1. Generate PDF using puppeteer
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome', // or '/usr/bin/chromium-browser'
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    // 2. Load SVG content inside an HTML wrapper
    await page.setContent(`
    <html>
      <body style="margin:0;">
          ${data}
      </body>
    </html>
  `, { waitUntil: 'networkidle0' });
    // 3. Export PDF to buffer
    const pdfBuffer = await page.pdf({
      width: '1060px',
      height: '750px',
      printBackground: true
    });

    await browser.close();

    // 4. Send PDF as download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="output.pdf"',
      'Content-Length': pdfBuffer.length
    });

    return res.end(pdfBuffer);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Failed to convert SVG to PDF' });
  }
};