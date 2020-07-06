import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, Output, EventEmitter, Input, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-ftu-popup',
  templateUrl: './ftu-popup.component.html',
  styleUrls: ['./ftu-popup.component.scss']
})
export class FtuPopupComponent implements OnInit, AfterViewInit {
  @Input() showWelcomePopup;
  @Output() close = new EventEmitter();

  @Input()showMemberPopup;
  constructor(public resourceService: ResourceService, private elementRef: ElementRef) { }
  slideConfig1 = {};
  instance;

  ngOnInit() {
    this.instance = this.resourceService.instance;
    this.slideConfig1 = {
      // "lazyLoad": 'progressive',
      "slidesToShow": 1,
      "infinite": false,
      "rtl": false,
      "dots": true,
      "adaptiveHeight": true
      //"fade": true,
      //"cssEase": 'linear',
      // "autoplay": true,
      // "autoplaySpeed": 2000
    };
  }
  ngAfterViewInit(){
 
  }

  closeModal() {
    this.showWelcomePopup = false;
    this.close.emit(true);
  }

  closeMemberPopup() {
    this.showMemberPopup = false;
    this.close.emit(true);
  }

}
