import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, IUserProfile, IUserData, WindowScrollService } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-user-education',
  templateUrl: './edit-user-education.component.html',
  styleUrls: ['./edit-user-education.component.css']
})
export class EditUserEducationComponent implements OnInit {
  @Input() education: any;
  educationForm: FormGroup;
  today = new Date();
  constructor(public resourceService: ResourceService, public userService: UserService, public windowScrollService: WindowScrollService) { }

  ngOnInit() {
    this.windowScrollService.smoothScroll('education');
    if (this.education) {
      const yearOfPassing = this.education.yearOfPassing ? new Date(this.education.yearOfPassing, 10, 10) : null;
      this.educationForm = new FormGroup({
        degree: new FormControl(this.education.degree, [Validators.required]),
        yearOfPassing: new FormControl(yearOfPassing),
        percentage: new FormControl(this.education.percentage),
        grade: new FormControl(this.education.grade),
        name: new FormControl(this.education.name, [Validators.required]),
        boardOrUniversity: new FormControl(this.education.boardOrUniversity)
      });
    } else {
      this.educationForm = new FormGroup({
        degree: new FormControl(null, [Validators.required]),
        yearOfPassing: new FormControl(null),
        percentage: new FormControl(null),
        grade: new FormControl(null),
        name: new FormControl(null, [Validators.required]),
        boardOrUniversity: new FormControl(null),
      });
    }
  }
}
