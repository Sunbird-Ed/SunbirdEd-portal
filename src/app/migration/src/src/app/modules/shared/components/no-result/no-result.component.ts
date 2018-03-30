import { Component, OnInit, Input } from '@angular/core';
import {INoResultMessage} from '../../interfaces/noresult';
/**
 * No Result component
 */
@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.css']
})
export class NoResultComponent implements OnInit {
  /**
   * input for NoResultMessage
  */
  @Input() data: INoResultMessage;
  /**
   * no result message
  */
  message: string;
  /**
   * no result messageText for component
  */
  messageText: string;
  constructor() { }

  ngOnInit() {
    if (this.data) {
      this.message = this.data.message;
      this.messageText = this.data.messageText;
    }
  }
}
