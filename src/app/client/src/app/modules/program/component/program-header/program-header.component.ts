import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';

interface IHeaderActions {
  showTabs?: any;
}

@Component({
  selector: 'app-program-header',
  templateUrl: './program-header.component.html',
  styleUrls: ['./program-header.component.scss']
})
export class ProgramHeaderComponent implements OnInit {

  @Input() headerComponentInput: any;
  @Output() emitTabChange = new EventEmitter<any>();

  public tabs: any;
  public programRoles: Array<any>;
  public defaultTabIndex: number;
  public defaultRole: string;
  public userRoles: Array<string>;
  public actionRoles: any;
  public headerActions: IHeaderActions = {};
  public tabsToShow = [];
  constructor() { }

  ngOnInit() {

    this.tabs = _.get(this.headerComponentInput, 'header.config.tabs');
    this.headerActions = {
      showTabs: _.get(this.headerComponentInput, 'actions.showTabs')
    };
    this.userRoles = _.get(this.headerComponentInput, 'userDetails.roles[0]');
    this.programRoles = _.get(this.headerComponentInput, 'roles');
    this.defaultTabIndex = 1;
    const tabRoles = _.find(this.programRoles, {'name': this.userRoles}).tabs;
      this.tabs.forEach(tab => {
        if (tabRoles && tabRoles.includes(tab.index)) {
          // console.log(`Tab${tab.index} - SHOW FOR ${this.userRoles}`);
          tab.visibility = true;
        } else {
            // console.log(`Tab${tab.index} - HIDE FOR ${this.userRoles}`);
            console.log('Tab show action is not defined '); // TODO: change to toaster
        }
      });
  }

  filterBy(prop: string) {
    return _.sortBy(this.tabs, ['index']);
  }


  handleTabChange(component, index) {
    this.emitTabChange.emit(component);
    this.defaultTabIndex = index;
  }

}
