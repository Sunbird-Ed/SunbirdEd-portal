import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-update-content-preference',
  templateUrl: './update-content-preference.component.html',
  styleUrls: ['./update-content-preference.component.scss']
})
export class UpdateContentPreferenceComponent implements OnInit {

  @Output() dismissed = new EventEmitter<any>();
  constructor(
    public resourceService: ResourceService,
  ) { }
  ngOnInit() {
  }
  closeModal() {
    this.dismissed.emit();
  }
}
