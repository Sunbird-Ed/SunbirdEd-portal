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
  @Input() section: ICaraouselData ;
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 4 };
}
