import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './app-loader.component.html',
  styleUrls: ['./app-loader.component.css']
})
export class AppLoaderComponent implements OnInit {
  @Input() data: any;

  headerMessage: string;
  loaderMessage: string;

  constructor() { }

  ngOnInit() {

    this.headerMessage = this.data && this.data.headerMessage
    ? this.data.headerMessage : 'Please wait.';

    this.loaderMessage = this.data && this.data.loaderMessage
      ? this.data.loaderMessage : 'We are fetching details';
  }

}
