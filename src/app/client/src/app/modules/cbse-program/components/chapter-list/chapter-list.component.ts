import { Component, OnInit, Input, EventEmitter, Output, OnChanges, ChangeDetectorRef } from '@angular/core';
import { PublicDataService, UserService, CollectionHierarchyAPI, ActionService, ContentService } from '@sunbird/core';
import { ConfigService, ServerResponse, ContentData, ToasterService} from '@sunbird/shared';
import { TelemetryService } from '@sunbird/telemetry';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { CbseProgramService } from '../../services';
import { map, catchError } from 'rxjs/operators';
import { forkJoin, throwError } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { IChapterListComponentInput , ISelectedAttributes,
  IContentUploadComponentInput, IResourceTemplateComponentInput} from '../../interfaces';
import { QuestionListComponent } from '../../../cbse-program/components/question-list/question-list.component';
import { ContentUploaderComponent } from '../../components/content-uploader/content-uploader.component';
import { ProgramStageService } from '../../../program/services';
import { InitialState } from '../../interfaces';

interface IDynamicInput {
  contentUploadComponentInput?: IContentUploadComponentInput;
  resourceTemplateComponentInput?: IResourceTemplateComponentInput;
}

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent implements OnInit, OnChanges {

  @Input() chapterListComponentInput: IChapterListComponentInput;
  @Output() selectedQuestionTypeTopic = new EventEmitter<any>();

  public selectedAttributes: ISelectedAttributes;
  public role: any;
  public textBookChapters: Array<any> = [];
  private questionType: Array<any> = [];
  private textBookMeta: any;
  public hierarchyObj = {};
  public collectionHierarchy;
  public countData: Array<any> = [];
  public levelOneChapterList: Array<any> = [];
  public selectedChapterOption: any = {};
  public showResourceTemplatePopup = false;
  public showContentUploader = false;
  public templateDetails;
  public unitIdentifier;
  public collection: any;
  public showStage;
  public currentStage: any;
  public state: InitialState = {
    stages: []
  };
  public resourceTemplateComponentInput: IResourceTemplateComponentInput = {};

  public createdWorksheetIndentifier: any;
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

  telemetryImpression = {};
  public collectionData;
  showLoader = true;
  showError = false;
  public questionPattern: Array<any> = [];
  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    private userService: UserService, private contentService: ContentService, public actionService: ActionService,
    public telemetryService: TelemetryService, private cbseService: CbseProgramService,
    public toasterService: ToasterService, public router: Router,
    public programStageService: ProgramStageService, public activeRoute: ActivatedRoute, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log(this.chapterListComponentInput);
    this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.currentStage = 'chapterListComponent';
    this.selectedAttributes = _.get(this.chapterListComponentInput, 'selectedAttributes');
    this.role = _.get(this.chapterListComponentInput, 'role');
    this.collection  = _.get(this.chapterListComponentInput, 'collection');
    this.actions = _.get(this.chapterListComponentInput, 'entireConfig.actions');
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
    this.getCollectionHierarchy(this.selectedAttributes.collection, undefined);
    // clearing the selected questionId when user comes back from question list
    delete this.selectedAttributes['questionList'];

    this.dynamicOutputs = {
      uploadedContentMeta: (contentMeta) => {
        this.uploadHandler(contentMeta);
      }
    };
  }


  ngOnChanges(changed: any) {
    this.selectedAttributes = _.get(this.chapterListComponentInput, 'selectedAttributes');
    this.role = _.get(this.chapterListComponentInput, 'role');
  }

  public initiateInputs() {
    this.dynamicInputs = {
      contentUploadComponentInput: {
        selectedAttributes: this.selectedAttributes,
        unitIdentifier: this.unitIdentifier,
        templateDetails: this.templateDetails,
        resourceIdentifier : this.createdWorksheetIndentifier
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
        this.selectedAttributes.hierarchyObj = { hierarchy };
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
      'root': data.contentType === 'TextBook' ? true : false
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
          parentId: child.parent || null
        };
        const treeUnit = self.getUnitWithChildren(child, collectionId);
        const treeChildren = treeUnit && treeUnit.filter(item => item.contentType === 'TextBookUnit');
        const treeLeaf = treeUnit && treeUnit.filter(item => item.contentType !== 'TextBookUnit');
        treeItem['children'] = (treeChildren && treeChildren.length > 0) ? treeChildren : null;
        treeItem['leaf'] = (treeLeaf && treeLeaf.length > 0) ? treeLeaf : null;
        return treeItem;
      });
      return tree;
    }
  }

  onSelectChapterChange() {
    this.showLoader = true;
    this.getCollectionHierarchy(this.selectedAttributes.collection ,
      this.selectedChapterOption === 'all' ? undefined :  this.selectedChapterOption);
  }

  handleTemplateSelection(event) {
    if (_.isEmpty(event) || _.isEmpty(event.template)) { return; }
    this.createResource(event.templateDetails).subscribe((response: any) => {
      this.createdWorksheetIndentifier = _.get(response, 'result.content_id');
      this.linkResourceToHierarchy(this.createdWorksheetIndentifier).subscribe((res: any) => {
          this.handleTemplateComponent(event);
      });
    });
  }

  handleTemplateComponent(event) {
    this.showResourceTemplatePopup = false;
    if (event.template) {
      this.showContentUploader = true;
      this.templateDetails = event.templateDetails;
    }
    this.initiateInputs();
    this.creationComponent = this.componentMapping[event.template];
    this.programStageService.addStage(event.templateDetails.onClick);
  }

  showResourceTemplate(event) {
    this.unitIdentifier = event.collection.identifier;
    switch (event.action) {
      case 'delete':
         this.removeResourceToHierarchy(event.content.identifier, this.unitIdentifier);
         break;
      case 'beforeMove':
          this.showLargeModal = true;
          this.contentId = event.content;
          this.prevUnitSelect = event.collection.identifier;
          break;
      case 'afterMove':
          this.showLargeModal = false;
          this.unitIdentifier = '';
          this.contentId = ''; // Clearing selected unit/content details
          this.getCollectionHierarchy(this.selectedAttributes.collection, undefined);
          break;
      case 'cancelMove':
          this.showLargeModal = false;
          this.unitIdentifier = '';
          this.contentId = ''; // Clearing selected unit/content details
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
      this.addResourceToHierarchy(event.contentId);
    }
  }

  public addResourceToHierarchy(contentId) {
    const req = {
      url: this.configService.urlConFig.URLS.CONTENT.HIERARCHY_ADD,
      data: {
        'request': {
          'rootId': this.selectedAttributes.collection,
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
          'rootId': this.selectedAttributes.collection,
          'unitId': unitIdentifier,
          'children': [contentId]
        }
      }
    };
    this.actionService.delete(req).pipe(map(data => data.result), catchError(err => {
      return throwError('');
    })).subscribe(res => {
      console.log('result ', res);
      this.getCollectionHierarchy(this.selectedAttributes.collection, undefined);
    });
  }

  private createResource(content) {
    const option = {
      url: this.configService.urlConFig.URLS.CONTENT.CREATE,
      data: {
        'request': {
           'content': {
              'code': UUID.UUID(),
              'name': content.name,
              'description': content.description,
              'createdBy': this.userService.userid,
              'organisation': this.selectedAttributes.onBoardSchool ? [this.selectedAttributes.onBoardSchool] : [],
              'createdFor': [
                 'ORG_001'
              ],
              'contentType': content.contentType,
              'framework': this.selectedAttributes.framework,
              'mimeType': content.mimeType[0],
              'resourceType': content.resourceType,
              'creator': this.getUserName()
           }
        }
      }
    };
    return this.contentService.post(option).pipe(map((response) => {
      console.log(response);
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Resource creation failed. Please try again!' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  public linkResourceToHierarchy(contentId) {
    const req = {
      url: this.configService.urlConFig.URLS.CONTENT.HIERARCHY_ADD,
      data: {
        'request': {
          'rootId': this.selectedAttributes.collection,
          'unitId': this.unitIdentifier,
          'children': [contentId]
        }
      }
    };
    return this.actionService.patch(req).pipe(map((response) => {
      console.log(response);
      return response;
    }, err => {
      console.log(err);
    }), catchError(err => {
      const errInfo = { errorMsg: 'Resource linking failed. Please try again!' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  getUserName() {
    let userName = '';
    if (this.userService.userProfile.firstName) {
      userName = this.userService.userProfile.firstName;
    }
    if (this.userService.userProfile.lastName) {
      userName += (' ' + this.userService.userProfile.lastName);
    }
    return userName;
  }

}
