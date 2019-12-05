import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-resource-template',
  templateUrl: './resource-template.component.html',
  styleUrls: ['./resource-template.component.scss']
})
export class ResourceTemplateComponent implements OnInit, OnDestroy {

  @ViewChild('modal') private modal;
  @Output() templateSelection = new EventEmitter<any>();
  showButton = false;
  public templateList;
  public templateSelected;
  constructor() { }


  ngOnInit() {
    this.templateList = [{
      'name': 'Explanation',
      'contentType': 'ExplanationResource',
      'mimeType': [
        'application/pdf'
      ],
      'thumbnail': '',
      'description': 'description',
      'marks': 5,
      'resourceType': '',
      'Audience': '',
      'formConfiguration': [
        {
          'code': 'LearningOutcome',
          'range': [],
          'label': 'Learning Outcome',
          'multiselect': true
        },
        {
          'code': 'bloomslevel',
          'range': [],
          'label': 'Learning Level',
          'multiselect': true
        }
      ],
      'filesConfig': {
        'accepted': 'pdf',
        'size': '50'
      }
    },
    {
      'name': 'Experimental',
      'contentType': 'ExperientialResource',
      'mimeType': [
        'video/mp4',
        'video/webm',
        'video/x-youtube'
      ],
      'thumbnail': '',
      'description': 'description',
      'marks': 5,
      'resourceType': '',
      'Audience': '',
      'formConfiguration': [
        {
          'code': 'LearningOutcome',
          'range': [],
          'label': 'Learning Outcome',
          'multiselect': true
        },
        {
          'code': 'bloomslevel',
          'range': [],
          'label': 'Learning Level',
          'multiselect': true
        }
      ],
      'filesConfig': {
        'accepted': 'mp4, webm, youtube',
        'size': '50'
      }
    },
    {
      'name': 'Practice Sets',
      'contentType': 'PracticeQuestionSet',
      'mimeType': [
        'application/vnd.ekstep.ecml-archive'
      ],
      'questionCategories': [
        'vsa',
        'sa',
        'la',
        'mcq'
      ],
      'thumbnail': '',
      'description': 'description',
      'marks': 5,
      'resourceType': '',
      'Audience': '',
      'formConfiguration': [
        {
          'code': 'LearningOutcome',
          'range': [],
          'label': 'Learning Outcome',
          'multiselect': true
        },
        {
          'code': 'bloomslevel',
          'range': [],
          'label': 'Learning Level',
          'multiselect': true
        }
      ]
    },
    {
      'name': 'Curiosity',
      'contentType': 'CuriosityQuestionSet',
      'mimeType': [
        'application/vnd.ekstep.ecml-archive'
      ],
      'questionCategories': [
        'curiosity'
      ],
      'thumbnail': '',
      'description': 'description',
      'marks': 5,
      'resourceType': '',
      'Audience': '',
      'formConfiguration': [
        {
          'code': 'LearningOutcome',
          'range': [],
          'label': 'Learning Outcome',
          'multiselect': true
        },
        {
          'code': 'bloomslevel',
          'range': [],
          'label': 'Learning Level',
          'multiselect': true
        }
      ]
    }];
  }

  handleSubmit() {
    const templateDetails = _.find(this.templateList, (template) => {
      return template.contentType === this.templateSelected;
    });
    this.templateSelection.emit({ type: 'next', template: this.templateSelected, templateDetails: templateDetails });
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}
