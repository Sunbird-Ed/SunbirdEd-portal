import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { ActionCard } from './../../interfaces/index';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
/**
 *This Component contains the details about enrolled courses.
 */
@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.css']
})
export class ActionCardComponent {
   /**
	 * resumeIntractEdata
	*/
  courseIntractEdata: IInteractEventEdata;
  /**
	 * resumeIntractEdata
	*/
  resumeIntractEdata: IInteractEventEdata;
  /**
	 * telemetryInteractObject
	*/
  telemetryInteractObject: IInteractEventObject;
  /**
   * To call resource service which helps to use language constant.
   */
  public resourceService: ResourceService;
  /**
 * To get user details.
 */
  private userService: UserService;
  /**
   * This is used to render the enrolled courses values in the view.
   */
  @Input() enrolledCourses: ActionCard;

  @Output('clickEvent')
  clickEvent = new EventEmitter<any>();

  public onAction(data) {
    this.clickEvent.emit({ 'data': data });
  }
  /**
   * The constructor
   * @param {ResourceService} resourceService Reference of ResourceService.
   * @param {UserService} userService Reference of userService.
   */
  constructor(resourceService: ResourceService, userService: UserService) {
    this.resourceService = resourceService;
    this.userService = userService;
    this.setInteractEventData();
  }
  setInteractEventData() {
    this.resumeIntractEdata = {
      id: 'resume-courseId',
      type: 'click',
      pageid: 'home'
    };
    this.telemetryInteractObject = {
      id: this.userService.userid,
      type: 'user',
      ver: '1.0'
    };
    this.courseIntractEdata = {
      id: 'courseId',
      type: 'click',
      pageid: 'home'
    };
  }
}
