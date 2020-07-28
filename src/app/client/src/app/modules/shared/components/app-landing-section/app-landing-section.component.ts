import { Component, OnInit, Input } from '@angular/core';
import { LayoutService, COLUMN_TYPE } from '../../services/layoutconfig/layout.service';

@Component({
  selector: 'app-landing-section',
  templateUrl: './app-landing-section.component.html',
  styleUrls: ['./app-landing-section.component.scss']
})
export class AppLandingSectionComponent implements OnInit {

  @Input() textToDisplay;

  @Input() svgToDisplay;

  @Input() layoutConfiguration;

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
  }
  redoLayout(panelIndex) {
    if(this.layoutConfiguration) {
      return this.layoutService.redoLayoutCSS(panelIndex,this.layoutConfiguration,COLUMN_TYPE.threeToNine);
    } else {
      return this.layoutService.redoLayoutCSS(panelIndex,null,COLUMN_TYPE.fullLayout);
    }
  }

}
