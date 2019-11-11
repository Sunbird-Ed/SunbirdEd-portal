import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CbseProgramService } from '../../services';
import * as _ from 'lodash-es';
import {UserService} from '@sunbird/core';
import {PlayerConfig} from './player.config';


@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss']
})
export class QuestionPreviewComponent implements OnInit, OnChanges {


  @Input() questionMetaData: any;
  @Input() selectedAttributes: any;
  public playerConfig: any;
  public theme: any;
  previewInitialized: boolean;
  showUpload = true;

  constructor(private toEcml: CbseProgramService, private userService: UserService ) {

  }

  ngOnInit() {

  this.previewInitialized = true;
  if (this.questionMetaData.mimeType !== 'application/vnd.ekstep.ecml-archive') {
    this.theme = null;
    const context = this.getContext();

    this.playerConfig = this.setPlayerConfig(context, this.theme);
  } else if (!this.selectedAttributes.previewQuestionData) {
    this.toEcml
    .getECMLJSON(this.selectedAttributes.questionList)
    .subscribe( (theme) => {
      /**
       * @param theme this contains the theme[Ecml]
       * @type {Object}
       */
      this.theme = theme;
      const context = this.getContext();
      this.playerConfig =  this.setPlayerConfig(context, theme);
    }, error => {
      console.log(error);
    });
    } else {
    this.toEcml
    .getECMLJSON(this.selectedAttributes.questionList, this.selectedAttributes.currentRole, this.selectedAttributes.previewQuestionData)
    .subscribe( (theme) => {
      /**
       * @param theme this contains the theme[Ecml]
       * @type {Object}
       */
      this.theme = theme;
      const context = this.getContext();
      this.playerConfig =  this.setPlayerConfig(context, theme);
    }, error => {
      console.log(error);
    });
    }


  }

  ngOnChanges() {

    if (this.previewInitialized) {
      if(this.questionMetaData && this.questionMetaData.mode !== 'create'){
        this.toEcml
        .getECMLJSON(this.selectedAttributes.questionList)
        .subscribe( (theme) => {
          /**
           * @param theme this contains the theme[Ecml]
           * @type {Object}
           */
          this.theme = theme;
          const context = this.getContext();
          this.playerConfig =  this.setPlayerConfig(context, theme);
        });
      } else {
        this.toEcml
        .getECMLJSON(this.selectedAttributes.questionList, this.selectedAttributes.currentRole, this.selectedAttributes.previewQuestionData)
        .subscribe( (theme) => {
          /**
           * @param theme this contains the theme[Ecml]
           * @type {Object}
           */
          this.theme = theme;
          const context = this.getContext();
          this.playerConfig =  this.setPlayerConfig(context, theme);
        })
      }
    }
  }

  setPlayerConfig(context, theme) {
    const finalPlayerConfiguration  = {
      data: theme,
      metadata: PlayerConfig.metadata,
      context: context,
      config: PlayerConfig.config,
    };

     if (this.questionMetaData.mimeType !== 'application/vnd.ekstep.ecml-archive') {
      finalPlayerConfiguration.data = {};
      finalPlayerConfiguration.metadata = this.questionMetaData;
    }
    return finalPlayerConfiguration;
  }

  // getUploadedContentMeta(e) {
  //    this.showUpload = false;
  //    this.playerConfig.data = {};
  //    this.playerConfig.metadata = e;
  // }

  getContext() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ?
    buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const tags = [];
    _.forEach(this.userService.userProfile.organisations, (org) => {
      if (org.hashTagId) {
      tags.push(org.hashTagId);
      }
    });
    const context = {
      'mode': 'play',
      'partner': [],
      'pdata': {
        'id': this.userService.appId,
        'ver': version,
        'pid': 'cbse-program-portal'
      },
      'contentId': '',
      'sid': this.userService.sessionId,
      'uid': this.userService.userid,
      'timeDiff': this.userService.getServerTimeDiff,
      'contextRollup': {},
      'channel': this.userService.channel,
      'did': '',
      'dims': this.userService.dims,
      'tags': tags,
      'app': [this.userService.channel]
    };
    return context;

  }
}
