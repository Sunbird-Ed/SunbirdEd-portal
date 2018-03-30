import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import {ILoaderMessage} from '../../interfaces';

/**
 * loader component
 */
@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.css']
})
export class AppLoaderComponent implements OnInit {
  /**
   * loader message
  */
  @Input() data: ILoaderMessage;
  /**
   * header message
  */
  headerMessage = 'Please wait.';
  /**
   * loader message
  */
  loaderMessage = 'We are fetching details';

  constructor() { }

  ngOnInit() {
    if (this.data) {
      this.headerMessage = this.data.headerMessage || 'Please wait.';
      this.loaderMessage = this.data.loaderMessage || 'We are fetching details';
    }
  }
}
