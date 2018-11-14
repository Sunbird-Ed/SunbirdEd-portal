import { Component, OnInit, EventEmitter , Output } from '@angular/core';
@Component({
  selector: 'app-install-app',
  templateUrl: './install-app.component.html',
  styleUrls: ['./install-app.component.scss']
})
export class InstallAppComponent implements OnInit {
  showPopUp = true;
  @Output() viewInBrowser = new EventEmitter<any>();
  constructor( ) {
  }

  ngOnInit() {
  }
  closePopUp() {
    this.showPopUp = false;
  }
  navigateToLibrary() {
    this.closePopUp();
    this.viewInBrowser.emit();
  }
}
