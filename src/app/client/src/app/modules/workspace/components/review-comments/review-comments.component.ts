import { Component, OnInit, Input, OnChanges, OnDestroy, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ResourceService, ToasterService, ContentData, ServerResponse } from '@sunbird/shared';
import { UserService } from '@sunbird/core';
import { ReviewCommentsService } from '../../services';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { IInteractEventObject, IInteractEventEdata } from '@sunbird/telemetry';
import dayjs from 'dayjs';

@Component({
  selector: 'app-review-comments',
  templateUrl: './review-comments.component.html',
  styleUrls: ['./review-comments.component.scss']
})
export class ReviewCommentsComponent implements OnInit, OnChanges, OnDestroy {

  public unsubscribe = new Subject<void>();

  /**
	 * Creates a object of the form control
	 */
  public submitCommentsInteractEdata: IInteractEventEdata;

  public telemetryInteractObject: IInteractEventObject;

  comments = new UntypedFormControl();

  sortedComments: any = {};

  contentComments: any;

  disableSubmitcommentsButton = true;

  disableTextArea = false;

  @Input() contentData: ContentData;

  @Input() stageId: string;

  @Input() playerLoaded: boolean;

  @Output() reviewCommentEvent = new EventEmitter();

  @ViewChild('commentInput') commentInput: ElementRef;

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public userService: UserService, public reviewCommentsService: ReviewCommentsService,
  ) { }

  ngOnInit() {
    this.setInteractEventData();
    this.getReviewComments().pipe(takeUntil(this.unsubscribe)).subscribe(
        (data) => {
          this.sortedComments = data;
          this.reviewCommentEvent.emit(this.sortedComments ); // emit data to parent
          this.reviewCommentsService.contextDetails = {
            contentId: this.contentData.identifier,
            contentVer: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '0', // this should be version not versionKey
            contentType: this.contentData.mimeType
          };
        },
        (error) => this.toasterService.error(this.resourceService.messages.emsg.m0011));
  }
  ngOnChanges() {
    if (!this.stageId) {
      this.disableTextArea = true;
    } else {
      this.disableTextArea = false;
    }
    this.comments = new UntypedFormControl();
  }
  focusOnInput() {
    this.commentInput.nativeElement.focus();
  }
  getReviewComments() {
    // fetch all comments for content then show content related to stageID
    const requestBody = {
      request: {
        contextDetails: {
          contentId: this.contentData.identifier,
          contentVer: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '0', // this should be version not versionKey
          contentType: this.contentData.mimeType
        }
      }
    };
    return this.reviewCommentsService.getComments(requestBody).pipe(map((data) => {
      const commentList = _.get(data, 'result.comments');
      return commentList.reduce((accumulator, current) => {
        if (accumulator[current.stageId]) {
          accumulator[current.stageId].push(current);
        } else {
          accumulator[current.stageId] = [];
          accumulator[current.stageId].push(current);
        }
        return accumulator;
      }, {});
    }));
  }

  addReviewComments() {
    if (!this.stageId) { // if stageId not fetched, throw error
      this.toasterService.error(this.resourceService.messages.emsg.m0010);
      return;
    }
    if (!this.comments.value || !this.comments.value.trim()) {
      return;
    }
    this.disableTextArea = true;
    const requestBody: any = {
      request: {
        contextDetails: {
          contentId: this.contentData.identifier,
          contentVer: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '0', // this should be version not versionKey
          contentType: this.contentData.mimeType,
          stageId: this.stageId
        },
        body: this.comments.value,
        userId: this.userService.userProfile.userId,
        userInfo: {
          name: this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName
        }
      }
    };
    if (this.userService.userProfile.avatar) {
      requestBody.request.userInfo.logo = this.userService.userProfile.avatar;
    }
    this.reviewCommentsService.createComment(requestBody).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (apiResponse: ServerResponse) => {
          this.disableTextArea = false;
          const newComment = {
            userId: this.userService.userProfile.userId,
            userInfo: {
              name: this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName,
              logo: this.userService.userProfile.avatar,
            },
            body: this.comments.value,
            createdOn: dayjs().format()
          };
          if (this.sortedComments[this.stageId]) {
            this.sortedComments[this.stageId].push(newComment);
          } else {
            this.sortedComments[this.stageId] = [];
            this.sortedComments[this.stageId].push(newComment);
          }
          this.reviewCommentEvent.emit(this.sortedComments); // emit data to parent
          this.comments = new UntypedFormControl();
        },
        err => {
          this.disableTextArea = false;
          this.toasterService.error(this.resourceService.messages.emsg.m0010);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  setInteractEventData() {
    this.submitCommentsInteractEdata = {
      id: 'submit-review-comments',
      type: 'click',
      pageid: 'upForReview-content-player'
    };
    this.telemetryInteractObject = {
      id: this.contentData.identifier,
      type: this.contentData.contentType,
      ver: this.contentData.pkgVersion ? this.contentData.pkgVersion.toString() : '1.0'
    };
  }
}
