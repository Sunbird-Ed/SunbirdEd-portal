import { Component, OnInit, Input } from '@angular/core';
import { ResourceService, IUserProfile, IUserData, } from '@sunbird/shared';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '@sunbird/core';
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
  selector: 'app-edit-user-education',
  templateUrl: './edit-user-education.component.html',
  styleUrls: ['./edit-user-education.component.css']
})
export class EditUserEducationComponent implements OnInit {
  @Input() education: any;
  educationForm: FormGroup;
  constructor(public resourceService: ResourceService, public userService: UserService,
    public profileService: ProfileService) { }

  ngOnInit() {
    this.profileService.smoothScroll('education');
    if (this.education) {
      this.educationForm = new FormGroup({
        degree: new FormControl(this.education.degree, [Validators.required]),
        yearOfPassing: new FormControl(this.education.yearOfPassing),
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
