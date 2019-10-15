import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '@sunbird/environment';
@Component({
  selector: 'app-validate-teacher-identifier-popup',
  templateUrl: './validate-teacher-identifier-popup.component.html',
  styleUrls: ['./validate-teacher-identifier-popup.component.scss']
})
export class ValidateTeacherIdentifierPopupComponent implements OnInit {
  @ViewChild('createValidateModal') createValidateModal;
  isOffline = environment.isOffline;
  constructor() { }
  closeModal() {
    this.createValidateModal.deny();
  }
  ngOnInit() {
  }

}
