import { ConfigService, NavigationHelperService, UtilService } from '@sunbird/shared';
import { Component, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter,
OnChanges, HostListener, OnInit, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash-es';
import { PlayerConfig } from '@sunbird/shared';
import { Router } from '@angular/router';
import { ToasterService, ResourceService, ContentUtilsServiceService } from '@sunbird/shared';
const OFFLINE_ARTIFACT_MIME_TYPES = ['application/epub'];
import { Subject } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { UserService, FormService } from '../../../core/services';
import { OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { CsContentProgressCalculator } from '@project-sunbird/client-services/services/content/utilities/content-progress-calculator';
import { ContentService } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { DiscussionService } from '../../../discussion/services/discussion/discussion.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() playerConfig: PlayerConfig;
  @Output() assessmentEvents = new EventEmitter<any>();
  @Output() questionScoreSubmitEvents = new EventEmitter<any>();
  @ViewChild('contentIframe', {static: false}) contentIframe: ElementRef;
  @Output() playerOnDestroyEvent = new EventEmitter<any>();
  @Output() sceneChangeEvent = new EventEmitter<any>();
  @Input() contentProgressEvents$: Subject<any>;
  playerLoaded = false;
  buildNumber: string;
  @Input() playerOption: any;
  contentRatingModal = false;
  showRatingModalAfterClose = false;
  previewCdnUrl: string;
  isCdnWorking: string;
  CONSTANT = {
    ACCESSEVENT: 'renderer:question:submitscore',
    ISLASTATTEMPT: 'renderer:selfassess:lastattempt',
    MAXATTEMPT: 'renderer:maxLimitExceeded'
  };
  @Input() overlayImagePath: string;
  @Input() isSingleContent: boolean;
  @Input() telemetryObject: {};
  @Input() pageId: string;
  @Input() contentData;
  @Input() isContentDeleted: Subject<any>;
  @Output() closePlayerEvent = new EventEmitter<any>();
  @Output() ratingPopupClose = new EventEmitter<any>();
  @Output() selfAssessLastAttempt = new EventEmitter<any>();
  contentDeleted = false;
  isMobileOrTab: boolean;
  showPlayIcon = true;
  closeButtonInteractEdata: IInteractEventEdata;
  loadPlayerInteractEdata: IInteractEventEdata;
  playerOverlayImage: string;
  isFullScreenView = false;
  public unsubscribe = new Subject<void>();
  public showNewPlayer = false;
  mobileViewDisplay = 'block';
  playerType: string;
  isDesktopApp = false;

  /**
 * Dom element reference of contentRatingModal
 */
  @ViewChild('modal', {static: false}) modal;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.closeContentFullScreen();
  }

  constructor(private discussionService: DiscussionService, public configService: ConfigService, public router: Router, private toasterService: ToasterService,
    public resourceService: ResourceService, public navigationHelperService: NavigationHelperService,
    private deviceDetectorService: DeviceDetectorService, private userService: UserService, public formService: FormService
    , public contentUtilsServiceService: ContentUtilsServiceService, private contentService: ContentService,
    private cdr: ChangeDetectorRef, public playerService: PublicPlayerService, private utilService: UtilService) {
    this.buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'))
      ? (<HTMLInputElement>document.getElementById('buildNumber')).value : '1.0';
    this.previewCdnUrl = (<HTMLInputElement>document.getElementById('previewCdnUrl'))
      ? (<HTMLInputElement>document.getElementById('previewCdnUrl')).value : undefined;
    this.isCdnWorking = (<HTMLInputElement>document.getElementById('cdnWorking'))
      ? (<HTMLInputElement>document.getElementById('cdnWorking')).value : 'no';
  }

  @HostListener('window:orientationchange', ['$event'])
  public handleOrientationChange() {
    const screenType = _.get(screen, 'orientation.type');
      if ( screenType === 'portrait-primary' || screenType === 'portrait-secondary' ) {
        this.closeFullscreen();
      }
  }

  ngOnInit() {


    setTimeout(() => {
      this.discussionService.getQuestionSetHierarchy('do_1132131785524101121151').subscribe(forumDetails => {
        console.log('==============forumDetails', forumDetails)
      }, error => {
        console.log('==============error', error)
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });

      this.discussionService.getQuestionList(["do_1132131789426933761152", "do_113015077903966208165"]).subscribe(forumDetails => {
        console.log('==============forumDetails', forumDetails)
      }, error => {
        console.log('==============error', error)
        this.toasterService.error(this.resourceService.messages.emsg.m0005);
      });


// let req = {
//   "filters": {
//       "objectType":["QuestionSet"],
//       "status": [],
//       "identifier":["do_1132131789426933761152"]
//   }
// };

// this.discussionService.getQuestionSet1(req).subscribe(forumDetails => {
// }, error => {
//   this.toasterService.error(this.resourceService.messages.emsg.m0005);
// });
    }, 1000)



    // If `sessionStorage` has UTM data; append the UTM data to context.cdata
    if (this.playerConfig && sessionStorage.getItem('UTM')) {
      let utmData;
      try {
        utmData = JSON.parse(sessionStorage.getItem('UTM'));
      } catch (error) {
        throw new Error('JSON Parse Error => UTM data');
      }
      if (utmData && _.get(this.playerConfig, 'context.cdata')) {
        this.playerConfig.context.cdata = _.union(this.playerConfig.context.cdata, utmData);
      }
      if (utmData && !_.get(this.playerConfig, 'context.cdata')) {
        this.playerConfig.context['cdata'] = [];
        this.playerConfig.context.cdata = _.union(this.playerConfig.context.cdata, utmData);
      }
    }
    this.isDesktopApp = this.utilService.isDesktopApp;
    // Check for loggedIn user; and append user data to context object
    // User data (`firstName` and `lastName`) is used to show at the end of quiz
    if (this.playerConfig) {
        this.addUserDataToContext();
    }
    this.isMobileOrTab = this.deviceDetectorService.isMobile() || this.deviceDetectorService.isTablet();
    if (this.isSingleContent === false) {
      this.showPlayIcon = false;
    }
    this.setTelemetryData();
    this.navigationHelperService.contentFullScreenEvent.
    pipe(takeUntil(this.unsubscribe)).subscribe(isFullScreen => {
      this.isFullScreenView = isFullScreen;
      const root: HTMLElement = document.getElementsByTagName( 'html' )[0];
      if (isFullScreen) {
        root.classList.add('PlayerMediaQueryClass');
      } else {
        root.classList.remove('PlayerMediaQueryClass');
      }
      if (this.isDesktopApp) {
        const hideCM = isFullScreen ? true : false;
        this.navigationHelperService.handleContentManagerOnFullscreen(hideCM);
      }
      this.loadPlayer();
    });

    this.contentUtilsServiceService.contentShareEvent.pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      if (this.isMobileOrTab && data === 'close') {
        this.mobileViewDisplay = 'block';
      }
    });
  }

  /**
   * loadPlayer method will be called
   */
  ngAfterViewInit() {
    if (this.playerConfig) {
      this.loadPlayer();
    }
  }

  ngOnChanges(changes) {
    this.contentRatingModal = false;
    this.showNewPlayer = false;
    this.cdr.detectChanges();
    if (this.playerConfig) {
      this.playerOverlayImage = this.overlayImagePath ? this.overlayImagePath : _.get(this.playerConfig, 'metadata.appIcon');
      this.loadPlayer();
    }
  }
  loadCdnPlayer() {
    const iFrameSrc = this.configService.appConfig.PLAYER_CONFIG.cdnUrl + '&build_number=' + this.buildNumber;
    setTimeout(() => {
      const playerElement = this.contentIframe.nativeElement;
      playerElement.src = iFrameSrc;
      playerElement.onload = (event) => {
        try {
          this.adjustPlayerHeight();
          playerElement.contentWindow.initializePreview(this.playerConfig);
          if (this.playerLoaded) {
            playerElement.removeEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
            window.frames['contentPlayer'].removeEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
          }
          this.playerLoaded = true;
          playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
          window.frames['contentPlayer'].addEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
        } catch (err) {
          this.loadDefaultPlayer();
        }
      };
    }, 0);
  }
  loadDefaultPlayer(url = this.configService.appConfig.PLAYER_CONFIG.baseURL) {
    const iFrameSrc = url + '&build_number=' + this.buildNumber;
    setTimeout(() => {
      const playerElement = this.contentIframe.nativeElement;
      playerElement.src = iFrameSrc;
      playerElement.onload = (event) => {
        try {
          this.adjustPlayerHeight();
          playerElement.contentWindow.initializePreview(this.playerConfig);
          if (this.playerLoaded) {
            playerElement.removeEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
            window.frames['contentPlayer'].removeEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
          }
          this.playerLoaded = true;
          playerElement.addEventListener('renderer:telemetry:event', telemetryEvent => this.generateContentReadEvent(telemetryEvent));
          window.frames['contentPlayer'].addEventListener('message', accessEvent => this.generateScoreSubmitEvent(accessEvent), false);
        } catch (err) {
          const prevUrls = this.navigationHelperService.history;
          if (this.isCdnWorking.toLowerCase() === 'yes' && prevUrls[prevUrls.length - 2]) {
            history.back();
          }
        }
      };
    }, 0);
  }

  loadPlayer() {
    this.playerConfig = {
      'config':{
  
      },
      'context': {
        'attempts': {
            'max': 2,
          'current': 0,
        },
        'mode': 'play',
        'authToken': ' ',
        'sid': '913b3c6c-2874-26dd-ed0c-c23ddc00b718',
        'did': '561c348e631fd225b46a5571cbd42ad1',
        'uid': '',
        'channel': '01268904781886259221',
        'pdata': {
            'id': 'preprod.diksha.portal',
            'ver': '3.3.0',
            'pid': 'sunbird-portal.contentplayer'
        },
        'contextRollup': {
            'l1': 'string',
            'l2': 'string',
            'l3': 'string',
            'l4': 'string',
        },
        'tags': [],
        'cdata': [
            {
                'id': 'c0c9384a82a75f219468d363e1891963',
                'type': 'ContentSession'
            },
            {
                'id': 'a12f45a1d7078901adb27b48be4b428d',
                'type': 'PlaySession'
            }
        ],
        'timeDiff': 5,
        'objectRollup': {
            'l1': 'string',
            'l2': 'string',
            'l3': 'string',
            'l4': 'string',
        },
        'host': '',
        'endpoint': '/data/v3/telemetry',
        'userData': {
            'firstName': 'Diptesh',
            'lastName': 'Mukherjee'
        }
    },
    'metadata': {
        "instructions": "<div>General Instruction</div><b style='color:red;'>bold text 123</b><p style='font-weight: bold; font-style: italic; text-decoration: underline;'>Bold Italic Underline</p><ul><li>Bullet list for testing</li><li>Bullet list for testing</li><li>Bullet list for testing</li></ul><ol><li>Number list for testing</li><li>Number list for testing</li><li>Number list for testing</li></ol><h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3><table style='width:100%'><tr> <th>Firstname</th><th>Lastname</th><th>Age</th></tr><tr><td>Jill</td><td>Smith</td><td>50</td></tr><tr><td>Eve</td><td>Jackson</td><td>94</td></tr></table><div class='startpage-guidelines'><p>Read and understand the test guidelines</p><p>Click on audio icon to play sound</p><p>Tap on the zoom icon to enlarge the image</p><p>Tap on the option to select answer</p></div>",
        'identifier': 'do_2123922457085296641201',
        'name': 'test_pdf1234',
        'contentData': {
            'ownershipType': [
                'createdBy'
            ],
            'copyright': 'Ekstep',
            'previewUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2123922457085296641201/activity-1.pdf',
            'subject': [
                'English'
            ],
            'channel': 'in.ekstep',
            'downloadUrl': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar-files/do_2123922457085296641201/test_pdf1234_1538551443413_do_2123922457085296641201_9.0.ecar',
            'showNotification': true,
            'language': [
                'English'
            ],
            'mimeType': 'application/pdf',
            'variants': {
                'spine': {
                    'ecarUrl': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/ecar-files/do_2123922457085296641201/test_pdf1234_1538551443562_do_2123922457085296641201_9.0_spine.ecar',
                    'size': 42584
                }
            },
            'objectType': 'Content',
            'gradeLevel': [
                'Class 1'
            ],
            'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2123922457085296641201/artifact/asder0_123456_1512019015777.thumb.jpg',
            'primaryCategory': 'Learning Resource',
            'collections': [
                {
                    'identifier': 'do_2123922438486753281199',
                    'name': 'Course-Dec-08',
                    'description': 'ByKS',
                    'objectType': 'Collection',
                    'relation': 'hasSequenceMember',
                    'status': 'Review'
                },
                {
                    'identifier': 'do_212540773107212288193',
                    'name': 'New1',
                    'description': 'ndkwnwek',
                    'objectType': 'Collection',
                    'relation': 'hasSequenceMember',
                    'status': 'Live'
                },
                {
                    'identifier': 'do_21285790456990105611708',
                    'name': 'Course Batch for Mobile',
                    'description': 'Enter description for Course',
                    'objectType': 'Collection',
                    'relation': 'hasSequenceMember',
                    'status': 'Live'
                },
                {
                    'identifier': 'do_2123922609217617921210',
                    'name': 'Course-Dec08',
                    'description': 'By KS',
                    'objectType': 'Collection',
                    'relation': 'hasSequenceMember',
                    'status': 'Retired'
                },
                {
                    'identifier': 'do_2127646188746096641525',
                    'name': 'Book Text ',
                    'description': 'Enter description for TextBook',
                    'objectType': 'Collection',
                    'relation': 'hasSequenceMember',
                    'status': 'Live'
                }
            ],
            'appId': 'staging.diksha.portal',
            'contentEncoding': 'identity',
            'artifactUrl': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2123922457085296641201/artifact/activity-1.pdf',
            'sYS_INTERNAL_LAST_UPDATED_ON': '2018-10-12T15:32:13.236+0000',
            'contentType': 'Resource',
            'identifier': 'do_2123922457085296641201',
            'lastUpdatedBy': '18150cf9-b839-4ccd-956a-66e359f22278',
            'audience': [
                'Student'
            ],
            'visibility': 'Default',
            'author': 'Ekstep',
            'consumerId': 'a9cb3a83-a164-4bf0-aa49-b834cebf1c07',
            'mediaType': 'content',
            'osId': 'org.ekstep.quiz.app',
            'languageCode': [
                'en'
            ],
            'lastPublishedBy': '18150cf9-b839-4ccd-956a-66e359f22278',
            'pragma': [
                'external'
            ],
            'license': 'CC BY 4.0',
            'prevState': 'Live',
            'size': 364473,
            'lastPublishedOn': '2018-10-03T07:24:03.413+0000',
            'concepts': [
                {
                    'identifier': 'LO45',
                    'name': 'Comprehension Of Essays',
                    'description': 'Comprehension Of Essays',
                    'objectType': 'Concept',
                    'relation': 'associatedTo',
                    'status': 'Live'
                },
                {
                    'identifier': 'LO47',
                    'name': 'Comprehension Of Poems',
                    'description': 'Comprehension Of Poems',
                    'objectType': 'Concept',
                    'relation': 'associatedTo',
                    'status': 'Live'
                }
            ],
            'name': 'test_pdf1234',
            'status': 'Live',
            'code': '23356335-8da2-4b2d-9850-613deddceb48',
            'description': 'fghjk',
            'streamingUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/assets/do_2123922457085296641201/activity-1.pdf',
            'posterImage': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2123922457085296641201/artifact/asder0_123456_1512019015777.jpg',
            'idealScreenSize': 'normal',
            'createdOn': '2017-12-08T09:28:26.217+0000',
            'copyrightYear': 2019,
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2018-10-03T07:24:03.126+0000',
            'createdFor': [
                '01232003237608652844',
                '01231711180382208027'
            ],
            'creator': 'creator1 is back',
            'os': [
                'All'
            ],
            'pkgVersion': 9,
            'versionKey': '1527768913243',
            'idealScreenDensity': 'hdpi',
            'framework': 'NCF',
            's3Key': 'ecar_files/do_2123922457085296641201/test_pdf1234_1538551443413_do_2123922457085296641201_9.0.ecar',
            'lastSubmittedOn': '2017-12-08T09:29:39.254+0000',
            'createdBy': '4c4530df-0d4f-42a5-bd91-0366716c8c24',
            'compatibilityLevel': 4,
            'board': 'CBSE',
            'resourceType': 'Read',
            'licenseDetails': {
                'name': 'CC BY 4.0',
                'url': 'https://creativecommons.org/licenses/by/4.0/legalcode',
                'description': 'For details see below:'
            },
            'trackable': {
                'enabled': 'No'
            }
        },
        'isUpdateAvailable': false,
        'mimeType': 'application/vnd.sunbird.questionset',
        'basePath': '',
        'contentType': 'resource',
        'primaryCategory': 'learning resource',
        'isAvailableLocally': false,
        'referenceCount': 0,
        'sizeOnDevice': 0,
        'lastUsedTime': 0,
        'lastUpdatedTime': 0,
        'contentAccess': [],
        'contentFeedback': [],
        'contentMarker': [],
        'rollup': {
            'l1': 'do_2123922457085296641201'
        },
        'depth': ''
    },
    'data': {
        "timeLimits": {
            "totalTime": 60,
            "warningTime": 40
        },
        'name': 'Pre number concepts | Chapter Assessment | English | Grade 1',
        'description': 'Test question set with 5 MCQ questions',
        'mimeType': 'application/vnd.sunbird.quml',
        'subject': [
            'CBSE Training'
        ],
        'channel': '0129471823189688320',
        'organisation': [
            [
                'State (Andhra Pradesh)'
            ]
        ],
        'objectType': 'QuestionSet',
        'gradeLevel': [
            'Class 12',
            'Class 10'
        ],
        'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130299686648299521293/artifact/unnamed.thumb.png',
        'primaryCategory': 'PracticeQuestionSet',
        'contentEncoding': 'gzip',
        'contentType': 'TextBook',
        'identifier': 'do_2131552688089989121841',
        'audience': [
            'Student'
        ],
        'license': 'CC BY 4.0',
        'code': 'org.sunbird.3FFj0O',
        'medium': [
            'English'
        ],
        'posterImage': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_3130299721064775681336/artifact/unnamed.png',
        'contentDisposition': 'inline',
        'dialcodeRequired': 'No',
        'createdFor': [
            '0129471823189688320'
        ],
        'creator': '7b2d1c75-d872-4bb0-bd42-734289ad21df',
        'pkgVersion': 1,
        'framework': 'ap_k-12_1',
        'createdBy': 'b88d2335-6688-40a3-ac43-41aa5152d7b7',
        'compatibilityLevel': 4,
        'board': [
            'State (Andhra Pradesh)'
        ],
        'licenseDetails': {
            'name': 'CC BY 4.0',
            'url': 'https://creativecommons.org/licenses/by/4.0/legalcode',
            'description': 'For details see below:'
        },
        'visibility': 'default',
        'setType': 'materialised',
        'navigationMode': 'non-linear',
        'allowSkip': true,
        'requiresSubmit': true,
        'shuffle': true,
        'showFeedback': true,
        'showSolutions': true,
        'quMLVersion': 1.5,
        'showTimer': true,
        'outcomeProcessing': {
            'template': 'AVG_OF_SCORES',
            'ignoreNullValues': false
        },
        'totalQuestions': 4,
        'maxQuestions': 3,
        'maxScore': 3,
        'children': [
            {
                "code": "29768037-4c37-a10f-8823-5218826db206",
                "templateId": "mcq-grid-split",
                "name": "untitled mcq",
                "body": "<div class='question-body'><div class='mcq-title'><p>1. What does ..... a dummy-variable regression analysis examine?</p><p><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure></div><div data-choice-interaction='response1' class='mcq-vertical'></div></div>",
                "responseDeclaration": {
                    "maxScore": 1,
                    "response1": {
                        "cardinality": "single",
                        "type": "integer",
                        "correctResponse": {
                            "value": "1",
                            "outcomes": {
                                "SCORE": 1
                            }
                        }
                    }
                },
                "interactionTypes": [
                    "choice"
                ],
                "interactions": {
                    "response1": {
                        "type": "choice",
                        "options": [{
                            "label": "<p>2 September 1929</p>",
                            "value": 0
                        },
                        {
                            "label": "<p>15 October 1931</p>",
                            "value": 1
                        },
                        {
                            "label": "<p>15 August 1923</p>",
                            "value": 2
                        },
                        {
                            "label": "<p>29 February 1936</p>",
                            "value": 3
                        }
                        ]
                    }
                },
                "editorState": {
                    "question": "<p>1. What does a dummy-variable regression analysis examine?</p><p><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure>",
                    "options": [
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one continuous independent variable</li></ol>",
                                "value": 0
                            }
                        },
                        {
                            "answer": true,
                            "value": {
                                "body": "<ol><li>The relationship between one categorical dependent and one continuous independent variable</li></ol>",
                                "value": 1
                            }
                        },
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one categorical independent variable</li></ol><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png\" alt=\"do_11310507846892748812026\" data-asset-variable=\"do_11310507846892748812026\"></figure>",
                                "value": 2
                            }
                        },
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one dichotomous variable</li></ol><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"(x%2Ba)%5En%3D%5Csum_%7Bk%3D0%7D%5En(%5Cfrac%7Bn_%7B%20%7D%7D%7Bk%7D)x%5Eka%5E%7Bn-k%7D\" advanced=\"false\"></figure>",
                                "value": 3
                            }
                        }
                    ],
                    "solutions": [
                        {
                            "id": "293d752e-844d-24c6-dd48-1ac78bb2793c",
                            "type": "video",
                            "value": "do_113143853080248320171"
                        }
                    ]
                },
                "status": "Draft",
                "media": [
                    {
                        "id": "do_11310507846892748812026",
                        "type": "image",
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png",
                        "baseUrl": "https://dock.sunbirded.org"
                    },
                    {
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143853080248320171/artifact/1604474270424.thumb.png",
                        "type": "image",
                        "id": "video_do_113143853080248320171"
                    },
                    {
                        "id": "do_113143853080248320171",
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113143853080248320171/13mb.mp4",
                        "type": "video",
                        "assetId": "do_113143853080248320171",
                        "name": "13mb",
                        "thumbnail": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143853080248320171/artifact/1604474270424.thumb.png"
                    }
                ],
                "qType": "MCQ",
                "mimeType": "application/vnd.ekstep.qml-archive",
                "primaryCategory": "Multiple Choice Question",
                "solutions": [
                    {
                        "id": "293d752e-844d-24c6-dd48-1ac78bb2793c",
                        "type": "video",
                        "value": "do_113143853080248320171"
                    }
                ]
            },
            {
                "code": "29768037-4c37-a10f-8823-5218826db206",
                "templateId": "mcq-vertical",
                "name": "untitled mcq",
                "body": "<div class='question-body'><div class='mcq-title'><p>2. What does a dummy-variable regression analysis examine?</p><p><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure></div><div data-choice-interaction='response1' class='mcq-vertical'></div></div>",
                "responseDeclaration": {
                    "maxScore": 1,
                    "response1": {
                        "cardinality": "single",
                        "type": "integer",
                        "correctResponse": {
                            "value": "1",
                            "outcomes": {
                                "SCORE": 1
                            }
                        }
                    }
                },
                "interactionTypes": [
                    "choice"
                ],
                "interactions": {
                    "response1": {
                        "type": "choice",
                        "options": [{
                            "label": "<p>2 September 1929</p>",
                            "value": 0
                        },
                        {
                            "label": "<p>15 October 1931</p>",
                            "value": 1
                        },
                        {
                            "label": "<p>15 August 1923</p>",
                            "value": 2
                        },
                        {
                            "label": "<p>29 February 1936</p>",
                            "value": 3
                        }
                        ]
                    }
                },
                "editorState": {
                    "question": "<p>1. What does a dummy-variable regression analysis examine?</p><p><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure>",
                    "options": [
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one continuous independent variable</li></ol>",
                                "value": 0
                            }
                        },
                        {
                            "answer": true,
                            "value": {
                                "body": "<ol><li>The relationship between one categorical dependent and one continuous independent variable</li></ol>",
                                "value": 1
                            }
                        },
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one categorical independent variable</li></ol><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png\" alt=\"do_11310507846892748812026\" data-asset-variable=\"do_11310507846892748812026\"></figure>",
                                "value": 2
                            }
                        },
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one dichotomous variable</li></ol><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"(x%2Ba)%5En%3D%5Csum_%7Bk%3D0%7D%5En(%5Cfrac%7Bn_%7B%20%7D%7D%7Bk%7D)x%5Eka%5E%7Bn-k%7D\" advanced=\"false\"></figure>",
                                "value": 3
                            }
                        }
                    ],
                    "solutions": [
                        {
                            "id": "293d752e-844d-24c6-dd48-1ac78bb2793c",
                            "type": "video",
                            "value": "do_113143853080248320171"
                        }
                    ]
                },
                "status": "Draft",
                "media": [
                    {
                        "id": "do_11310507846892748812026",
                        "type": "image",
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png",
                        "baseUrl": "https://dock.sunbirded.org"
                    },
                    {
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143853080248320171/artifact/1604474270424.thumb.png",
                        "type": "image",
                        "id": "video_do_113143853080248320171"
                    },
                    {
                        "id": "do_113143853080248320171",
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113143853080248320171/13mb.mp4",
                        "type": "video",
                        "assetId": "do_113143853080248320171",
                        "name": "13mb",
                        "thumbnail": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143853080248320171/artifact/1604474270424.thumb.png"
                    }
                ],
                "qType": "MCQ",
                "mimeType": "application/vnd.ekstep.qml-archive",
                "primaryCategory": "Multiple Choice Question",
                "solutions": [
                    {
                        "id": "293d752e-844d-24c6-dd48-1ac78bb2793c",
                        "type": "video",
                        "value": "do_113143853080248320171"
                    }
                ]
            },
            {
                "code": "29768037-4c37-a10f-8823-5218826db206",
                "templateId": "mcq-vertical",
                "name": "untitled mcq",
                "body": "<div class='question-body'><div class='mcq-title'><p>3. What does a dummy-variable regression analysis examine?</p><p><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure></div><div data-choice-interaction='response1' class='mcq-vertical'></div></div>",
                "responseDeclaration": {
                    "maxScore": 1,
                    "response1": {
                        "cardinality": "single",
                        "type": "integer",
                        "correctResponse": {
                            "value": "1",
                            "outcomes": {
                                "SCORE": 1
                            }
                        }
                    }
                },
                "interactionTypes": [
                    "choice"
                ],
                "interactions": {
                    "response1": {
                        "type": "choice",
                        "options": [{
                            "label": "<p>2 September 1929</p>",
                            "value": 0
                        },
                        {
                            "label": "<p>15 October 1931</p>",
                            "value": 1
                        },
                        {
                            "label": "<p>15 August 1923</p>",
                            "value": 2
                        },
                        {
                            "label": "<p>29 February 1936</p>",
                            "value": 3
                        }
                        ]
                    }
                },
                "editorState": {
                    "question": "<p>1. What does a dummy-variable regression analysis examine?</p><p><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure>",
                    "options": [
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one continuous independent variable</li></ol>",
                                "value": 0
                            }
                        },
                        {
                            "answer": true,
                            "value": {
                                "body": "<ol><li>The relationship between one categorical dependent and one continuous independent variable</li></ol>",
                                "value": 1
                            }
                        },
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one categorical independent variable</li></ol><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png\" alt=\"do_11310507846892748812026\" data-asset-variable=\"do_11310507846892748812026\"></figure>",
                                "value": 2
                            }
                        },
                        {
                            "answer": false,
                            "value": {
                                "body": "<ol><li>The relationship between one continuous dependent and one dichotomous variable</li></ol><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"(x%2Ba)%5En%3D%5Csum_%7Bk%3D0%7D%5En(%5Cfrac%7Bn_%7B%20%7D%7D%7Bk%7D)x%5Eka%5E%7Bn-k%7D\" advanced=\"false\"></figure>",
                                "value": 3
                            }
                        }
                    ],
                    "solutions": [
                        {
                            "id": "293d752e-844d-24c6-dd48-1ac78bb2793c",
                            "type": "video",
                            "value": "do_113143853080248320171"
                        }
                    ]
                },
                "status": "Draft",
                "media": [
                    {
                        "id": "do_11310507846892748812026",
                        "type": "image",
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png",
                        "baseUrl": "https://dock.sunbirded.org"
                    },
                    {
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143853080248320171/artifact/1604474270424.thumb.png",
                        "type": "image",
                        "id": "video_do_113143853080248320171"
                    },
                    {
                        "id": "do_113143853080248320171",
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113143853080248320171/13mb.mp4",
                        "type": "video",
                        "assetId": "do_113143853080248320171",
                        "name": "13mb",
                        "thumbnail": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143853080248320171/artifact/1604474270424.thumb.png"
                    }
                ],
                "qType": "MCQ",
                "mimeType": "application/vnd.ekstep.qml-archive",
                "primaryCategory": "Multiple Choice Question",
                "solutions": [
                    {
                        "id": "293d752e-844d-24c6-dd48-1ac78bb2793c",
                        "type": "video",
                        "value": "do_113143853080248320171"
                    }
                ]
            },
            {
                "code": "questionId",
                "media": [{
                        "id": "do_11310507846892748812026",
                        "type": "image",
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png",
                        "baseUrl": "https://dock.sunbirded.org"
                    },
                    {
                        "id": "do_11318931140144332811620",
                        "type": "image",
                        "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11318931140144332811620/artifact/i.png",
                        "baseUrl": "https://dock.sunbirded.org"
                    }
                ],
                "body": "<p>capital of india is?&nbsp;</p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png\" alt=\"do_11310507846892748812026\" data-asset-variable=\"do_11310507846892748812026\"></figure>",
                "editorState": {
                    "answer": "<p>new delhi&nbsp;</p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11318931140144332811620/artifact/i.png\" alt=\"do_11318931140144332811620\" data-asset-variable=\"do_11318931140144332811620\"></figure>",
                    "question": "<p>capital of india is?&nbsp;</p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310507846892748812026/artifact/icon.png\" alt=\"do_11310507846892748812026\" data-asset-variable=\"do_11310507846892748812026\"></figure>",
                    "solutions": [{
                        "id": "6f1efbba-82cb-7847-2868-409f8b58bf10",
                        "type": "html",
                        "value": "<p>New Delhi is the solution&nbsp;</p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11318931140144332811620/artifact/i.png\" alt=\"do_11318931140144332811620\" data-asset-variable=\"do_11318931140144332811620\"></figure>"
                    }]
                },
                "primaryCategory": "Subjective Question",
                "identifier": "do_113192172820889600114",
                "solutions": [{
                    "id": "6f1efbba-82cb-7847-2868-409f8b58bf10",
                    "type": "html",
                    "value": "<p>New Delhi is the solution&nbsp;</p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11318931140144332811620/artifact/i.png\" alt=\"do_11318931140144332811620\" data-asset-variable=\"do_11318931140144332811620\"></figure>"
                }],
                "qType": "SA",
                "languageCode": [
                    "en"
                ],
                "answer": "<p>new delhi&nbsp;</p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11318931140144332811620/artifact/i.png\" alt=\"do_11318931140144332811620\" data-asset-variable=\"do_11318931140144332811620\"></figure>",
                "name": "Subjective"
            },
            {
                "code": "UUID",
                "responseDeclaration": {
                  
                },
                "media": [
                  {
                    "id": "do_11310514452158873612374",
                    "type": "image",
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310514452158873612374/artifact/800px-pizigani_1367_chart_10mb.jpg",
                    "baseUrl": "https://dock.sunbirded.org"
                  },
                  {
                    "id": "do_11310521238735257612388",
                    "type": "image",
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310521238735257612388/artifact/800px-pizigani_1367_chart_10mb.jpg",
                    "baseUrl": "https://dock.sunbirded.org"
                  },
                  {
                    "id": "do_11310493520062873611557",
                    "type": "image",
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11310493520062873611557/artifact/800px-pizigani_1367_chart_10mb.jpg",
                    "baseUrl": "https://dock.sunbirded.org"
                  },
                  {
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143855600418816181/artifact/1604474581720.thumb.png",
                    "type": "image",
                    "id": "video_do_113143855600418816181"
                  },
                  {
                    "id": "do_113143855600418816181",
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113143855600418816181/13mb.mp4",
                    "type": "video",
                    "assetId": "do_113143855600418816181",
                    "name": "13mb",
                    "thumbnail": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143855600418816181/artifact/1604474581720.thumb.png"
                  },
                  {
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143855600418816181/artifact/1604474581720.thumb.png",
                    "type": "image",
                    "id": "video_do_113143855600418816181"
                  },
                  {
                    "id": "do_113143855600418816181",
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/assets/do_113143855600418816181/13mb.mp4",
                    "type": "video",
                    "assetId": "do_113143855600418816181",
                    "name": "13mb",
                    "thumbnail": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143855600418816181/artifact/1604474581720.thumb.png"
                  },
                  {
                    "id": "do_11318931140144332811620",
                    "type": "image",
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11318931140144332811620/artifact/i.png",
                    "baseUrl": "https://dock.sunbirded.org"
                  }
                ],
                "body": "<p>question (solution has video in tis question)&nbsp;</p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure>",
                "editorState": {
                  "answer": "<p>answer&nbsp;</p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11318931140144332811620/artifact/i.png\" alt=\"do_11318931140144332811620\" data-asset-variable=\"do_11318931140144332811620\"></figure>",
                  "question": "<p>question&nbsp;</p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure>",
                  "solutions": [
                    {
                      "id": "56de89ee-2da9-3db0-de36-dea9f5856cb2",
                      "type": "video",
                      "value": "do_113143855600418816181"
                    }
                  ]
                },
                "templateId": "",
                "interactions": {
                  
                },
                "primaryCategory": "Subjective Question",
                "identifier": "do_113188021231157248116",
                "solutions": [
                  {
                    "id": "56de89ee-2da9-3db0-de36-dea9f5856cb2",
                    "type": "video",
                    "value": "do_113143855600418816181"
                  }
                ],
                "qType": "SA",
                "languageCode": [
                  "en"
                ],
                "answer": "<p>answer&nbsp;</p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_11318931140144332811620/artifact/i.png\" alt=\"do_11318931140144332811620\" data-asset-variable=\"do_11318931140144332811620\"></figure>",
                "name": "Subjective"
            },
            {
                "responseDeclaration": {
                    "maxScore": 1,
                  "response1": {
                    "cardinality": "single",
                    "type": "integer",
                    "correctResponse": {
                      "value": "1",
                      "outcomes": {
                        "SCORE": 1
                      }
                    }
                  }
                },
                "mimeType": "application/vnd.sunbird.question",
                "media": [
                  {
                    "id": "do_113143851323514880165",
                    "type": "image",
                    "src": "https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143851323514880165/artifact/icon24.png",
                    "baseUrl": "https://dock.sunbirded.org"
                  }
                ],
                "body": "<div class='question-body'><div class='mcq-title'><p>MCQ solution html</p></div><div data-choice-interaction='response1' class='mcq-vertical'></div></div>",
                "editorState": {
                  "options": [
                    {
                      "answer": false,
                      "value": {
                        "body": "<p>Option 111</p>",
                        "value": 0
                      }
                    },
                    {
                      "answer": true,
                      "value": {
                        "body": "<p>Option 222<br><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143851323514880165/artifact/icon24.png\" alt=\"do_113143851323514880165\" data-asset-variable=\"do_113143851323514880165\"></figure>",
                        "value": 1
                      }
                    },
                    {
                      "answer": false,
                      "value": {
                        "body": "<p>Option 333</p>",
                        "value": 2
                      }
                    },
                    {
                      "answer": false,
                      "value": {
                        "body": "<p>Option 444</p>",
                        "value": 3
                      }
                    }
                  ],
                  "question": "<p>MCQ solution html</p>",
                  "solutions": [
                    {
                      "id": "d418da85-529f-6ae3-6f5b-4394c57a84b7",
                      "type": "html",
                      "value": "<p>This is solution&nbsp;<br><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure><p><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143851323514880165/artifact/icon24.png\" alt=\"do_113143851323514880165\" data-asset-variable=\"do_113143851323514880165\"></figure>"
                    }
                  ]
                },
                "templateId": "mcq-vertical",
                "interactions": {
                  "response1": {
                    "type": "choice",
                    "options": [
                      {
                        "label": "<p>Option 111</p>",
                        "value": 0
                      },
                      {
                        "label": "<p>Option 222<br><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143851323514880165/artifact/icon24.png\" alt=\"do_113143851323514880165\" data-asset-variable=\"do_113143851323514880165\"></figure>",
                        "value": 1
                      },
                      {
                        "label": "<p>Option 333</p>",
                        "value": 2
                      },
                      {
                        "label": "<p>Option 444</p>",
                        "value": 3
                      }
                    ]
                  }
                },
                "primaryCategory": "Multiple Choice Question",
                "identifier": "do_113193463656955904143",
                "solutions": [
                  {
                    "id": "d418da85-529f-6ae3-6f5b-4394c57a84b7",
                    "type": "html",
                    "value": "<p>This is solution&nbsp;<br><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"data:image/png;base64,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\" data-mathtext=\"A%3D%5Cpi%20r%5E2\" advanced=\"false\"></figure><p><br data-cke-filler=\"true\"></p><figure class=\"image\"><img src=\"https://dockstorage.blob.core.windows.net/sunbird-content-dock/content/do_113143851323514880165/artifact/icon24.png\" alt=\"do_113143851323514880165\" data-asset-variable=\"do_113143851323514880165\"></figure>"
                  }
                ],
                "qType": "MCQ",
                "languageCode": [
                  "en"
                ],
                "interactionTypes": [
                  "choice"
                ],
                "answer": "1",
                "name": "Multiple Choice"
              }
        ]
    }
  };
    this.playerType = null;
    const formReadInputParams = {
      formType: 'content',
      formAction: 'play',
      contentType: 'player'
    };
    this.formService.getFormConfig(formReadInputParams).subscribe(
      (data: any) => {

        // Needs to be removed
        data = [{ "type": "video-player", "version": 2, "mimeType": ["video/mp4", "video/webm"] }, { "type": "pdf-player", "version": 2, "mimeType": ["application/pdf"] }, { "type": "epub-player", "version": 2, "mimeType": ["application/epub"] }, { "type": "quml-player", "version": 2, "mimeType": ["application/vnd.sunbird.questionset", "application/vnd.ekstep.plugin-archive"] }];


        let isNewPlayer = false;
        _.forEach(data, (value) => {
          if (_.includes(_.get(value, 'mimeType'), this.playerConfig.metadata.mimeType) && _.get(value, 'version') === 2) {
            this.playerType = _.get(value, 'type');
            isNewPlayer = true;
            // if (this.playerConfig.metadata.mimeType === 'application/vnd.sunbird.questionset') {
            // if (this.playerConfig.metadata.mimeType === 'application/vnd.ekstep.plugin-archive') {

              

              
            // isNewPlayer = true;

            // } else {
            //   isNewPlayer = true;
            // }


            
          }
        });

        if (isNewPlayer) {
          this.playerLoaded = false;
          this.loadNewPlayer();
        } else {
          this.loadOldPlayer();
        }
      },
      (error) => {
        this.loadOldPlayer();
      }
    );
  }

  loadOldPlayer() {
    this.showNewPlayer = false;
    if (this.isDesktopApp) {
      this.updateMetadataForDesktop();
      const downloadStatus = Boolean(_.get(this.playerConfig, 'metadata.desktopAppMetadata.isAvailable'));
      let playerUrl = this.configService.appConfig.PLAYER_CONFIG.localBaseUrl;
      if (!downloadStatus) {
        playerUrl = `${playerUrl}webview=true`;
      }
      this.loadDefaultPlayer(playerUrl);
      return;
    }
    if (this.isMobileOrTab) {
      this.rotatePlayer();
    }
    if (this.previewCdnUrl !== '' && (this.isCdnWorking).toLowerCase() === 'yes') {
      this.loadCdnPlayer();
      return;
    }

    this.loadDefaultPlayer();
  }

  loadNewPlayer() {
    const downloadStatus = Boolean(_.get(this.playerConfig, 'metadata.desktopAppMetadata.isAvailable'));
    const artifactUrl = _.get(this.playerConfig, 'metadata.artifactUrl');
    if (downloadStatus && artifactUrl && !_.startsWith(artifactUrl, 'http://')) {
      this.playerConfig.metadata.artifactUrl = `${location.origin}/${artifactUrl}`;
    }
    this.addUserDataToContext();
    if (this.isMobileOrTab) {
      this.isFullScreenView = true;
      this.rotatePlayer();
    }
    this.showNewPlayer = true;
  }

  // Update ArtifactUrl for old Player
  updateMetadataForDesktop() {
    const downloadStatus = Boolean(_.get(this.playerConfig, 'metadata.desktopAppMetadata.isAvailable'));
    if (downloadStatus) {
      this.playerConfig.data = '';
      if (_.get(this.playerConfig, 'metadata.artifactUrl')
        && _.includes(OFFLINE_ARTIFACT_MIME_TYPES, this.playerConfig.metadata.mimeType)) {
        const artifactFileName = this.playerConfig.metadata.artifactUrl.split('/');
        this.playerConfig.metadata.artifactUrl = artifactFileName[artifactFileName.length - 1];
      }
    }
  }

  /**
   * Adjust player height after load
   */
  adjustPlayerHeight() {
    const playerWidth = $('#contentPlayer').width();
    if (playerWidth) {
      let height = playerWidth * (9 / 16);
      if (_.get(screen, 'orientation.type') === 'landscape-primary' && this.isMobileOrTab) {
        height = window.innerHeight;
      }
      $('#contentPlayer').css('height', height + 'px');
    }
  }

  generateScoreSubmitEvent(event: any) {
    if (event.data.toLowerCase() === (this.CONSTANT.ACCESSEVENT).toLowerCase()) {
      this.questionScoreSubmitEvents.emit(event);
    }
    if (event.data.toLowerCase() === (this.CONSTANT.ISLASTATTEMPT).toLowerCase()) {
      this.selfAssessLastAttempt.emit(event);
    }
    if (event.data.toLowerCase() === (this.CONSTANT.MAXATTEMPT).toLowerCase()) {
      this.selfAssessLastAttempt.emit(event);
    }
  }
  eventHandler(event) {
    if (_.get(event, 'edata.type') === 'SHARE') {
      this.contentUtilsServiceService.contentShareEvent.emit('open');
      this.mobileViewDisplay = 'none';
    }
    if (_.get(event, 'edata.type') === 'PRINT') {
      let windowFrame = window.document.querySelector('pdf-viewer iframe');
      if (windowFrame) {
        windowFrame['contentWindow'].print()
      }
      this.mobileViewDisplay = 'none';
    }
  }

  generateContentReadEvent(event: any, newPlayerEvent?) {
    if (!event) {
      return;
    }
    if (newPlayerEvent) {
      event = { detail: {telemetryData: event}};
    }
    const eid = event.detail.telemetryData.eid;
    if (eid && (eid === 'START' || eid === 'END')) {
      this.showRatingPopup(event);
      if (this.contentProgressEvents$) {
        this.contentProgressEvents$.next(event);
      }
    } else if (eid && (eid === 'IMPRESSION')) {
      this.emitSceneChangeEvent();
    }
    if (eid && (eid === 'ASSESS') || eid === 'START' || eid === 'END') {
      this.assessmentEvents.emit(event);
    }
  }
  emitSceneChangeEvent(timer = 0) {
    setTimeout(() => {
      if (_.get(this, 'contentIframe.nativeElement')) {
        const stageId = this.contentIframe.nativeElement.contentWindow.EkstepRendererAPI.getCurrentStageId();
        const eventData = { stageId };
        this.sceneChangeEvent.emit(eventData);
      }
    }, timer); // waiting for player to load, then fetching stageId (if we dont wait stageId will be undefined)
  }

  showRatingPopup(event) {
    let contentProgress;
    const playerSummary: Array<any> = _.get(event, 'detail.telemetryData.edata.summary');
    if (playerSummary) {
      const contentMimeType = this.playerConfig.metadata.mimeType;
      contentProgress = CsContentProgressCalculator.calculate(playerSummary, contentMimeType);
    }
    if (event.detail.telemetryData.eid === 'END' && contentProgress === 100) {
      this.contentRatingModal = !this.isFullScreenView;
      this.showRatingModalAfterClose = true;
      if (this.modal) {
        this.modal.showContentRatingModal = true;
      }
    }
  }

  /**
   * this method will handle play button click and turn the player into landscape
   */
  enablePlayer(mode: boolean) {
    this.showPlayIcon = mode;
    this.loadPlayer();
  }

  /** this method checks for the browser capability to be fullscreen via if-else ladder
   * if match found, it will turn the player along will be close button into fullscreen and then
   * rotate it to landscape mode
   */
  rotatePlayer() {
    setTimeout(() => {
      const playVideo: any = document.querySelector('#playerFullscreen');
      try {
        if (playVideo.requestFullscreen) {
          playVideo.requestFullscreen();
        } else if (playVideo.mozRequestFullScreen) { /* Firefox */
          playVideo.mozRequestFullScreen();
        } else if (playVideo.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
          playVideo.webkitRequestFullscreen();
        } else if (playVideo.msRequestFullscreen) { /* IE/Edge */
          playVideo.msRequestFullscreen();
        }
        screen.orientation.lock('landscape');
      } catch (error) {}
    });
  }

  /** when user clicks on close button
   * this method will let the player to exit from fullscreen mode and
   * 1. video thumbnail will be shown for single content
   * 2. content-details page will be shown ( for multi-result dial-code search flow)
   */
  closeFullscreen() {
    /** to exit the fullscreen mode */
    if (document['exitFullscreen']) {
      document['exitFullscreen']();
    } else if (document['mozCancelFullScreen']) { /* Firefox */
      document['mozCancelFullScreen']();
    } else if (document['webkitExitFullscreen']) { /* Chrome, Safari and Opera */
      document['webkitExitFullscreen']();
    } else if (document['msExitFullscreen']) { /* IE/Edge */
      document['msExitFullscreen']();
    }

    if (this.showRatingModalAfterClose) {
      this.contentRatingModal = true;
      if (this.modal) {
        this.modal.showContentRatingModal = true;
      }
    }
     /** to change the view of the content-details page */
    this.showPlayIcon = true;
    this.closePlayerEvent.emit();
  }

  setTelemetryData() {
    this.closeButtonInteractEdata = {
      id: 'player-close-button',
      type: 'click',
      pageid: this.pageId
    };

    this.loadPlayerInteractEdata = {
      id: 'play-button',
      type: 'click',
      pageid: this.pageId
    };
  }

  closeContentFullScreen() {
    this.navigationHelperService.emitFullScreenEvent(false);
    this.loadPlayer();
  }

  closeModal() {
    this.ratingPopupClose.emit({});
  }

  public addUserDataToContext() {
    this.playerConfig.context['userData'] = { firstName: 'anonymous', lastName: 'anonymous' };
    if (this.userService.loggedIn) {
      this.userService.userData$.subscribe((user: any) => {
        if (user && !user.err) {
          const userProfile = user.userProfile;
          this.playerConfig.context['userData'] = {
            firstName: userProfile.firstName ? userProfile.firstName : 'anonymous',
            lastName: userProfile.lastName ? userProfile.lastName : 'anonymous'
          };
        }
      });
    }
  }

  ngOnDestroy() {
    const playerElement = _.get(this.contentIframe, 'nativeElement');
    if (playerElement) {
      if (_.get(playerElement, 'contentWindow.telemetry_web.tList.length')) {
        const request = {
          url: this.configService.urlConFig.URLS.TELEMETRY.SYNC,
          data: {
            'id': 'api.sunbird.telemetry',
            'ver': '3.0',
            'events': playerElement.contentWindow.telemetry_web.tList.map(item => JSON.parse(item))
          }
        };
        this.contentService.post(request).subscribe();
      }
      playerElement.remove();
    }
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
