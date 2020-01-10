import { ConfigService } from '@sunbird/shared';
import { SearchService, PlayerService } from '@sunbird/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { map, catchError, retry } from 'rxjs/operators';
import { of, Observable, iif, forkJoin, empty } from 'rxjs';
import * as TreeModel from 'tree-model';
const treeModel = new TreeModel();

@Injectable({
  providedIn: 'root'
})
export class DialCodeService {


  private dialSearchResults;
  constructor(private searchService: SearchService, private configService: ConfigService, private playerService: PlayerService) { }

  /**
   * makes API call to search for dialCode
   */
  public searchDialCode(dialCode: string, online: boolean): Observable<any[]> {
    const requestParams = {
      filters: {
        dialcodes: dialCode
      },
      mode: 'collection',
      params: this.configService.appConfig.dialPage.contentApiQueryParams
    };
    requestParams.params.online = Boolean(online);
    return this.searchService.contentSearch(requestParams, false)
      .pipe(
        map(apiResponse => _.get(apiResponse, 'result')));
  }

  /**
  * @param dialSearchResults
  * @returns Returns an array of elements split into two groups , first is collections and second is contents
  */
  public filterDialSearchResults = (dialSearchResults) => {
    this.dialSearchResults = dialSearchResults;
    const response = {};
    const textbookUnitsWithoutParentBook = [];

    const [collections, contents] = _.partition((_.get(dialSearchResults, 'content') || []), result => {
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

    return this.getAllPlayableContent(textbookUnitsWithoutParentBook).pipe(
      map(apiResponse => {
        (response['contents'] || (response['contents'] = [])).push(...apiResponse);
        return response;
      })
    );
  }

  public getAllPlayableContent(collectionIds) {
    const apiArray = _.map(collectionIds, (collectionId: string) => this.getCollectionHierarchy(collectionId));
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
  public getCollectionHierarchy(collectionId: string): Observable<any[]> {
    return this.playerService.getCollectionHierarchy(collectionId).pipe(
      map((res) => _.get(res, 'result.content')));
  }

  get dialCodeResult() {
    return this.dialSearchResults;
  }

}
