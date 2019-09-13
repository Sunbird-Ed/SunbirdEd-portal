import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { PublicDataService, UserService, CollectionHierarchyAPI, ActionService } from '@sunbird/core';
import { ConfigService, ServerResponse, ContentData, ToasterService } from '@sunbird/shared';
import { map } from 'rxjs/operators';
import * as $ from 'jquery';
import 'datatables.net';
import * as _ from 'lodash-es';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @Input() selectedAttributes: any;
  private textBookMeta: any;
  private questionType: Array<any> = [];
  public collectionData;
  public dtOptions: any = {};
  public hierarchyObj = {};
  textBookChapters;
  reports;
  table
  selectedReport;
  statusLabel
  headersTooltip: Array<any> = [];
  showLoader: boolean = false;
  category = 'vsa';
  questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question',
    curiosityquestion: 'Curiosity Question'
  };
  showCategory;


  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    private userService: UserService, public actionService: ActionService,
    public toasterService: ToasterService) { }

  ngOnInit() {

    this.reports = [{ name: 'Question Bank Status' }, { name: 'Textbook Status' }];
    this.selectedReport = this.reports[0].name;
    this.getCollectionHierarchy(this.selectedAttributes.textbook);

    this.questionType = ['vsa', 'sa', 'la', 'mcq', 'curiosityquestion'];

    this.showCategory = this.questionTypeName['vsa'];

    // this.dtOptions = {
    //   dom: 'Bfrtip',
    //   buttons: [
    //     'csv'
    //   ]
    // }
  }

  changeQuestionCategory(type) {
    this.showCategory = this.questionTypeName[type];
    this.category = type;
    // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    // saveAs(blob, "hello world.txt");
  }

  public getCollectionHierarchy(identifier: string) {
    let hierarchy;
    const req = {
      url: 'content/v3/hierarchy/' + identifier, // `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`,
      param: { 'mode': 'edit' }
    };
    this.showLoader = true;
    this.actionService.get(req).subscribe((response) => {
      this.collectionData = response.result.content;
      hierarchy = this.getHierarchyObj(this.collectionData);
      this.selectedAttributes.hierarchyObj = { hierarchy };
      const textBookMetaData = [];
      _.forEach(this.collectionData.children, data => {

        if (data.topic && data.topic[0]) {
          if (data.children) {
            let questionBankUnit: any;
            if (_.includes(this.questionType, 'curiosity')) {
              questionBankUnit = _.find(data.children, (val) => {
                return val.name === 'Curiosity Questions';
              });
            } else {
              questionBankUnit = _.find(data.children, (val) => {
                return val.name === 'Question Bank' || val.name === 'Practice Questions';
              });
            }
            textBookMetaData.push({
              name: data.name,
              topic: data.topic[0],
              identifier: questionBankUnit ? questionBankUnit.identifier : data.identifier
            });
          } else {
            textBookMetaData.push({
              name: data.name,
              topic: data.topic[0],
              identifier: data.identifier
            });
          }
        }
      });
      this.textBookMeta = textBookMetaData;
      this.dashboardApi(this.textBookMeta);
      console.log("textbookMeta no. of topics ---> ", this.textBookMeta);
    }, error => {

      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'Fetching TextBook details failed');
    });
  }

  public getHierarchyObj(data) {
    const instance = this;
    if (data.identifier) {
      this.hierarchyObj[data.identifier] = {
        'name': data.name,
        'contentType': data.contentType,
        'children': _.map(data.children, (child) => {
          return child.identifier;
        }),
        'root': data.contentType === 'TextBook' ? true : false
      };

      _.forEach(data.children, (collection) => {
        instance.getHierarchyObj(collection);
      });
    }

    return this.hierarchyObj;
  }

  public searchQuestionsByType(questionType?: string, createdBy?: string, status?: any) {
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          "filters": {
            "objectType": "AssessmentItem",
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.medium,
            'programId': this.selectedAttributes.programId,
            "status": []
          },
          "limit": 0,
          "aggregations": [
            {
              "l1": "topic",
              "l2": "category",
              "l3": "status"
            }
          ]
        }
      }
    };
    if (createdBy) {
      req.data.request.filters['createdBy'] = createdBy;
    }
    if (status) {
      req.data.request.filters['status'] = status;
      req.data.request.filters['organisation'] = this.selectedAttributes.selectedSchoolForReview;
    }
    return this.publicDataService.post(req).pipe(
      map(res => _.get(res, 'result.aggregations[0].values')));
  }

  public searchResources(qtype) {
    const request = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'content',
            'contentType': qtype === 'curiosity' ? 'CuriosityQuestionSet' : 'PracticeQuestionSet',
            'mimeType': 'application/vnd.ekstep.ecml-archive',
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.medium,
            'status': ['Live'],
            'questionCategories': (qtype === 'curiosity') ? 'CuriosityQuestion' : qtype.toUpperCase()
          },
          'sort_by': { 'createdOn': 'desc' },
          'fields': ['identifier', 'status', 'createdOn', 'topic', 'name', 'questions'],
          'facets': ['topic']
        }
      }
    };
    return this.publicDataService.post(request).pipe(
      map(res => {
        const content = _.get(res, 'result.content');
        const publishCount = [];
        _.forIn(_.groupBy(content, 'topic'), (value, key) => {
          publishCount.push({ name: key.toLowerCase(), count: _.uniq(value[0].questions).length, resourceId: _.get(value[0], 'identifier'), resourceName: _.get(value[0], 'name') });

        });
        return publishCount;
      }, err => {
        console.log(err);
      }));
  }

  dashboardApi(textBookMetaData) {

    this.searchQuestionsByType().subscribe((res) => {
      let aggregationData = res;
      this.textBookChapters = _.map(textBookMetaData, topicData => {
        const results = { name: topicData.name, topic: topicData.topic, identifier: topicData.identifier };
        _.forEach(aggregationData, (Tobj) => {
          if (Tobj.name === topicData.topic.toLowerCase()) {
            _.forEach(Tobj.aggregations[0].values, (Cobj) => {
              let modi = _.map(Cobj.aggregations[0].values, (a) => {
                let temp = {}
                temp[a.name] = a.count;
                return temp;
              })

              results[Cobj.name] = modi.reduce((result, item) => {
                var key = Object.keys(item)[0];
                result[key] = item[key];
                return result;
              }, {});
            })
          }
        })
        return results;
      });
      //Below code to make api call to get published question and to include in the variable 'textBookChapters'
      _.forEach(this.questionType, (type) => {
        this.searchResources(type).subscribe((res) => {
          var publishedData = res;
          _.forEach(this.textBookChapters, (chap) => {
            _.forEach(publishedData, (data) => {
              if (chap.topic.toLowerCase() === data.name) {
                Object.assign(chap[type], { 'published': data.count })
              }
            })

          })
        })
      })
      this.initializeDataTable(this.selectedReport);
    })
  }

  refreshReport() {
    this.getCollectionHierarchy(this.selectedAttributes.textbook)
  }

  initializeDataTable(report) {
    console.log("initialized")
    if (report === this.reports[0].name) {
      $('#questionBank').DataTable();
      setTimeout(() => {
        $('#questionBank').DataTable(
          {
            dom: 'Bfrtip',
            buttons: [
              'csv'
            ]
          }
        );
        this.showLoader = false;
      }, 5000);
    } else if (report === this.reports[1].name) {
      setTimeout(() => {
        $('#TextbookStatus').DataTable(
          {
            dom: 'Bfrtip',
            buttons: [
              'csv'
            ]
          }
        );
        this.showLoader = false;
      }, 5000);
    }
    this.manageHeaders(report);
  }

  manageHeaders(report) {
    if (report === this.reports[1].name) {
      this.headersTooltip = [{ tip: "No. of resource (no. of published questions)" }]

    } else if (report === this.reports[0].name) {
      this.statusLabel = [{ name: 'Up For Review', tip: "No. of questions pending for review" }, { name: "Rejected", tip: 'No. of questions rejected by reviewer' }, { name: 'Accepted', tip: 'No. of questions approved by reviewer' }, { name: 'Published', tip: 'No. of questions published by publisher' }];
    }
  }

  ngAfterViewInit() {
  }

  sample(){
    console.log("dataTable initialized=====>")
    $('#questionBank').DataTable(
      {
        dom: 'Bfrtip',
        buttons: [
          'csv'
        ]
      }
    );
  }
  
}
