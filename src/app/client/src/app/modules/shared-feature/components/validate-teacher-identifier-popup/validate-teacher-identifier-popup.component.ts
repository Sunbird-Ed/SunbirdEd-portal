import { Component, OnInit, ViewChild, ElementRef, Output,  EventEmitter  } from '@angular/core';
import { UserService } from '@sunbird/core';

@Component({
  selector: 'app-validate-teacher-identifier-popup',
  templateUrl: './validate-teacher-identifier-popup.component.html',
  styleUrls: ['./validate-teacher-identifier-popup.component.scss']
})
export class ValidateTeacherIdentifierPopupComponent implements OnInit {
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

  constructor(public userService: UserService) { }
  ngOnInit() {
  }

  verifyExtId() {
    const request = {

    };
    this.userService.validateExtId(request).subscribe(
      (response) => {
        this.extIdVerified = true;

      }, (error) => {
        this.count += 1;
        this.extIdInputField.nativeElement.value = '';
        this.extIdInputField.nativeElement.focus();
        this.enableSubmitButton = false;
        if (this.count === 2) {
          this.navivateToResult = true;
          this.failExtIdAndUpdateDb();
        } else {
          this.showError = true;
        }
      }
    );
  }

  rejectExtId() {
    const request = {

    };
    this.userService.rejectExtId(request).subscribe(
      (response) => {
        this.closeModal();


      }, (error) => {
        this.closeModal();
      }
    );
  }

  failExtIdAndUpdateDb() {
    const request = {

    };
    this.userService.failExtId(request).subscribe(
      (response) => {

      }, (error) => {
        this.extIdFailed = true;

      }
    );
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
