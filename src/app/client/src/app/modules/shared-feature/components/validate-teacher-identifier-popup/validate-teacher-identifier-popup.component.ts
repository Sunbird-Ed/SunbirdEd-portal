import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-validate-teacher-identifier-popup',
  templateUrl: './validate-teacher-identifier-popup.component.html',
  styleUrls: ['./validate-teacher-identifier-popup.component.scss']
})
export class ValidateTeacherIdentifierPopupComponent implements OnInit {
  @ViewChild('createValidateModal') createValidateModal;

  constructor() { }
  closeModal() {
    this.createValidateModal.deny();
  }
  ngOnInit() {
  }

}
