import { PublicDataService } from '@sunbird/core';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class OnboardingService {
  onboardCompletion = new EventEmitter();
  userData;
  constructor(public configService: ConfigService, public publicDataService: PublicDataService) { }

  searchLocation(filters): Observable<ServerResponse> {
    const options = {
      url: this.configService.urlConFig.URLS.USER.LOCATION_SEARCH,
      data: {
        request: {
          filters
        }
      }
    };
    return this.publicDataService.post(options);
  }

  getUser() {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.READ_USER
    };

    return this.publicDataService.get(options).pipe(map((response: ServerResponse) => {
        this.userData = response.result;
        return this.userData;
      }), catchError(err => {
        return throwError(err);
      }));
  }

  saveLocation(request): Observable<ServerResponse> {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.LOCATION_SAVE,
      data: request
    };
    return this.publicDataService.post(options);
  }
  updateUser(request): Observable<ServerResponse> {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.UPDATE_USER,
      data: request
    };
    return this.publicDataService.post(options);
  }

  saveUserPreference(request) {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.CREATE_USER,
      data: request
    };
    return this.publicDataService.post(options);
  }
  getLocation() {
    const options = {
      url: this.configService.urlConFig.URLS.OFFLINE.LOCATION_READ
    };
    return this.publicDataService.get(options).pipe(map((response: ServerResponse) => {
        return response;
      }), catchError(err => {
        return throwError(err);
      }));
  }
  getAssociationData(selectedData: Array<any>, category: string, frameworkCategories) {
    // Getting data for selected parent, eg: If board is selected it will get the medium data from board array
    let selectedCategoryData = [];
    _.forEach(selectedData, (data) => {
      const categoryData = _.filter(data.associations, (o) => {
        return o.category === category;
      });
      if (categoryData) {
        selectedCategoryData = _.concat(selectedCategoryData, categoryData);
      }
    });

    // Getting associated data from next category, eg: If board is selected it will get the association data for medium
    let associationData;
    _.forEach(frameworkCategories, (data) => {
      if (data.code === category) {
        associationData = data.terms;
      }
    });

    // Mapping the final data for next drop down
    let resultArray = [];
    _.forEach(selectedCategoryData, (data) => {
      const codeData = _.find(associationData, (element) => {
        return element.code === data.code;
      });
      if (codeData) {
        resultArray = _.concat(resultArray, codeData);
      }
    });

    return _.sortBy(_.unionBy(resultArray, 'identifier'), 'index');
  }
}
