import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ResourceService, ToasterService, ContentData } from '@sunbird/shared';
import { UserService } from '@sunbird/core';

@Component({
  selector: 'app-review-comments',
  templateUrl: './review-comments.component.html',
  styleUrls: ['./review-comments.component.css']
})
export class ReviewCommentsComponent implements OnInit {

  /**
	 * Creates a object of the form control
	 */
  comments = new FormControl();

  reviewDetails: any;

  disableSubmitcommentsButton = true;

  @Input() contentData: ContentData;

  constructor(public resourceService: ResourceService, public toasterService: ToasterService,
    public userService: UserService) { }

  ngOnInit() {
    this.getReviewComments();
    this.comments.valueChanges.subscribe(data => {
      data = data.trim();
      this.disableSubmitcommentsButton = data.length > 150 || data.length === 0 ? true : false;
    });
  }

  getReviewComments() {
    this.reviewDetails = {
      'contentId': 'do_112584109936099328189',
      'contentVer': '1538720793170',
      'contentType': 'ecml',
      'stageId': 'eelk12hj45',
      'comments': [{
        'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        'userName': 'Sourav Dey',
        'userImage': 'https://dev.open-sunbird.org/assets/images/sunbird_logo.png',
        'message': 'Cannot see the content clearly on desktop. Please check the dimensions',
        'createdOn': '2018-10-03 13:33:35:868+0000'
      },
      {
        'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        'userName': 'Gourav More',
        'userImage': 'https://dev.open-sunbird.org/assets/images/sunbird_logo.png',
        'message': 'The image is distorted. Upload a bigger resolution image.',
        'createdOn': '2018-10-03 13:33:35:868+0000'
      },
      {
        'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
        'userName': 'Vivek Kasture',
        'userImage': 'https://dev.open-sunbird.org/assets/images/sunbird_logo.png',
        'message': 'Inapropiate tags such as Resource type and tags',
        'createdOn': '2018-10-03 13:33:35:868+0000'
      }
      ]
    };
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

    console.log('finaldata', requestBody);
  }

}
