import { Component, OnInit, Input } from '@angular/core';
import { PublicDataService, UserService, ActionService } from '@sunbird/core';
import { ConfigService, ToasterService } from '@sunbird/shared';
import { map, catchError } from 'rxjs/operators';
import * as $ from 'jquery';
import 'datatables.net';
import * as _ from 'lodash-es';
import { ExportToCsv } from 'export-to-csv';
import { forkJoin, throwError, Subscription } from 'rxjs';
import { CbseProgramService } from '../../services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @Input() selectedAttributes: any;
  private textBookMeta: any;
  private questionType: Array<any> = [];
  public dtOptions: any = {};
  public hierarchyObj = {};
  textBookChapters: Array<any>;
  reports: Array<any>;
  selectedReport: string;
  headers: Array<any> = [];
  headersTooltip: Array<any> = [];
  showLoader = false;
  selectedCategory: string;
  selectedTextbook: string;
  tableData: Array<any>;
  UnitLevels: Array<any> = [];
  contentTypes: Array<any> = [];
  questionTypeName = {
    vsa: 'Very Short Answer',
    sa: 'Short Answer',
    la: 'Long Answer',
    mcq: 'Multiple Choice Question',
    curiosityquestion: 'Curiosity Question'
  };
  textbookList: Array<any>;
  programLevelData: Array<any>;

  constructor(public publicDataService: PublicDataService, private configService: ConfigService,
    public actionService: ActionService, public toasterService: ToasterService, private cbseService: CbseProgramService, ) {}

  ngOnInit() {
    this.reports = [{ name: 'Question Bank Status' }, { name: 'Textbook Status' }, { name: 'Program Level Report Status' }];
    this.selectedReport = this.reports[2].name;
    // should not change the order of below array
    this.questionType = ['vsa', 'sa', 'la', 'mcq', 'curiosityquestion'];
    // default selected category
    this.selectedCategory = 'vsa';
    this.generateProgramLevelData(this.selectedReport);
  }

  changeQuestionCategory(type) {
    this.showLoader = true;
    // refresh datatable values and re-initializing it, setTimeOut is given to show loader on change of data
    setTimeout(() => {
      this.showLoader = false;
      this.generateTableData(this.selectedReport);
    }, 500);
    this.selectedCategory = type;
  }

  public getCollectionHierarchy(identifier: string) {
    let hierarchy;
    const req = {
      url: 'content/v3/hierarchy/' + identifier, // `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`,
      param: { 'mode': 'edit' }
    };
    this.showLoader = true;
    return this.actionService.get(req).subscribe((response) => {
      const collectionData = response.result.content;
      hierarchy = this.getHierarchyObj(collectionData);
      this.selectedAttributes.hierarchyObj = { hierarchy };
      const textBookMetaData = [];
      _.forEach(collectionData.children, data => {

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
      url: this.configService.urlConFig.URLS.COMPOSITE.SEARCH,
      data: {
        'request': {
          'filters': {
            'objectType': 'AssessmentItem',
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'gradeLevel': this.selectedAttributes.gradeLevel,
            'subject': this.selectedAttributes.subject,
            'medium': this.selectedAttributes.medium,
            'programId': this.selectedAttributes.programId,
            'status': [],
            'type': questionType === 'mcq' ? 'mcq' : 'reference',
          },
          'limit': 0,
          'aggregations': [
            {
              'l1': 'topic',
              'l2': 'category',
              'l3': 'status'
            }
          ]
        }
      }
    };

    return this.publicDataService.post(req).pipe(
      map(res => {
        let result = [];
        return result = _.get(res, 'result.aggregations[0].values');
      }), catchError((err) => {
          const errInfo = { errorMsg: 'Questions search by type failed' };
          return throwError(this.cbseService.apiErrorHandling(err, errInfo));
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
          // tslint:disable-next-line:max-line-length
          publishCount.push({ name: key.toLowerCase(), count: _.uniq(value[0].questions).length, resourceId: _.get(value[0], 'identifier'), resourceName: _.get(value[0], 'name') });

        });
        return publishCount;
      }),
      catchError((err) => {
        const errInfo = { errorMsg: 'Published Resource search failed' };
        return throwError(this.cbseService.apiErrorHandling(err, errInfo));
      }));
  }

  dashboardApi(textBookMetaData) {
    let apiRequest;
    // tslint:disable-next-line:max-line-length
    apiRequest = [this.searchQuestionsByType(), this.searchQuestionsByType('mcq'), ...this.questionType.map(type => this.searchResources(type))];
    if (!apiRequest) {
      this.toasterService.error('Please try again by refresh');
    }
    forkJoin(apiRequest).subscribe(data => {
      const aggregatedData = _.compact(_.concat(data[0], data[1]));
      this.textBookChapters = _.map(textBookMetaData, topicData => {
        const results = { name: topicData.name, topic: topicData.topic, identifier: topicData.identifier };
        _.forEach(aggregatedData, (Tobj) => {
          if (Tobj && Tobj.name === topicData.topic.toLowerCase()) {
            _.forEach(Tobj.aggregations[0].values, (Cobj) => {
              const modify = _.map(Cobj.aggregations[0].values, (a) => {
                const temp = {};
                temp[a.name] = a.count;
                return temp;
              });

              results[Cobj.name] = modify.reduce((result, item) => {
                const key = Object.keys(item)[0];
                result[key] = item[key];
                return result;
              }, {});
            });
          }
        });
        return results;
      });

      // Below code to make api call to get published question and to include in the variable 'textBookChapters'
      _.forEach(this.textBookChapters, (chap) => {
        _.forEach(this.questionType, (type, index) => {
          const filter_by_category = _.filter(data[index + 2], { name: chap.topic.toLowerCase() });
          if (chap[type] && filter_by_category.length > 0) { Object.assign(chap[type], { 'published': filter_by_category[0].count }); }
        });
      });

      this.generateTableData(this.selectedReport);
    });
  }

  refreshReport() {
    (this.selectedReport === this.reports[2].name) ?
    this.generateProgramLevelData(this.selectedReport) : this.getCollectionHierarchy(this.selectedAttributes.textbook);
  }

  downloadReport() {
    let optional;
    if (this.selectedReport === this.reports[0].name) {
      optional = `Selected Category: ${this.questionTypeName[this.selectedCategory]}`;
    }
    const options = {
      filename: `${this.selectedReport}`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `Texbook: ${this.selectedTextbook ? this.selectedTextbook : ''}, ${optional ? optional : ''}`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.tableData);
  }

  getUnitWithChildren(data) {
    const self = this;
    const tree = data.map(child => {
      const treeItem = {
        identifier: child.identifier,
        name: child.name,
        contentType: child.contentType,
        topic: child.topic,
        status: child.status
      };
      const textbookUnit = _.find(child.children, [
        'contentType',
        'TextBookUnit'
      ]);
      if (child.children) {
        const treeUnit = self.getUnitWithChildren(child.children);
        const treeChildren = treeUnit.filter(
          item => item.contentType === 'TextBookUnit'
        );
        const treeLeaf = treeUnit.filter(
          item => item.contentType !== 'TextBookUnit'
        );
        treeItem['children'] = treeChildren.length > 0 ? treeChildren : null;
        treeItem['leaf'] = treeLeaf.length > 0 ? treeLeaf : null;
      }
      return treeItem;
    });
    return tree;
  }

  getprogramLevelCount(identifier: string) {
    const req = {
      url: 'content/v3/hierarchy/' + identifier, // `${this.configService.urlConFig.URLS.COURSE.HIERARCHY}/${identifier}`,
      param: { 'mode': 'edit' }
    };
    return this.actionService.get(req).pipe(map((response) => {
      const collectionData = response.result.content;
        let textBookLevelCount;
        const collectionHierarchy = this.getUnitWithChildren(
          collectionData.children
        );
        textBookLevelCount = this.getTextbookLevelCount(collectionHierarchy);
        return textBookLevelCount;
    }),
    catchError((err) => {
      const errInfo = { errorMsg: 'Fetching Textbook Hierarchy failed, Please try later' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    }));
  }

  getTextbookLevelCount(collectionHierarchy) {
    const textbookLevelCount = {
      level: {}, content: {}
    };
    let n = 1;
    const recursive = (level) => {
      if (level.contentType === 'TextBookUnit') {
        textbookLevelCount.level[`L${n}`]  ? textbookLevelCount.level[`L${n}`]++ : textbookLevelCount.level[`L${n}`] = 1;
        if (level.leaf && level.leaf.length > 0) {
          _.forEach(level.leaf, (resource) => {
            if (resource.status === 'Live') {
              // tslint:disable-next-line:max-line-length
              textbookLevelCount.content[resource.contentType] ? textbookLevelCount.content[resource.contentType] ++ : textbookLevelCount.content[resource.contentType] = 1;
            }
          });
        }
        if (level.children && level.children.length > 0) {
          n = n + 1;
          _.forEach(level.children, (child) => {
            recursive(child);
          });
        }
      }
    };
    _.forEach(collectionHierarchy, (level) => {
      n = 1;
      recursive(level);
    });
    return textbookLevelCount;

  }

  generateProgramLevelData(report) {
    let apiRequest;
    const levels = [];
    const contents = [];
    const req = {
      url: `${this.configService.urlConFig.URLS.COMPOSITE.SEARCH}`,
      data: {
        'request': {
          'filters': {
            'objectType': 'content',
            'board': this.selectedAttributes.board,
            'framework': this.selectedAttributes.framework,
            'medium': this.selectedAttributes.mediumArray,
            'programId': this.selectedAttributes.programId,
            'status': ['Draft', 'Live'],
            'contentType': 'TextBook'
          }
        }
      }
    };
    this.showLoader = true;
    this.publicDataService.post(req).pipe(catchError(err => {
      const errInfo = { errorMsg: 'Fetching of textbook list failed' };
      return throwError(this.cbseService.apiErrorHandling(err, errInfo));
    })).subscribe((res) => {
      const filteredTextbook = [];
      // --> The textbook of either of status ['Live', 'Draft'] && In case of both 'Draft' is shown to avoid duplicate.
      const group_arr = _.groupBy(res.result.content, 'identifier');
      _.forEach(group_arr,  (val) => {
        if (val.length > 1) {
          const ab = _.find(val, (v) => {
            return v.status === 'Draft';
          });
          filteredTextbook.push(ab);
        } else {
          filteredTextbook.push(val[0]);
        }
      });
      this.textbookList = filteredTextbook;
      apiRequest = [...this.textbookList.map(book => this.getprogramLevelCount(book.identifier))];

      forkJoin(apiRequest).subscribe(data => {
        let i = 0;

        this.programLevelData = data.map(book => {
            book['Textbook Name'] = this.textbookList[i].name;
            book['Subject'] = this.textbookList[i].subject;
            book['Grade'] = this.textbookList[i].gradeLevel[0];
            book['Identifier'] = this.textbookList[i].identifier;
            book['Medium'] = this.textbookList[i].medium;
            i ++;
            return book;
        });
        _.forEach(this.programLevelData, (obj) => {
          _.mapKeys(obj.level, (value, key) => {
            levels.push(key);
          });
          _.mapKeys(obj.content, (value, key) => {
            contents.push(key);
          });
        });
        this.UnitLevels = _.uniq(levels);
        this.contentTypes = _.uniq(contents);
        this.generateTableData(report);
     });
    });
  }

  generateHeaderDetails(report) {
    this.headers = [];
    if (report === this.reports[0].name) {
      this.headers = [{ name: 'Up For Review', tip: 'No. of questions pending for review' },
                        { name: 'Rejected', tip: 'No. of questions rejected by reviewer' },
                            { name: 'Accepted', tip: 'No. of questions approved by reviewer' },
                                { name: 'Published', tip: 'No. of questions published by publisher' }];
    } else if (report === this.reports[1].name) {
      this.headers = [{ tip: 'No. of resource (no. of published questions)' }];
    } else if (report === this.reports[2].name) {
      const levelHeaders = [{
        name: 'L1', tip: 'Count of level 1 textbook units (Chapter)'
      }, {
        name: 'L2', tip: 'Count of level 2 textbook units (Topics)'
      }, {
        name: 'L3', tip: 'Count of level 3 textbook units (Sub-topics)'
      }, {
        name: 'L4', tip: 'Count of level 4 textbook units'
      }, {
        name: 'L5', tip: 'Count of level 5 textbook units'
      }];
      _.forEach(this.UnitLevels, (v, i) => {
        this.headers[i] = levelHeaders[i];
      });
      _.forEach(this.contentTypes, (v, i) => {
         this.headers[this.UnitLevels.length + i] = {name: v, tip: `Number of ${v} Set`};
      });
    }
  }

  generateTableData(report) {
    let Tdata;
    this.generateHeaderDetails(report);
    if (report === this.reports[0].name) {
      Tdata = _.map(this.textBookChapters, (item) => {
        const result = {};
        result['Topic Name'] = item.name;
        // tslint:disable-next-line:max-line-length
        result[this.headers[0].name] = (item[this.selectedCategory] && item[this.selectedCategory].review) ? item[this.selectedCategory].review : 0;
        // tslint:disable-next-line:max-line-length
        result[this.headers[1].name] = (item[this.selectedCategory] && item[this.selectedCategory].reject) ? item[this.selectedCategory].reject : 0;
        // tslint:disable-next-line:max-line-length
        result[this.headers[2].name] = (item[this.selectedCategory] && item[this.selectedCategory].live) ? item[this.selectedCategory].live : 0;
        // tslint:disable-next-line:max-line-length
        result[this.headers[3].name] = (item[this.selectedCategory] && item[this.selectedCategory].published) ? item[this.selectedCategory].published : 0;
        return result;
      });
      this.tableData = Tdata;
      this.initializeDataTable(report);
    } else if (report === this.reports[1].name) {
      Tdata = _.map(this.textBookChapters, (item) => {
        const result = {};
        result['Topic Name'] = item.name;
        // tslint:disable-next-line:max-line-length
        result[this.questionTypeName[this.questionType[0]]] = (item[this.questionType[0]] && item[this.questionType[0]].published) ? item[this.questionType[0]].published : 0;
        // tslint:disable-next-line:max-line-length
        result[this.questionTypeName[this.questionType[1]]] = (item[this.questionType[1]] && item[this.questionType[1]].published) ? item[this.questionType[1]].published : 0;
        // tslint:disable-next-line:max-line-length
        result[this.questionTypeName[this.questionType[2]]] = (item[this.questionType[2]] && item[this.questionType[2]].published) ? item[this.questionType[2]].published : 0;
        // tslint:disable-next-line:max-line-length
        result[this.questionTypeName[this.questionType[3]]] = (item[this.questionType[3]] && item[this.questionType[3]].published) ? item[this.questionType[3]].published : 0;
        // tslint:disable-next-line:max-line-length
        result[this.questionTypeName[this.questionType[4]]] = (item[this.questionType[4]] && item[this.questionType[4]].published) ? item[this.questionType[4]].published : 0;
        return result;
      });
      this.tableData = Tdata;
      this.initializeDataTable(report);
    } else if (report === this.reports[2].name) {
      this.tableData = _.map(this.programLevelData, (obj) => {
        let result = obj;
       if (result.level) {
        result = {...result, ...result.level};
        delete result.level;
       }
       if (result.content) {
        result = {...result, ...result.content};
        delete result.content;
       }
       _.forEach([...this.UnitLevels, ...this.contentTypes], (val) => {
        result[val] ? (result[val] = result[val]) : (result[val] = 0) ;
       });
       return result;
      });
      this.initializeDataTable(report);
    }
  }

  onReportChange(report) {
    // Api call should not happen on report change
    if (report !== this.selectedReport) {
      this.generateTableData(report);
    }
  }

  onSelectTextbook(book) {
    this.selectedReport = this.reports[1].name;
    this.selectedAttributes.textbook = book.Identifier;
    this.selectedAttributes.medium = book.Medium;
    this.selectedTextbook = book['Textbook Name'];
    this.getCollectionHierarchy(book.Identifier);
  }

  initializeDataTable(report) {
    const dtOptions = {
      paging: false,
      searching: false,
      info: false,
      destroy: true,
      order: []
    };
    this.showLoader = false;
    if (report === this.reports[0].name) {
      setTimeout(() => {
        $('#questionBank').DataTable(dtOptions);
      }, 0);
    } else if (report === this.reports[1].name) {
      setTimeout(() => {
        $('#TextbookStatus').DataTable(dtOptions);
      }, 0);
    } else if (report === this.reports[2].name) {
      setTimeout(() => {
        $('#ProgramLevelReportStatus').DataTable(dtOptions);
      }, 0);
    }
  }
}
