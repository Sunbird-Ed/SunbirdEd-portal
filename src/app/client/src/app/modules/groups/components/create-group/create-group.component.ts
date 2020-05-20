import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  showGroupCreateForm;
  @Input() isGroupsPresent = false;
  @Output() groups = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  getFormData(event) {
  this.groups.emit(event);
  }
}
