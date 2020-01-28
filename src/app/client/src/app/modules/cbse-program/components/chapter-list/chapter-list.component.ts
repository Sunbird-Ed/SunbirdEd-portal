import { Component, OnInit, Input, EventEmitter, Output, OnChanges, OnDestroy, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { ConfigService, ServerResponse, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { CbseProgramService } from '../../services';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IChapterListComponentInput, ISessionContext,
  IContentUploadComponentInput, IResourceTemplateComponentInput
} from '../../interfaces';
import { QuestionListComponent } from '../../../cbse-program/components/question-list/question-list.component';
import { ContentUploaderComponent } from '../../components/content-uploader/content-uploader.component';
import { ProgramStageService, ProgramComponentsService } from '../../../program/services';
import { InitialState } from '../../interfaces';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';

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
export class ChapterListComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

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
  telemetryImpression: any;
  public collectionData;
  showLoader = true;
  showError = false;
  public questionPattern: Array<any> = [];
  showConfirmationModal = false;
  public telemetryPageId = 'chapter-list';
  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    private userService: UserService, public actionService: ActionService,
    public telemetryService: TelemetryService, private cbseService: CbseProgramService,
    public toasterService: ToasterService, public router: Router,
    public programStageService: ProgramStageService, public programComponentsService: ProgramComponentsService,
    public activeRoute: ActivatedRoute, private ref: ChangeDetectorRef,
    private collectionHierarchyService: CollectionHierarchyService, private resourceService: ResourceService,
    private navigationHelperService: NavigationHelperService) {
  }

  ngOnInit() {
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.currentStage = 'chapterListComponent';
    this.sessionContext = _.get(this.chapterListComponentInput, 'sessionContext');
    this.programContext = _.get(this.chapterListComponentInput, 'programContext');
    this.currentUserID = _.get(this.programContext, 'userDetails.userId');
    this.role = _.get(this.chapterListComponentInput, 'role');
    this.collection = _.get(this.chapterListComponentInput, 'collection');
    this.actions = _.get(this.chapterListComponentInput, 'programContext.config.actions');
    this.sharedContext = _.get(this.chapterListComponentInput, 'programContext.config.sharedContext');
    /**
     * @description : this will fetch question Category configuration based on currently active route
     */
    this.levelOneChapterList.push({
      identifier: 'all',
      name: 'All Chapters'
    });

    this.selectedChapterOption = 'all';
    this.updateAccordianView();
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

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = [{ 'type': 'Program', 'id': this.programContext.programId }];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}.programs`
          }
        },
        edata: {
          type: _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  async updateAccordianView(unitId?, onSelectChapterChange?) {
      await this.getCollectionHierarchy(this.sessionContext.collection,
                this.selectedChapterOption === 'all' ? undefined : this.selectedChapterOption);
    if (unitId) {
      this.lastOpenedUnit(unitId);
    } else if (onSelectChapterChange === true && this.selectedChapterOption !== 'all') {
      this.lastOpenedUnit(this.selectedChapterOption);
    } else {
      this.lastOpenedUnit(this.collectionHierarchy[0].identifier);
    }
  }

  public initiateInputs(action?) {
    this.dynamicInputs = {
      contentUploadComponentInput: {
        config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.uploadComponent'}),
        sessionContext: this.sessionContext,
        unitIdentifier: this.unitIdentifier,
        templateDetails: this.templateDetails,
        selectedSharedContext: this.selectedSharedContext,
        contentId: this.contentId,
        action: action,
        programContext: _.get(this.chapterListComponentInput, 'programContext')
      },
      practiceQuestionSetComponentInput: {
        config: _.find(this.programContext.config.components, {'id': 'ng.sunbird.practiceSetComponent'}),
        sessionContext: this.sessionContext,
        templateDetails: this.templateDetails,
        unitIdentifier: this.unitIdentifier,
        role: this.role,
        selectedSharedContext: this.selectedSharedContext,
        contentIdentifier: this.contentId,
        action: action,
        programContext: _.get(this.chapterListComponentInput, 'programContext')
      }
    };
  }
  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
    if (this.currentStage === 'chapterListComponent') {
      this.updateAccordianView(this.unitIdentifier);
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
     return new Promise((resolve) => {
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
        instance.countData['totalreview'] = 0;
        instance.countData['awaitingreview'] = 0;
        this.collectionHierarchy = this.setCollectionTree(this.collectionData, identifier);
        hierarchy = instance.hierarchyObj;
        this.sessionContext.hierarchyObj = { hierarchy };
        this.showLoader = false;
        this.showError = false;
        this.levelOneChapterList = _.uniqBy(this.levelOneChapterList, 'identifier');
         resolve('Done');
      });
    });
  }

  setCollectionTree(data, identifier) {
    this.getContentStatusCount(data);
    if (data.contentType !== 'TextBook') {
      const rootMeta = _.pick(data, this.sharedContext);
      const rootTree = this.generateNodeMeta(data, rootMeta);
      const isFolderExist = _.find(data.children, (child) => {
        return child.contentType === 'TextBookUnit';
      });
      if (isFolderExist) {
        const children = this.getUnitWithChildren(data, identifier);
        const treeChildren = children && children.filter(item => item.contentType === 'TextBookUnit');
        const treeLeaf = children && children.filter(item => item.contentType !== 'TextBookUnit');
        rootTree['children'] = treeChildren || null;
        rootTree['leaf'] = this.getContentVisibility(treeLeaf) || null;
        return [rootTree];
      } else {
        rootTree['leaf'] = _.map(data.children, (child) => {
          const meta = _.pick(child, this.sharedContext);
          const treeItem = this.generateNodeMeta(child, meta);
          treeItem['visibility'] = this.shouldContentBeVisible(child);
          return treeItem;
        });
        return [rootTree];
      }
    } else {
      return this.getUnitWithChildren(data, identifier);
    }
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
        const treeItem = this.generateNodeMeta(child, meta);
        const treeUnit = self.getUnitWithChildren(child, collectionId);
        const treeChildren = treeUnit && treeUnit.filter(item => item.contentType === 'TextBookUnit');
        const treeLeaf = treeUnit && treeUnit.filter(item => item.contentType !== 'TextBookUnit');
        treeItem['children'] = (treeChildren && treeChildren.length > 0) ? treeChildren : null;
        if (treeLeaf && treeLeaf.length > 0) {
          treeItem['leaf'] = this.getContentVisibility(treeLeaf);
        }
        return treeItem;
      });
      return tree;
    }
  }

  getContentStatusCount(data) {
    const self = this;
    if (data.contentType !== 'TextBook' && data.contentType !== 'TextBookUnit') {
      this.countData['total'] = this.countData['total'] + 1;
      if (data.createdBy === this.currentUserID && data.status === 'Review') {
        this.countData['review'] = this.countData['review'] + 1;
      }
      if (data.createdBy === this.currentUserID && data.status === 'Draft' && data.prevStatus === 'Review') {
        this.countData['reject'] = this.countData['reject'] + 1;
      }
      if (data.createdBy === this.currentUserID && data.createdBy === this.currentUserID) {
        this.countData['mycontribution'] = this.countData['mycontribution'] + 1;
      }
      if (data.status === 'Review') {
        this.countData['totalreview'] = this.countData['totalreview'] + 1;
      }
      if (data.createdBy !== this.currentUserID && data.status === 'Review') {
        this.countData['awaitingreview'] = this.countData['awaitingreview'] + 1;
      }
    }
    const childData = data.children;
    if (childData) {
      childData.map(child => {
        self.getContentStatusCount(child);
      });
    }
  }

  generateNodeMeta(node, sharedMeta) {
   const nodeMeta =  {
      identifier: node.identifier,
      name: node.name,
      contentType: node.contentType,
      topic: node.topic,
      status: node.status,
      creator: node.creator,
      createdBy: node.createdBy || null,
      parentId: node.parent || null,
      prevStatus: node.prevStatus || null,
      sharedContext: {
        ...sharedMeta
      }
    };
    return nodeMeta;
  }

  getContentVisibility(branch) {
    const leafNodes = [];
    _.forEach(branch, (leaf) => {
      const contentVisibility = this.shouldContentBeVisible(leaf);
      leaf['visibility'] = contentVisibility;
      leafNodes.push(leaf);
    });
    return _.isEmpty(leafNodes) ? null : leafNodes;
  }

  shouldContentBeVisible(content) {
    const creatorViewRole = this.actions.showCreatorView.roles.includes(this.sessionContext.currentRoleId);
    const reviewerViewRole = this.actions.showReviewerView.roles.includes(this.sessionContext.currentRoleId);
    if (reviewerViewRole && content.status === 'Review' && this.currentUserID !== content.createdBy) {
      return true;
    } else if (creatorViewRole && this.currentUserID === content.createdBy) {
      return true;
    }
    return false;
  }

  onSelectChapterChange() {
    this.showLoader = true;
    this.updateAccordianView(undefined, true);
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
        return { ...obj, [context]: this.selectedSharedContext[context] || this.sessionContext[context] };
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
              ...(_.pickBy(reqBody, _.identity))
              // 'framework': this.sessionContext.framework,
              // 'organisation': this.sessionContext.onBoardSchool ? [this.sessionContext.onBoardSchool] : [],

            }
          }
        }
      };
      if (this.templateDetails.metadata.appIcon) {
        option.data.request.content.appIcon = this.templateDetails.metadata.appIcon;
      }
      this.actionService.post(option).pipe(map((res: any) => res.result), catchError(err => {
        const errInfo = { errorMsg: 'Unable to create contentId, Please Try Again' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }))
        .subscribe(result => {
          this.contentId = result.node_id;
          this.collectionHierarchyService.addResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, result.node_id)
            .subscribe(() => {
               // tslint:disable-next-line:max-line-length
               this.componentLoadHandler('creation', this.programComponentsService.getComponentInstance(event.templateDetails.onClick), event.templateDetails.onClick);
            });
        });
    }
  }

  handlePreview(event) {
    const templateList = _.get(this.chapterListComponentInput.config, 'config.contentTypes.value')
      || _.get(this.chapterListComponentInput.config, 'config.contentTypes.defaultValue');
    this.templateDetails = _.find(templateList, (templateData) => {
      return templateData.metadata.contentType === event.content.contentType;
    });
    this.componentLoadHandler('preview',
      this.programComponentsService.getComponentInstance(this.templateDetails.onClick), this.templateDetails.onClick);
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
        this.contentId = event.content.identifier;
        this.showConfirmationModal = true;
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
        this.updateAccordianView(event.collection.identifier);
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
    this.resourceTemplateComponentInput = {
      templateList: _.get(this.chapterListComponentInput.config, 'config.contentTypes.value')
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
      this.updateAccordianView(this.unitIdentifier);
    }
  }

  lastOpenedUnit(unitId) {
    this.collectionHierarchy.map((parentunit) => {
        if (parentunit.identifier === unitId) {
          this.sessionContext.lastOpenedUnitChild = unitId;
          this.sessionContext.lastOpenedUnitParent = parentunit.identifier;
          return;
        } else if (parentunit.children) {
          _.map(parentunit.children, (childUnit) => {
            if (childUnit.identifier === unitId) {
             this.sessionContext.lastOpenedUnitChild = childUnit.identifier;
             this.sessionContext.lastOpenedUnitParent = parentunit.identifier;
             return;
            }
          });
        }
    });
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
    this.actionService.patch(req).pipe(map((data: any) => data.result), catchError(err => {
      return throwError('');
    })).subscribe(res => {
      console.log('result ', res);
    });
  }

  removeResourceFromHierarchy() {
    this.collectionHierarchyService.removeResourceToHierarchy(this.sessionContext.collection, this.unitIdentifier, this.contentId)
       .subscribe(() => {
         this.showConfirmationModal = false;
         this.updateAccordianView(this.unitIdentifier);
        this.toasterService.success(this.resourceService.messages.smsg.m0064);
       });
  }


  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
