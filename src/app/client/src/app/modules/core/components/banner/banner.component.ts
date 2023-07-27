import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-banner',
  inputs: ['config'],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Input() config: object; // decorate the property with @Input()

  constructor() { }

  ngOnInit(): void {
  }

}
