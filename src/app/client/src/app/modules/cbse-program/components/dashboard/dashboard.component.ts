import { Component, OnInit, Input } from '@angular/core';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { map } from 'rxjs/operators';
import * as $ from 'jquery';
import 'datatables.net';
import * as _ from 'lodash-es';
import { ExportToCsv } from 'export-to-csv';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() selectedAttributes: any;
  private textBookMeta: any;
  private questionType: Array<any> = [];
  public collectionData;
  public dtOptions: any = {};
  public hierarchyObj = {};
  textBookChapters;
  reports;
  selectedReport;
  statusLabel
  headersTooltip: Array<any> = [];
  showLoader: boolean = false;
  selectedCategory;
  tableData;
  firstcolumnHeader;
  questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question',
    curiosityquestion: 'Curiosity Question'
  };

  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    public actionService: ActionService, public toasterService: ToasterService) { }

  ngOnInit() {

    this.reports = [{ name: 'Question Bank Status' }, { name: 'Textbook Status' }];
    this.selectedReport = this.reports[0].name;
    this.firstcolumnHeader = 'Topic Name'
    //should not change the order of below array
    this.questionType = ['vsa', 'sa', 'la', 'mcq', 'curiosityquestion'];
    //default selected category
    this.selectedCategory = 'vsa';
    this.headersTooltip = [{ tip: "No. of resource (no. of published questions)" }];
    this.statusLabel = [{ name: 'Up For Review', tip: "No. of questions pending for review" }, { name: "Rejected", tip: 'No. of questions rejected by reviewer' }, { name: 'Accepted', tip: 'No. of questions approved by reviewer' }, { name: 'Published', tip: 'No. of questions published by publisher' }];
    this.getCollectionHierarchy(this.selectedAttributes.textbook);
  }

  changeQuestionCategory(type) {
    this.showLoader = true;
    //refresh datatable values and re-initializing it, setTimeOut is given to show loader on change of data
    setTimeout(() => {
      this.showLoader = false;
      this.initializeDataTable(this.selectedReport);
    }, 500);
    this.selectedCategory = type;
    this.generateTableData(this.selectedReport);
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
        'root': (data.contentType === 'TextBook')
      };

      _.forEach(data.children, (collection) => {
        instance.getHierarchyObj(collection);
      });
    }
    return this.hierarchyObj;
  }

  public searchQuestionsByType(questionType?: string) {
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
            "status": [],
            'type': questionType === 'mcq' ? 'mcq' : 'reference',
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

    return this.publicDataService.post(req).pipe(
      map(res => {
        let result = []
        return result = _.get(res, 'result.aggregations[0].values')
      },
        err => {
          this.toasterService.error(_.get(err, 'error.params.errmsg') || 'Fetching aggregations of TextBook failed');
        }));
  }

  public searchResources(qtype) {
    const request = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'content',
            'contentType': qtype === 'curiosityquestion' ? 'CuriosityQuestionSet' : 'PracticeQuestionSet',
            'mimeType': 'application/vnd.ekstep.ecml-archive',
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.medium,
            'status': ['Live'],
            'questionCategories': (qtype === 'curiosityquestion') ? 'CuriosityQuestion' : qtype.toUpperCase()
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
        this.toasterService.error(_.get(err, 'error.params.errmsg') || 'Fetching Resource details failed');
      }));
  }

  dashboardApi(textBookMetaData) {
    let apiRequest;
    apiRequest = [this.searchQuestionsByType(), this.searchQuestionsByType('mcq'), ...this.questionType.map(type => this.searchResources(type))]
    if (!apiRequest) {
      this.toasterService.error('Please try again by refresh');
    }
    forkJoin(apiRequest).subscribe(data => {
      let aggregatedData = _.concat(data[0], data[1])
      console.log("result", aggregatedData);
      this.textBookChapters = _.map(textBookMetaData, topicData => {
        const results = { name: topicData.name, topic: topicData.topic, identifier: topicData.identifier };
        _.forEach(aggregatedData, (Tobj) => {
          if (Tobj.name === topicData.topic.toLowerCase()) {
            _.forEach(Tobj.aggregations[0].values, (Cobj) => {
              let modify = _.map(Cobj.aggregations[0].values, (a) => {
                let temp = {}
                temp[a.name] = a.count;
                return temp;
              })

              results[Cobj.name] = modify.reduce((result, item) => {
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
      _.forEach(this.textBookChapters, (chap) => {
        _.forEach(this.questionType, (type, index) => {
          let filter_by_category = _.filter(data[index + 2], { name: chap.topic.toLowerCase() })
          if (filter_by_category.length > 0) Object.assign(chap[type], { 'published': filter_by_category[0].count })
        });
      });

      this.generateTableData(this.selectedReport);
      this.initializeDataTable(this.selectedReport);
    });
  }

  refreshReport() {
    this.getCollectionHierarchy(this.selectedAttributes.textbook)
  }

  downloadReport() {
    var optional;
    if (this.selectedReport === this.reports[0].name) {
      optional = `Selected Category: ${this.questionTypeName[this.selectedCategory]}`
    }
    const options = {
      filename: `${this.selectedReport}`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `Texbook Name: ${this.selectedAttributes.textbookName}, ${optional ? optional : ""}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.tableData);
  }

  generateTableData(report) {
    let Tdata
    if (report === this.reports[0].name) {
      Tdata = _.map(this.textBookChapters, (item) => {
        let result = {};
        result[this.firstcolumnHeader] = item.name + "(" + item.topic + ")";
        result[this.statusLabel[0].name] = (item[this.selectedCategory] && item[this.selectedCategory].review) ? item[this.selectedCategory].review : 0;
        result[this.statusLabel[1].name] = (item[this.selectedCategory] && item[this.selectedCategory].reject) ? item[this.selectedCategory].reject : 0;
        result[this.statusLabel[2].name] = (item[this.selectedCategory] && item[this.selectedCategory].live) ? item[this.selectedCategory].live : 0;
        result[this.statusLabel[3].name] = (item[this.selectedCategory] && item[this.selectedCategory].published) ? item[this.selectedCategory].published : 0;
        return result;
      });
      this.tableData = Tdata;

    } else if (report === this.reports[1].name) {
      Tdata = _.map(this.textBookChapters, (item) => {
        let result = {};
        result[this.firstcolumnHeader] = item.name + "(" + item.topic + ")";
        result[this.questionTypeName[this.questionType[0]]] = (item[this.questionType[0]] && item[this.questionType[0]].published) ? item[this.questionType[0]].published : 0;
        result[this.questionTypeName[this.questionType[1]]] = (item[this.questionType[1]] && item[this.questionType[1]].published) ? item[this.questionType[1]].published : 0;
        result[this.questionTypeName[this.questionType[2]]] = (item[this.questionType[2]] && item[this.questionType[2]].published) ? item[this.questionType[2]].published : 0;
        result[this.questionTypeName[this.questionType[3]]] = (item[this.questionType[3]] && item[this.questionType[3]].published) ? item[this.questionType[3]].published : 0;
        result[this.questionTypeName[this.questionType[4]]] = (item[this.questionType[4]] && item[this.questionType[4]].published) ? item[this.questionType[4]].published : 0;
        return result;
      });
      this.tableData = Tdata;
    }
  }

  onReportChange(report) {
    if (report !== this.selectedReport) {
      this.generateTableData(report);
      this.initializeDataTable(report);
    }
  }

  initializeDataTable(report) {
    let dtOptions = {
      paging: false,
      searching: false,
      info: false,
      destroy: true,
    }
    this.showLoader = false;
    if (report === this.reports[0].name) {
      setTimeout(() => {
        $('#questionBank').DataTable(dtOptions);
      }, 0);
    } else if (report === this.reports[1].name) {
      setTimeout(() => {
        $('#TextbookStatus').DataTable(dtOptions);
      }, 0);
    }

  }










}
