import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-summary-modal',
  templateUrl: './add-summary-modal.component.html',
  styleUrls: ['./add-summary-modal.component.scss']
})
export class AddSummaryModalComponent implements OnInit {

  private closeModalEvent = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeModal(){
    this.closeModalEvent.emit(true);
  }

}
