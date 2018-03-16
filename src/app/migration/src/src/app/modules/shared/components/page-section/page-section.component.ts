import { Component,  Input } from '@angular/core';
import {ICaraouselData} from '../../interfaces/caraouselData';
/**
 * This display a a section
 */
@Component({
  selector: 'app-page-section',
  templateUrl: './page-section.component.html',
  styleUrls: ['./page-section.component.css']
})
export class PageSectionComponent  {
  /**
  * section is used to render ICaraouselData value on the view
  */
  @Input() section: ICaraouselData ;
  /**
  * This is slider setting
  */
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };
}
