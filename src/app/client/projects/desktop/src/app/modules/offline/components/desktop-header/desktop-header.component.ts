import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desktop-header',
  templateUrl: './desktop-header.component.html',
  styleUrls: [
    './desktop-header.component.scss',
    './desktop-header-menubar.component.scss',
    './desktop-header-search.component.scss'
  ]
})
export class DesktopHeaderComponent implements OnInit {
  selectOption: any;
  selectMedium: { name: string; id: string; value: string; };
  isShown = true;
  constructor() { }

  ngOnInit() {

    //   this.selectMedium = this.selectOption[0];
    //   this.selectOption = [
    //     {
    //       name: 'English',
    //       value: '0'
    //     }, {
    //       name: 'বাংলা',
    //       value: '1'
    //     }, {
    //       name: 'اردو',
    //       value: '2'
    //     }, {
    //       name: 'मराठी',
    //       value: '3'
    //     }
    //     , {
    //       name: 'ಕನ್ನಡ',
    //       value: '4'
    //     }
    //     , {
    //       name: 'తెలుగు',
    //       value: '5'
    //     }
    //     , {
    //       name: 'हिंदी',
    //       value: '6'
    //     }
    //     , {
    //       name: 'தமிழ்',
    //       value: '7'
    //     }
    //   ];

  }

}
