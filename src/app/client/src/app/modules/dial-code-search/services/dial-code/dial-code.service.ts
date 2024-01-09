import { ConfigService } from '@sunbird/shared';
import { SearchService, PlayerService, UserService, PublicDataService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, iif, forkJoin } from 'rxjs';
import TreeModel from 'tree-model';
const treeModel = new TreeModel();
import { CslFrameworkService } from '../../../../modules/public/services/csl-framework/csl-framework.service';
@Injectable({
  providedIn: 'root'
})
export class DialCodeService {


  private dialSearchResults;
  private frameworkCategories;
  constructor(private searchService: SearchService, private configService: ConfigService, private playerService: PlayerService,
    private config: ConfigService, private user: UserService, private publicDataService: PublicDataService, private cslFrameworkService:CslFrameworkService ) {
      this.frameworkCategories = this.cslFrameworkService.getFrameworkCategories();
    }


  /**
  * @param dialSearchResults
  * @returns Returns an array of elements split into two groups , first is collections and second is contents
  */
  public filterDialSearchResults = (dialSearchResults, option?) => {
    this.dialSearchResults = dialSearchResults;
    const response = {};
    const textbookUnitsWithoutParentBook = [];

    const [collections, contents] = _.partition((_.get(dialSearchResults, 'contents') || []), result => {
      return (_.get(result, 'mimeType') === 'application/vnd.ekstep.content-collection' && result.contentType.toLowerCase() !== 'course');
    });

    const groupedCollections = this.groupCollections(collections);
    (response['collection'] || (response['collection'] = [])).push(..._.flatMap(_.values(_.omit(groupedCollections, 'textbookunit'))));
    (response['contents'] || (response['contents'] = [])).push(...contents);

    if (_.has(groupedCollections, 'textbookunit')) {
      const collectionsFromApi = _.get(dialSearchResults, 'collections') || [];
      _.forEach(_.get(groupedCollections, 'textbookunit'), async (textbookunit) => {
        const collection = _.find(collectionsFromApi, collectionObj => {
          return _.includes(collectionObj.childNodes, _.get(textbookunit, 'identifier'));
        });
        if (collection) {
          collection.childTextbookUnit = textbookunit;
          (response['collection'] || (response['collection'] = [])).push(collection);
        } else {
          textbookUnitsWithoutParentBook.push(_.get(textbookunit, 'identifier'));
        }
      });
    }

    return this.getAllPlayableContent(textbookUnitsWithoutParentBook, option).pipe(
      map(apiResponse => {
        (response['contents'] || (response['contents'] = [])).push(...apiResponse);
        return response;
      })
    );
  }

  public getAllPlayableContent(collectionIds, option?) {
    const apiArray = _.map(collectionIds, (collectionId: string) => this.getCollectionHierarchy(collectionId, option));
    return iif(() => !apiArray.length, of([]), forkJoin(apiArray)
      .pipe(
        map(results => _.flatMap(_.map(results, this.parseCollection))),
        catchError(err => of([]))
      ));
  }

  /**
   * groups an array of collections on basis of contentTypes
   * @param collections
   */
  groupCollections(collections) {
    return _.groupBy(collections, collection => _.toLower(_.get(collection, 'contentType')));
  }

  /**
   * @description parses a collection
   * @param collection
   */
  public parseCollection(collection) {
    const contents = [];
    const parsedCollection = treeModel.parse(collection);
    parsedCollection.all(() => true).forEach(node => {
      if (node.model.trackable && node.model.trackable.enabled === 'Yes') {
        node.model.l1Parent = collection.identifier;
        contents.push(node.model);
        node.drop();
      }
    });
    parsedCollection.walk((node) => {
      if (_.get(node, 'model.mimeType') && node.model.mimeType !== 'application/vnd.ekstep.content-collection') {
        node.model.l1Parent = collection.identifier;
        contents.push(node.model);
      }
      return true;
    });
    return contents;
  }

  /**
   * fetch collection hierarchy
   * @param collectionId
   */
  public getCollectionHierarchy(collectionId: string, option?): Observable<any[]> {
    return this.playerService.getCollectionHierarchy(collectionId, option).pipe(
      map((res) => _.get(res, 'result.content')));
  }

  get dialCodeResult() {
    return this.dialSearchResults;
  }

   /**
   * makes API call to search for dialCode
   */
  public searchDialCodeAssemble(dialCode: string, online: boolean): Observable<any[]> {
    const request = this.getRequest(dialCode);
    return this.publicDataService
    .post(request)
    .pipe(
      map((apiResponse) => _.get(apiResponse, 'result.response.sections[0]'))
    );
  }

  public getRequest(dialCode: string) {
    return {
      url: this.config.urlConFig.URLS.DIAL_ASSEMBLE_PREFIX,
      data: {
        request: {
          source: 'web',
          name: 'DIAL Code Consumption',
          filters: {
            dialcodes: dialCode,
            contentType: this.config.appConfig.DialAssembleSearch.contentType,
          },
          userProfile:
            this.user.loggedIn && _.get(this.user.userProfile, 'framework.[this.frameworkCategories.fwCategory1.code]')
              ? { [this.frameworkCategories?.fwCategory1?.code]: this.user.userProfile.framework[this.frameworkCategories?.fwCategory1?.code]
              }
              : {},
        },
      },
    };
  }

}
