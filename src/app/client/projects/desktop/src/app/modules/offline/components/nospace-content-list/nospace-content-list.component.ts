import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-nospace-content-list',
  templateUrl: './nospace-content-list.component.html',
  styleUrls: ['./nospace-content-list.component.scss']
})
export class NospaceContentListComponent implements OnInit {
@Input() contentlistToShow;
@ViewChild('modal') modal;
@Output() dismissed = new EventEmitter<any>();

  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }
closeModal() {
  this.modal.deny();
  this.dismissed.emit();
}
}
