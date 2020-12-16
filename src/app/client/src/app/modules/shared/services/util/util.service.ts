import * as TreeModel from 'tree-model';
import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ICard, ILanguage } from '@sunbird/shared';
import { Subject } from 'rxjs';
import { ResourceService } from '../resource/resource.service';
import * as dayjs from 'dayjs';
import { ExportToCsv } from 'export-to-csv';
import { environment } from '@sunbird/environment';
  // Dependency injection creates new instance each time if used in router sub-modules
@Injectable()
export class UtilService {
  static singletonInstance: UtilService;
  public showAppPopUp = false;
  private searchQuery = new Subject<any>();
  public searchQuery$ = this.searchQuery.asObservable();
  public languageChange = new EventEmitter<ILanguage>();
  public hideHeaderTabs = new EventEmitter<boolean>();
  public searchKeyword = new EventEmitter<string>();
  private csvExporter: any;
  private _isDesktopApp = false;

  constructor(private resourceService: ResourceService) {
    if (!UtilService.singletonInstance) {
      UtilService.singletonInstance = this;
    }
    this._isDesktopApp = environment.isDesktopApp;
    return UtilService.singletonInstance;

  }

  get isDesktopApp() {
    return this._isDesktopApp;
  }

  public sortChildrenWithIndex(tree) {
    if (!_.get(tree, 'children.length')) {
        return tree;
    }
    tree.children = _.sortBy(tree.children.map(childNode => this.sortChildrenWithIndex(childNode)), ['index']);
    return tree;
  }
  getDataForCard(data, staticData, dynamicFields, metaData) {
    const list: Array<ICard> = [];
    _.forEach(data, (item, key) => {
      const card = this.processContent(item, staticData, dynamicFields, metaData);
      list.push(card);
    });
    return <ICard[]>list;
  }

  processContent(data, staticData, dynamicFields, metaData) {
    let fieldValue: any;
    const content: any = {
      name: data.name || data.courseName,
      image: data.appIcon || data.courseLogoUrl,
      downloadStatus: data.downloadStatus,
      description: data.description,
      rating: data.me_averageRating || '0',
      subject: data.subject,
      medium: data.medium,
      orgDetails: data.orgDetails || {},
      gradeLevel: '',
      contentType: data.contentType,
      topic: this.getTopicSubTopic('topic', data.topic),
      subTopic: this.getTopicSubTopic('subTopic', data.topic),
      metaData: {},
      completionPercentage: data.completionPercentage || 0,
      mimeTypesCount: data.mimeTypesCount || 0,
      cardImg: data.appIcon || data.courseLogoUrl || data.cardImg || 'assets/images/book.png',
      resourceType: data.resourceType,
      badgeAssertions: data.badgeAssertions,
      organisation: data.organisation,
      hoverData: data.hoverData,
      board: data.board || '',
      identifier: data.identifier,
      mimeType: data.mimeType,
      primaryCategory: data.primaryCategory

    };
    if (data.desktopAppMetadata) {
      content['desktopAppMetadata'] = data.desktopAppMetadata;
    }
    // this customization is done for enrolled courses
    if (_.has(data, 'content')) {
      content['topic'] = this.getTopicSubTopic('topic', data.content.topic);
      content['subTopic'] = this.getTopicSubTopic('subTopic', data.content.topic);
      content['contentType'] = _.get(data.content, 'contentType') || '';
      content['orgDetails'] = _.get(data.content, 'orgDetails') || {};
    }

    if (data.gradeLevel && data.gradeLevel.length) {
        content['gradeLevel'] = _.isString(data.gradeLevel) ? data.gradeLevel : data.gradeLevel.join(',');
    }
    _.forIn(staticData, (value, key1) => {
      content[key1] = value;
    });
    _.forIn(metaData, (value, key1) => {
      content[key1] = _.pick(data, value);
    });
    _.forIn(dynamicFields, (fieldData, fieldName) => {
      fieldValue = _.get(data, fieldData);
      const name = _.zipObjectDeep([fieldName], [fieldValue]);
      _.forIn(name, (values, index) => {
        content[index] = _.merge(name[index], content[index]);
      });
    });

    return content;
  }

  public getTopicSubTopic (type, topic) {
    if (type === 'topic') {
      return _.size(topic) > 0 ? topic[0] : '';
    } else {
      return _.size(topic) > 1 ? topic[1] : '';
    }
  }

  public toggleAppPopup() {
    this.showAppPopUp = !this.showAppPopUp;
  }



  public manipulateSoftConstraint(filter, softConstraintData, frameWorkData?: any) {
    if (!_.isEmpty(frameWorkData) && !filter) {
      return {filters: _.omit(frameWorkData, ['id']), mode: 'soft'};
    } else if (filter) {
     return false;
    } else {
      return softConstraintData;
    }
  }

