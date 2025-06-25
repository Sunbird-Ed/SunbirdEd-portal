// src/app/client/src/app/helpers/certificate-download.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CertificateDownloadService {
  /**
   * Triggers a browser download for a Blob or file data.
   * @param fileData The file data to download (Blob or ArrayBuffer).
   * @param fileName The name for the downloaded file.
   * @param mimeType The MIME type of the file (default: 'application/pdf').
   */
  triggerBrowserDownload(fileData: Blob | ArrayBuffer, fileName: string = 'certificate.pdf', mimeType: string = 'application/pdf') {
    let blob: Blob;
    if (fileData instanceof Blob) {
      blob = fileData;
    } else {
      blob = new Blob([fileData], { type: mimeType });
    }
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
