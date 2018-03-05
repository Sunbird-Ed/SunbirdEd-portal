import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GeoExplorerService } from './../../services';
import { LearnerService, UserService } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';
import { GeoLocationDetails } from './../../interfaces/geoLocationDetails';
import * as _ from 'lodash';

/**
 * The Geo-explorer component.
 *
 * To show list of districs along with user count
 */
@Component({
  selector: 'app-geo-explorer',
  templateUrl: './geo-explorer.component.html',
  styleUrls: ['./geo-explorer.component.css']
})
/**
 * @class GeoExplorerComponent
 */
export class GeoExplorerComponent implements OnInit {

  /**
   * To receive config from child component
   *
   * @example { geo: { adaptor: 'SERVICE', service: 'geoService' } }
   */
  @Input() geoConfig: object;

  /**
   * keyname to validate config
   */
  keyName = 'geo';

  /**
   * Logged user root org id
   */
  rootOrgId: string;

  /**
   * Contains list of locations
   */
  locationList: Array<GeoLocationDetails>;

  /**
   * Contains list of checked items
   */
  selectedItems: Array<GeoLocationDetails>;

  /**
   * Show loader
   */
  showLoader = true;

  /**
   * Flag to show error if any occur
   */
  showError = false;

  /**
   * Reference of user service
   */
  public user: UserService;

  /**
   * Reference of geo service
   */
  public geo: GeoExplorerService;

  /**
   * Default method of class GeoExplorerComponent
   *
   * @param {UserService} user To get user profile data
   * @param {GeoExplorerService} geo To manage http call
   */
  constructor(user: UserService, geo: GeoExplorerService) {
    this.geo = geo;
    this.user = user;
  }

  /**
   * Function to validate adaptor / config.
   */
  validateAdaptor() {
    const adaptor = this.geoConfig[this.keyName] && this.geoConfig[this.keyName].adaptor ? this.geoConfig[this.keyName].adaptor : '';
    if (adaptor) {
      switch (adaptor.toUpperCase()) {
        case 'SERVICE':
          this.initializeServiceAdopter();
          break;
        default:
          this.showError = true;
          console.warn('Invalid adaptor');
      }
    } else {
      this.showError = true;
      console.warn('Invalid adaptor');
    }
  }

  /**
   * Function to populate selected location
   *
   * @param {string[]} locationIds location id list
   */
  populateItems(locationIds: string[]) {
    if (this.locationList && this.locationList.length) {
      _.forEach(this.locationList, (item) => {
        if (locationIds.indexOf(item.id) !== -1) {
          item.selected = true;
          this.selectedItems.push(item);
        }
      });
    }
  }

  /**
   * Function to initialize service adaptor.
   * It will make api call to get location(s)
   */
  initializeServiceAdopter() {
    const params = { rootOrgId: this.rootOrgId };
    // Make api call to get location(s)
    this.geo.getLocations(params).subscribe(
      (data: ServerResponse) => {
        if (data.result.response) {
          this.locationList = data.result.response;
        }
        this.showLoader = false;
      },
      error => {
        this.showLoader = false;
        this.showError = true;
      }
    );
  }

  /**
   * Function to set / reset selected items
   *
   * @param {boolean} event true / false
   * @param {object} item selected location details
   * @param {string} id location id
   */
  checkAndUncheckItem(event: boolean, item: GeoLocationDetails, id: string) {
    if (event) {
      this.selectedItems.push(item);
    } else {
      _.remove(this.selectedItems, (currentObject) => {
        return currentObject.id === id;
      });
    }
  }

  /**
   * Angular life cycle hook
   */
  ngOnInit() {
    this.user.userData$.subscribe(data => {
      if (data && data.userProfile && data.userProfile.rootOrgId) {
        this.rootOrgId = data.userProfile.rootOrgId;
        this.validateAdaptor();
      } else {
        console.log('Root org id not found');
      }
    });
  }
}