  translateValues(data, lang) {
    _.forEach(data, (value, index) => {
      if (value.children) {
        this.convert(value, lang);
        _.forEach(value.children, (children) => {
          this.convert(children, lang);
        });
      } else if (value.translations) {
        this.convert(value, lang);
      }
    });
    return data;
  }

  convert(value, lang) {
    const translations = JSON.parse(value.translations);
    if (translations) {
      if (!translations.en) {
        translations.en = value.name;
        value.translations = JSON.stringify(translations);
      }
      if (translations[lang]) {
        value.name = translations[lang];
      } else {
        value.name = translations['en'];
      }
    }
  }
  translateLabel(formFieldCategory, selectedLanguage) {
    if (!formFieldCategory.translations) {
      return formFieldCategory;
    }
    const translation = JSON.parse(formFieldCategory.translations);
    if (translation && !translation.en) {
      translation.en = formFieldCategory.label;
      formFieldCategory.translations = JSON.stringify(translation);
    }
    if (translation && translation[selectedLanguage]) {
      formFieldCategory.label = translation[selectedLanguage];
      return formFieldCategory;
    } else {
      return formFieldCategory;
    }
  }
  convertSelectedOption(selectedData, formFieldProperties, selectedLanguage, convertLanguage) {
    const formInputData = selectedData;
    _.forIn(selectedData, (inputData, key) => {
      const fieldValue = _.find(formFieldProperties, ['code', key]);
      if (fieldValue) {
        _.forEach(fieldValue.range, (collector) => {
          if (_.get(collector, 'translations')) {
            const translations = JSON.parse(collector.translations);
            _.forEach(inputData, (text) => {
              if (translations !== null) {
                const language = _.findKey(translations, (v) => {
                  return v === text;
                });
                const index = _.findIndex(inputData, (o) => o === text);
                if ((translations[selectedLanguage] === text || translations[language] === text)) {
                  const value = translations[convertLanguage] ? translations[convertLanguage] : translations['en'];
                  formInputData[key].splice(index, 1, value);
                }
              }
            });
          }
        });
      }
    });
    return formInputData;
  }
  getPlayerDownloadStatus(status, content, currentRoute) {
    if (content) {
    const downloadStatus = content['downloadStatus'];
    const addedUsing  = _.get(content, 'desktopAppMetadata.addedUsing');
    if (addedUsing && addedUsing === 'import' && !downloadStatus) {
      return this.isDownloaded(content, status);
    } else {
      const contentStatus = ['DOWNLOAD', 'FAILED', 'CANCELED'];
        if (status === 'DOWNLOAD') {
        return  downloadStatus ? _.includes(contentStatus, downloadStatus) : this.isDownloaded(content, status);
        } else {
         return downloadStatus ? downloadStatus === status : this.isDownloaded(content, status);
        }
    }
    }
  }

  isDownloaded(content, status) {
    if (this.isAvailable(content)) {
      return status === 'DOWNLOADED';
    } else {
      return status === 'DOWNLOAD';
    }
  }

  getPlayerUpdateStatus(status, content, currentRoute, isUpdated) {
    if (currentRoute === 'library' && isUpdated) {
      if (status === 'UPDATE') {
        return (!content['downloadStatus'] || content['downloadStatus'] === 'FAILED');
      }
      return (content['downloadStatus'] === status);
    }
    return false;
  }

  clearSearchQuery() {
      this.searchQuery.next();
  }

  updateSearchKeyword(keyword: string) {
    this.searchKeyword.emit(keyword);
  }

