import { Component, HostListener, AfterViewInit } from '@angular/core';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import mediumZoom from 'medium-zoom';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-offline-help-center',
  templateUrl: './offline-help-center.component.html',
  styleUrls: ['./offline-help-center.component.scss']
})

export class OfflineHelpCenterComponent implements AfterViewInit {
  images: any;
  constructor() { }
  isShow: boolean;
  topPosToStartShowing = 100;

  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  generatepdf() {
    const element = document.querySelector('#pdf-cover');
    const opt = {
      margin: 0,
      filename: 'help-center.pdf',
      image: { type: 'jpeg', quality: 1 },
      enableLinks: true,
      html2canvas: { scale: 1, dpi: 300, letterRendering: true },
      jspdf: { unit: 'px', format: 'a4', orientation: 'portrait', position: 0, pagesplit: true, compress: true }
    };
    html2pdf().from(element).set(opt).save();
  }

  ngAfterViewInit() {
    // mediumZoom('[data-zoomable]');
  }
}
