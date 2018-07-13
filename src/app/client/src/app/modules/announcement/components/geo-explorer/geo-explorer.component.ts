
import {takeUntil} from 'rxjs/operators';
import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { GeoExplorerService } from './../../services';
import { LearnerService, UserService } from '@sunbird/core';
import { ServerResponse } from '@sunbird/shared';
import { IGeoLocationDetails } from './../../interfaces/geoLocationDetails';
import * as _ from 'lodash';

import { Subject } from 'rxjs';

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
export class GeoExplorerComponent implements OnInit, OnDestroy {

  public unsubscribe = new Subject<void>();
  /**
   * To receive config from child component
   *
   * @example { geo: { adaptor: 'SERVICE', service: 'geoService' } }
   */
  @Input() geoConfig: object;

  @Input() populateSelectedItem: any;

  /**
   * keyname to validate config
   */
  keyName = 'geo';

  /**
   * Search text for geo location list
   */
  searchText: string;

  /**
   * Logged user root org id
   */
  rootOrgId: string;

  /**
   * Contains list of locations
   */
  locationList: Array<IGeoLocationDetails>;

  /**
   * Contains list of checked items
   */
  selectedItems: Array<IGeoLocationDetails>;

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
    this.selectedItems = [];
  }

  /**
   * Function to validate adaptor / config.
   */
  validateAdaptor() {
    if (this.geoConfig !== undefined) {
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
  }

  /**
   * Function to populate selected location
   */
  populateItems() {
    let id;
    if (typeof this.populateSelectedItem === 'object') {
      if (this.populateSelectedItem[0] && this.populateSelectedItem[0].id) {
        id = _.map(this.populateSelectedItem, 'id');
      } else {
        id = this.populateSelectedItem;
      }
      _.forEach(this.locationList, (item) => {
        if (id.indexOf(item.id) !== -1) {
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
    if (this.geo.locationList) {
      this.locationList = [...this.geo.locationList];
      this.populateItems();
      this.showLoader = false;
    } else {
      const params = { rootOrgId: this.rootOrgId };
      // Make api call to get location(s)

      this.geo.getLocations(params).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (data: ServerResponse) => {
          if (data.result.response) {
            this.locationList = (data.result.response);
            this.populateItems();
          }
          this.showLoader = false;
        },
        (error: ServerResponse) => {
          this.showLoader = false;
          this.showError = true;
        }
      );
    }
  }

  /**
   * Function to set / reset selected items
   *
   * @param {boolean} event true / false
   * @param {IGeoLocationDetails} item selected location details
   * @param {string} id location id
   */
  toggle(event: boolean, item: IGeoLocationDetails, id: string) {
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
    this.rootOrgId = this.user.rootOrgId;
    this.validateAdaptor();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