  /* This will add hover data in card content */
  addHoverData(contentList, isOnlineSearch) {
    const status = {
      DOWNLOADING: this.resourceService.messages.stmsg.m0140,
      FAILED: this.resourceService.messages.stmsg.m0143,
      DOWNLOADED: this.resourceService.messages.stmsg.m0139,
      PAUSED: this.resourceService.messages.stmsg.m0142,
      CANCELED: this.resourceService.messages.stmsg.m0143,
      COMPLETED: this.resourceService.messages.stmsg.m0139,
      INPROGRESS: this.resourceService.messages.stmsg.m0140,
      RESUME: this.resourceService.messages.stmsg.m0140,
      INQUEUE: this.resourceService.messages.stmsg.m0140,
      goToMyDownloads: this.resourceService.frmelmnts.lbl.goToMyDownloads,
      saveToPenDrive: this.resourceService.frmelmnts.lbl.saveToPenDrive,
    };

    _.each(contentList, (value) => {
      const contentStatus = status[_.get(value, 'downloadStatus')];
      value['hoverData'] = {
        note: isOnlineSearch ? (contentStatus ? (_.upperCase(contentStatus) === 'DOWNLOADED' ?  status.goToMyDownloads : '')
        : this.isAvailable(value) ? status.goToMyDownloads : '') : '',
        actions: [
          {
            type: isOnlineSearch ? 'download' : (contentStatus  ? (_.upperCase(contentStatus) !== 'DOWNLOADED' ? 'download' : 'save') : 'save') ,
            label: isOnlineSearch ? (contentStatus ? _.capitalize(contentStatus) :
            this.isAvailable(value) ? _.capitalize(status.COMPLETED) : _.capitalize(status.CANCELED)) :
            (contentStatus ? (_.upperCase(contentStatus) === 'DOWNLOADED' ? status.saveToPenDrive : _.capitalize(contentStatus)) :
            this.isAvailable(value) ? status.saveToPenDrive : _.capitalize(status.CANCELED)),
            disabled: isOnlineSearch ? (contentStatus ? _.includes(['Downloaded', 'Downloading', 'Paused'], _.capitalize(contentStatus)) :
            this.isAvailable(value)) : contentStatus ? _.includes(['Downloading', 'Paused'],
            _.capitalize(contentStatus)) : !this.isAvailable(value)
          },
          {
            type: 'open',
            label: this.resourceService.frmelmnts.lbl.open
          }
        ]
      };

      if (_.toUpper(_.get(value, 'trackable.enabled')) === 'YES') {
        value['hoverData'].actions.shift();
      }
    });

    return contentList;
  }
  isAvailable(content) {
    return (_.has(content, 'desktopAppMetadata') ? (!_.has(content, 'desktopAppMetadata.isAvailable')
    || _.get(content, 'desktopAppMetadata.isAvailable')) : false);
  }

  emitLanguageChangeEvent(language: ILanguage) {
    this.languageChange.emit(language);
  }

  emitHideHeaderTabsEvent(hideTab: boolean) {
    this.hideHeaderTabs.emit(hideTab);
  }

  /**
   * Parses string to object
   * Throws error if unable to parse
   * @param string
   */
  parseJson(string) {
    try {
      return JSON.parse(string);
    } catch (e) {
      throw new Error('ERROR_PARSING_STRING');
    }
  }


  /**
   * Redirects to login page wth error message
   */
  redirectToLogin(errorMessage) {
    window.location.href = '/redirect/login?error_message=' + errorMessage;
  }

  redirect(redirectUrl) {
    window.location.href = redirectUrl;
  }

  processData(sections, keys) {
    const facetObj = {};
    _.forEach(sections, (section) => {
      if (section && section.facets) {
        _.forEach(section.facets, (facet) => {
          if (_.indexOf(keys, facet.name) > -1) {
            if (facetObj[facet.name]) {
              facetObj[facet.name].push(...facet.values);
            } else {
              facetObj[facet.name] = [];
              facetObj[facet.name].push(...facet.values);
            }
          }
        });
      }
    });
    return facetObj;
  }

  removeDuplicateData(data, key) {
    return _.uniqBy(data, key);
  }

  removeDuplicate(dataToProcess) {
    const processedData = {};
    let uniqueKey: string;
    _.forEach(dataToProcess, (data, key) => {
      uniqueKey = key === 'channel' ? 'identifier' : 'name';
      processedData[key] = _.uniqBy(data, uniqueKey);
    });
    return processedData;
  }

  processCourseFacetData(sections, keys) {
    const facetObj = {};
    if (sections && sections.facets) {
      _.forEach(sections.facets, (facet) => {
        if (_.indexOf(keys, facet.name) > -1) {
          if (facetObj[facet.name]) {
            facetObj[facet.name].push(...facet.values);
          } else {
            facetObj[facet.name] = [];
            facetObj[facet.name].push(...facet.values);
          }
        }
      });
    }
    return facetObj;
  }

  reduceTreeProps(collection, requiredProps) {
    const model = new TreeModel();
    const treeModel: any = model.parse(collection);

    treeModel.walk(node => {
      for (const key of Object.keys(node.model)) {
          if (!_.includes(requiredProps, key)) {
            delete node.model[key];
          }
      }
    });
    return treeModel.model;
  }

  downloadCSV(collection, data) {
      const options = {
        filename: `${_.snakeCase(_.get(collection, 'name'))}_${dayjs().format('YYYY_MM_DD_HH_mm')}`,
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: false,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true
      };
      this.csvExporter = new ExportToCsv(options);
      this.csvExporter.generateCsv(data);
  }
}
