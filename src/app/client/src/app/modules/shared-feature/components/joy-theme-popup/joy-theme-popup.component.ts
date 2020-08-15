import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-joy-theme-popup',
  templateUrl: './joy-theme-popup.component.html',
  styleUrls: ['./joy-theme-popup.component.scss']
})
export class JoyThemePopupComponent implements OnInit {

  isShown = true;
  @Output() closeJoyThemePopup = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  closePopup() {
    localStorage.setItem('joyThemePopup', 'true');
    this.isShown = false;
    this.closeJoyThemePopup.emit();
  }

}
