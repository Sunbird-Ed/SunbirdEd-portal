import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, ViewChild, ElementRef, Output,  EventEmitter  } from '@angular/core';
import { UserService } from '@sunbird/core';
import { environment } from '@sunbird/environment';

@Component({
  selector: 'app-validate-teacher-identifier-popup',
  templateUrl: './validate-teacher-identifier-popup.component.html',
  styleUrls: ['./validate-teacher-identifier-popup.component.scss']
})
export class ValidateTeacherIdentifierPopupComponent implements OnInit {
  /* TODO:  code optimization yet to be done after API integration,
            msgs to be taken from api response
  */
  @Output() close = new EventEmitter<any>();
  @ViewChild('createValidateModal') createValidateModal;
  @ViewChild('extIdInputField') extIdInputField: ElementRef;
  externalId: string;
  processValidation = false;
  enableSubmitButton: boolean;
  count = 0;
  showError: boolean;
  extIdVerified: boolean;
  extIdFailed: boolean;
  navivateToResult =  false;
  instance: string;
  isOffline = environment.isOffline;
  userId: string;
  constructor(
    public userService: UserService,
    public resourceService: ResourceService) { }
  ngOnInit() {
    this.instance = 'Tamil Nadu';
    this.userId = this.userService.userid;
  }


  getIdLength(event: any) {
    if (event.target.value.length > 0) {
      this.showError = false;
      this.enableSubmitButton = true;
    } else {
      this.enableSubmitButton = false;
    }
  }

  closeModal() {
    this.createValidateModal.deny();
    this.close.emit();
  }

  navigateToValidateId() {
    this.processValidation = true;
  }

}
