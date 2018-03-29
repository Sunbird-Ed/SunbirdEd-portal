import { Component, OnInit, Input } from '@angular/core';
import {NoResultMessage} from '../../interfaces/noresult';
/**
 * No Result component
 */
@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.css']
})
export class NoResultComponent {
  /**
   * input for errorMessage
  */
  @Input() data: NoResultMessage;
}
