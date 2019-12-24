import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { ConfigService, ServerResponse, ContentData, ToasterService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { CbseProgramService } from '../../services';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IChapterListComponentInput , ISessionContext,
  IContentUploadComponentInput, IResourceTemplateComponentInput } from '../../interfaces';
import { QuestionListComponent } from '../../../cbse-program/components/question-list/question-list.component';
import { ContentUploaderComponent } from '../../components/content-uploader/content-uploader.component';
import { ProgramStageService } from '../../../program/services';
import { InitialState } from '../../interfaces';

interface IDynamicInput {
  contentUploadComponentInput?: IContentUploadComponentInput;
  resourceTemplateComponentInput?: IResourceTemplateComponentInput;
  practiceQuestionSetComponentInput?: any;
}

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() chapterListComponentInput: IChapterListComponentInput;
  @Output() selectedQuestionTypeTopic = new EventEmitter<any>();

  public sessionContext: ISessionContext;
  public role: any;
  public textBookChapters: Array<any> = [];
  private questionType: Array<any> = [];
  private textBookMeta: any;
  public hierarchyObj = {};
  public collectionHierarchy = [];
  public countData: Array<any> = [];
  public levelOneChapterList: Array<any> = [];
  public selectedChapterOption: any = {};
  public showResourceTemplatePopup = false;
  public templateDetails;
  public unitIdentifier;
  public collection: any;
  public showStage;
  public sharedContext: Array<string>;
  public currentStage: any;
  public selectedSharedContext: any;
  public state: InitialState = {
    stages: []
  };
  public resourceTemplateComponentInput: IResourceTemplateComponentInput = {};

  prevUnitSelect: string;
  contentId: string;
  showLargeModal: boolean;
  // private labels: Array<string>;
  private actions: any;
  private componentMapping = {
    ExplanationResource: ContentUploaderComponent,
    ExperientialResource: ContentUploaderComponent,
    PracticeQuestionSet: QuestionListComponent,
    CuriosityQuestionSet: QuestionListComponent,
  };
  public dynamicInputs: IDynamicInput;
  public dynamicOutputs: any;
  public creationComponent;
  public stageSubscription: any;
  public programContext: any;
  public currentUserID: string;
  telemetryImpression = {};
  public collectionData;
  showLoader = true;
  showError = false;
  public questionPattern: Array<any> = [];
  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    private userService: UserService, public actionService: ActionService,
    public telemetryService: TelemetryService, private cbseService: CbseProgramService,
    public toasterService: ToasterService, public router: Router,
    public programStageService: ProgramStageService, public activeRoute: ActivatedRoute, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.stageSubscription =  this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.currentStage = 'chapterListComponent';
    this.sessionContext = _.get(this.chapterListComponentInput, 'sessionContext');
    this.programContext = _.get(this.chapterListComponentInput, 'programContext');
    this.currentUserID = _.get(this.programContext, 'userDetails.userId');
    this.role = _.get(this.chapterListComponentInput, 'role');
    this.collection  = _.get(this.chapterListComponentInput, 'collection');
    this.actions = _.get(this.chapterListComponentInput, 'programContext.config.actions');
    this.sharedContext = _.get(this.chapterListComponentInput, 'programContext.config.sharedContext');
    /**
     * @description : this will fetch question Category configuration based on currently active route
     */

    this.telemetryImpression = {
      context: {
        env: 'cbse_program'
      },
      edata: {
        type: 'view',
        pageid: 'chapterlist',
        uri: this.router.url,
      }
    };
    this.levelOneChapterList.push({
      identifier: 'all',
      name: 'All Chapters'
    });

    this.selectedChapterOption = 'all';
    this.getCollectionHierarchy(this.sessionContext.collection, undefined);
    // clearing the selected questionId when user comes back from question list
    delete this.sessionContext['questionList'];

    this.dynamicOutputs = {
      uploadedContentMeta: (contentMeta) => {
        this.uploadHandler(contentMeta);
      }
    };
  }


  ngOnChanges(changed: any) {
    this.sessionContext = _.get(this.chapterListComponentInput, 'sessionContext');
    this.role = _.get(this.chapterListComponentInput, 'role');
  }

  public initiateInputs(action?) {
    this.dynamicInputs = {
      contentUploadComponentInput: {
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        templateDetails: this.templateDetails,
        selectedSharedContext: this.selectedSharedContext,
        contentIdentifier: this.contentId,
        action: action
      },
      practiceQuestionSetComponentInput: {
        sessionContext: this.sessionContext,
        templateDetails: this.templateDetails,
        role: this.role
      }
    };
  }
  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage  = _.last(this.state.stages).stage;
    }
  }

  public getCollectionHierarchy(identifier: string, unitIdentifier: string) {
    const instance = this;
    let hierarchy;
    let hierarchyUrl = 'content/v3/hierarchy/' + identifier;
    if (unitIdentifier) {
      hierarchyUrl = hierarchyUrl + '/' + unitIdentifier;
    }
    const req = {
      url: hierarchyUrl,
      param: { 'mode': 'edit' }
    };
    this.actionService.get(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Fetching TextBook details failed' }; this.showLoader = false;
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
      .subscribe((response) => {
        this.collectionData = response.result.content;
        const textBookMetaData = [];
        instance.countData['total'] = 0;
        instance.countData['review'] = 0;
        instance.countData['reject'] = 0;
        instance.countData['mycontribution'] = 0;
        this.collectionHierarchy = this.getUnitWithChildren(this.collectionData, identifier);
        hierarchy = instance.hierarchyObj;
        this.sessionContext.hierarchyObj = { hierarchy };
        this.showLoader = false;
        this.showError = false;
      });
  }

  getUnitWithChildren(data, collectionId) {
    const self = this;
    this.hierarchyObj[data.identifier] = {
      'name': data.name,
      'contentType': data.contentType,
      'children': _.map(data.children, (child) => {
        return child.identifier;
      }),
      'root': data.contentType === 'TextBook' ? true : false,
    };
    if (data.contentType !== 'TextBook' && data.contentType !== 'TextBookUnit') {
      this.countData['total'] = this.countData['total'] + 1;
      if (data.status === 'Review') {
        this.countData['review'] = this.countData['review'] + 1;
      }
    }
    const childData = data.children;
    if (childData) {
      const tree = childData.map(child => {
        const meta = _.pick(child, this.sharedContext);
        if (child.parent && child.parent === collectionId) {
          self.levelOneChapterList.push({
            identifier: child.identifier,
            name: child.name
          });
        }
        const treeItem = {
          identifier: child.identifier,
          name: child.name,
          contentType: child.contentType,
          topic: child.topic,
          status: child.status,
          creator: child.creator,
          createdBy: child.createdBy || null,
          parentId: child.parent || null,
          sharedContext: {
            ...meta
          }
        };
        const treeUnit = self.getUnitWithChildren(child, collectionId);
        const treeChildren = treeUnit && treeUnit.filter(item => item.contentType === 'TextBookUnit');
        const treeLeaf = treeUnit && treeUnit.filter(item => item.contentType !== 'TextBookUnit');
        treeItem['children'] = (treeChildren && treeChildren.length > 0) ? treeChildren : null;

        if (treeLeaf && treeLeaf.length > 0) {
          treeItem['leaf'] =  this.getContentVisibility(treeLeaf);
        }
        return treeItem;
      });
      return tree;
    }
  }
  getContentVisibility(branch) {
    const leafNodes = [];
    _.forEach(branch, (leaf) => {
      const contentVisibility = this.shouldContentBeVisible(leaf);
      leaf['visibility'] = contentVisibility;
      leafNodes.push(leaf);
    });
    return leafNodes;
  }

  shouldContentBeVisible(content) {
    const creatorViewRole = this.actions.showCreatorView.roles.includes(this.sessionContext.currentRoleId);
    const reviewerViewRole = this.actions.showReviewerView.roles.includes(this.sessionContext.currentRoleId);
      if (reviewerViewRole && content.status === 'Review'  && this.currentUserID !== content.createdBy) {
        return true;
      } else if (creatorViewRole && this.currentUserID === content.createdBy) {
        return true;
      }
  return false;
  }

  onSelectChapterChange() {
    this.showLoader = true;
    this.getCollectionHierarchy(this.sessionContext.collection ,
      this.selectedChapterOption === 'all' ? undefined :  this.selectedChapterOption);
  }

  handleTemplateSelection(event) {
    this.showResourceTemplatePopup = false;
    if (event.template) {
      this.templateDetails = event.templateDetails;
      let creator = this.userService.userProfile.firstName;
      if (!_.isEmpty(this.userService.userProfile.lastName)) {
        creator = this.userService.userProfile.firstName + ' ' + this.userService.userProfile.lastName;
      }
      const reqBody = this.sharedContext.reduce((obj, context) => {
        return {...obj, [context]: this.selectedSharedContext[context] || this.sessionContext[context]};
      }, {});
      const option = {
        url: `content/v3/create`,
        data: {
          request: {
            content: {
              'name': this.templateDetails.metadata.name,
              'code': UUID.UUID(),
              'mimeType': this.templateDetails.mimeType[0],
              'createdBy': this.userService.userid,
              'contentType': this.templateDetails.metadata.contentType,
              'resourceType': this.templateDetails.metadata.resourceType || 'Learn',
              'creator': creator,
              ...reqBody
              // 'framework': this.sessionContext.framework,
              // 'organisation': this.sessionContext.onBoardSchool ? [this.sessionContext.onBoardSchool] : [],

            }
          }
        }
      };
      this.actionService.post(option).pipe(map(res => res.result), catchError(err => {
        const errInfo = { errorMsg: 'Unable to create contentId, Please Try Again' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }))
      .subscribe(result => {
        this.addResourceToHierarchy(result.node_id);
        this.contentId = result.node_id;
        // tslint:disable-next-line:max-line-length
        this.componentLoadHandler('creation', this.componentMapping[event.templateDetails.metadata.contentType], event.templateDetails.onClick);
      });
    }
  }

  handlePreview(event) {
    const templateList = _.get(this.chapterListComponentInput.config, 'config.contentTypes.value')
    || _.get(this.chapterListComponentInput.config, 'config.contentTypes.defaultValue');
    this.templateDetails = _.find(templateList, (templateData) => {
      return templateData.metadata.contentType === event.content.contentType;
    });
    this.componentLoadHandler('preview', this.componentMapping[event.content.contentType], this.templateDetails.onClick);
  }

  componentLoadHandler(action, component, componentName) {
    this.initiateInputs(action);
    this.creationComponent = component;
    this.programStageService.addStage(componentName);
  }


  showResourceTemplate(event) {
    this.unitIdentifier = event.collection.identifier;
    this.selectedSharedContext = event.collection.sharedContext;
    switch (event.action) {
      case 'delete':
         this.removeResourceToHierarchy(event.content.identifier, this.unitIdentifier);
         break;
      case 'beforeMove':
          this.showLargeModal = true;
          this.contentId = event.content.identifier;
          this.prevUnitSelect = event.collection.identifier;
          break;
      case 'afterMove':
          this.showLargeModal = false;
          this.unitIdentifier = '';
          this.contentId = ''; // Clearing selected unit/content details
          this.getCollectionHierarchy(this.sessionContext.collection, undefined);
          break;
      case 'cancelMove':
          this.showLargeModal = false;
          this.unitIdentifier = '';
          this.contentId = ''; // Clearing selected unit/content details
          break;
      case 'preview':
          this.contentId = event.content.identifier;
          this.handlePreview(event);
          break;
      default:
          this.showResourceTemplatePopup = event.showPopup;
        break;
    }
    this.resourceTemplateComponentInput =  {
    templateList:  _.get(this.chapterListComponentInput.config, 'config.contentTypes.value')
      || _.get(this.chapterListComponentInput.config, 'config.contentTypes.defaultValue')
    };
  }

  emitQuestionTypeTopic(type, topic, topicIdentifier, resourceIdentifier, resourceName) {
    this.selectedQuestionTypeTopic.emit({
      'questionType': type,
      'topic': topic,
      'textBookUnitIdentifier': topicIdentifier,
      'resourceIdentifier': resourceIdentifier || false,
      'resourceName': resourceName
    });
  }

  uploadHandler(event) {
    if (event.contentId) {
      // this.addResourceToHierarchy(event.contentId);
    }
  }

  public addResourceToHierarchy(contentId) {
    const req = {
      url: this.configService.urlConFig.URLS.CONTENT.HIERARCHY_ADD,
      data: {
        'request': {
          'rootId': this.sessionContext.collection,
          'unitId': this.unitIdentifier,
          'children': [contentId]
        }
      }
    };
    this.actionService.patch(req).pipe(map(data => data.result), catchError(err => {
      return throwError('');
    })).subscribe(res => {
      console.log('result ', res);
    });
  }

  public removeResourceToHierarchy(contentId, unitIdentifier) {
    const req = {
      url: this.configService.urlConFig.URLS.CONTENT.HIERARCHY_REMOVE,
      data: {
        'request': {
          'rootId': this.sessionContext.collection,
          'unitId': unitIdentifier,
          'children': [contentId]
        }
      }
    };
    this.actionService.delete(req).pipe(map(data => data.result), catchError(err => {
      return throwError('');
    })).subscribe(res => {
      console.log('result ', res);
      this.getCollectionHierarchy(this.sessionContext.collection, undefined);
    });
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
