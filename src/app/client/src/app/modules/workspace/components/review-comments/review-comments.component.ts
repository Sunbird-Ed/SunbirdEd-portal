import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ResourceService, ToasterService, ContentData, ServerResponse } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { ReviewCommentsService } from './../../services/review-comments.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-review-comments',
  templateUrl: './review-comments.component.html',
  styleUrls: ['./review-comments.component.css']
})
export class ReviewCommentsComponent implements OnInit, OnDestroy {

  public unsubscribe = new Subject<void>();

  /**
	 * Creates a object of the form control
	 */
  comments = new FormControl();

  reviewDetails: any;

  disableSubmitcommentsButton = true;

  @Input() contentData: ContentData;

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public userService: UserService, public reviewCommentsService: ReviewCommentsService) { }

  ngOnInit() {
    this.getReviewComments();
    this.comments.valueChanges.subscribe(data => {
      data = data.trim();
      this.disableSubmitcommentsButton = data.length > 150 || data.length === 0 ? true : false;
    });
  }

  getReviewComments() {
    const requestBody = {
      'request': {
        'contextDetails': {
          'contentId': this.contentData.identifier,
          'version': this.contentData.versionKey,
          'contentType': this.contentData.mimeType,
          'stageId': '1'
        }
      }
    };
    this.reviewCommentsService.getThreadList(requestBody).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (apiResponse: ServerResponse) => {
          this.reviewDetails = apiResponse.result;
        },
        err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      );
  }

  addReviewComments() {
    const requestBody = {
      'request': {
        'contextDetails': {
          'contentId': this.contentData.identifier,
          'version': this.contentData.versionKey,
          'contentType': this.contentData.mimeType,
          'stageId': '1'
        },
        'message': this.comments.value,
        'userId': this.userService.userProfile.userId,
        'userName': this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName,
        'userImage': this.userService.userProfile.avatar
      }
    };
    this.reviewCommentsService.createThread(requestBody).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (apiResponse: ServerResponse) => {
        },
        err => {
          this.toasterService.error(this.resourceService.messages.emsg.m0005);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
