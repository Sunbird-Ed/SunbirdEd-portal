import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UserService, PermissionService } from '@sunbird/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  ResourceService, ConfigService, IUserProfile, IUserData,
  ToasterService, WindowScrollService
} from '@sunbird/shared';
import { ProfileService } from '../../../services';
@Component({
  selector: 'app-edit-experience',
  templateUrl: './edit-experience.component.html',
  styleUrls: ['./edit-experience.component.css']
})
export class EditExperienceComponent implements OnInit {
  /**
   * Contains reference of Input to get values from parent
   */
  @Input() experience: any;
  /**
   * Contains array of subjects which comes from config
   */
  subjects: any;
  /**
   * Contains Date object
   */
  initDate = new Date();
  /**
   * Contains reference of Output to communicate between parent and child
   */
  @Output() currentJobChange = new EventEmitter();
  /**
   * Reference for formgroup
   */
  experienceForm: FormGroup;
  constructor(public resourceService: ResourceService, public windowScrollService: WindowScrollService,
    public userService: UserService, public configService: ConfigService, public profileService: ProfileService) {
    this.subjects = this.configService.dropDownConfig.COMMON.subjects;
  }
  /**
   * This method is used to create instance of formgroup
   */
  ngOnInit() {
    this.windowScrollService.smoothScroll('experience');
    if (this.experience) {
      const joiningDate = this.experience.joiningDate ? new Date(this.experience.joiningDate) : null;
      const endDate = this.experience.endDate ? new Date(this.experience.endDate) : null;
      this.experienceForm = new FormGroup({
        jobName: new FormControl(this.experience.jobName, [Validators.required]),
        role: new FormControl(this.experience.role),
        orgName: new FormControl(this.experience.orgName, [Validators.required]),
        subject: new FormControl(this.experience.subject),
        isCurrentJob: new FormControl(this.experience.isCurrentJob),
        joiningDate: new FormControl(joiningDate),
        endDate: new FormControl(endDate)
      });
    } else {
      this.experienceForm = new FormGroup({
        jobName: new FormControl(null, [Validators.required]),
        role: new FormControl(null),
        orgName: new FormControl(null, [Validators.required]),
        subject: new FormControl(null),
        isCurrentJob: new FormControl(null),
        joiningDate: new FormControl(null),
        endDate: new FormControl(null)
      });
    }
  }
  /**
   * This is a getter method used to get formcontrol value
   */
  get isCurrentJob() {
    return this.experienceForm.get('isCurrentJob').value;
  }
  /**
   * This method is used to emit values to parent component
   */
  currentJobChangeEvent() {
    this.currentJobChange.emit();
  }
}
