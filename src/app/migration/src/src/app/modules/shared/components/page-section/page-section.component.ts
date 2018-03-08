import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.css']
})
export class PageSectionComponent implements OnInit {

  @Input() pageSection;
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };
  constructor() { }

  ngOnInit() {
  }

}
