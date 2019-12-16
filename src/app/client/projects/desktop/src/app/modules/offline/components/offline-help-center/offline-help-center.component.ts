import { Router, ActivatedRoute } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, HostListener, AfterViewInit, OnInit } from '@angular/core';

import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import mediumZoom from 'medium-zoom';
import * as html2pdf from 'html2pdf.js';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-offline-help-center',
  templateUrl: './offline-help-center.component.html',
  styleUrls: ['./offline-help-center.component.scss']
})

export class OfflineHelpCenterComponent implements AfterViewInit, OnInit {
  images: any;
  activeTab: any;
  instance: string;

  constructor(public resourceService: ResourceService,
    public activatedRoute: ActivatedRoute,
    public router: Router) { }
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

  public generatepdf() {
    let elementId: any = '';
    switch (this.activeTab) {
      case 'browse':
        elementId = document.getElementById('browser-cover');
        break;

      case 'search':
        elementId = document.getElementById('search-cover');
        break;

      case 'download':
        elementId = document.getElementById('download-cover');
        break;

      case 'play':
        elementId = document.getElementById('play-cover');
        break;

      case 'upload':
        elementId = document.getElementById('upload-cover');
        break;

      default:
        break;
    }
    this.generatePdfFromData(elementId);
  }

  private generatePdfFromData(data: HTMLElement) {
    html2canvas(data).then(canvas => {
      const imgWidth = 208;
      const pageHeight = 350;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      let position = 8;
      // let margin = 16;
      pdf.addImage(
        contentDataURL,
        'PNG',
        8,
        position,
        imgWidth - 24,
        imgHeight - 24
      );
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          contentDataURL,
          'PNG',
          8,
          position,
          imgWidth - 24,
          imgHeight + 24
        );
        heightLeft -= pageHeight;
      }
      pdf.save(`helpcenter_${this.activeTab}.pdf`);
    });
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
    /* download animation */
    const downloadButton = document.querySelector('.sb-btn-download');
    if (downloadButton) {
      downloadButton.addEventListener('click', (event) => {
        event.preventDefault();

        /* Start loading process. */
        downloadButton.classList.add('loading');

        /* Set delay before switching from loading to success. */
        window.setTimeout(() => {
          downloadButton.classList.remove('loading');
          downloadButton.classList.add('success');
        }, 3000);

        /* Reset animation. */
        window.setTimeout(() => {
          downloadButton.classList.remove('success');
        }, 8000);
      });
    }
    /* download animation ends */
    this.activeTab = 'browse';
  }
  tabClicked(tab) {
    this.activeTab = tab;
    console.log(this.activeTab);
  }

  ngAfterViewInit() {
    // mediumZoom('[data-zoomable]');
  }
  setTelemetryImpression() {
    return {
      context: { env: _.get(this.activatedRoute.snapshot.data.telemetry, 'env') || 'help' },
      edata: {
        type: 'view',
        pageid: 'help',
        uri: this.router.url
      }
    };
  }
}
