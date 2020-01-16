import { Component, OnInit, Input, Output, OnChanges, OnDestroy,  EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService } from '@sunbird/core';
import { ToasterService, ConfigService} from '@sunbird/shared';
import { ProgramStageService, ProgramTelemetryService } from '../../services/';
import { IHeaderActions, InitialState } from '../../interfaces/';
import { tap, delay, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-program-header',
  templateUrl: './program-header.component.html',
  styleUrls: ['./program-header.component.scss']
})
export class ProgramHeaderComponent implements OnInit, OnChanges, OnDestroy {

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
  public stageSubscription: any;
  public state: InitialState = {
    stages: []
  };
  constructor(public toasterService: ToasterService, public programStageService: ProgramStageService,
     public userService: UserService, public configService: ConfigService,
     public programTelemetryService: ProgramTelemetryService) { }

  ngOnInit() {
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.handleTabs();
    });
    this.generateTabs();
  }

  generateTabs() {
    this.tabs = _.get(this.headerComponentInput, 'header.config.tabs');
    this.headerActions = {
      showTabs: _.get(this.headerComponentInput, 'actions.showTabs') || _.get(this.headerComponentInput, 'showTabs')
    };
    this.userRoles = _.get(this.headerComponentInput, 'userDetails.roles[0]');
    this.programRoles = _.get(this.headerComponentInput, 'roles');
    this.defaultTabIndex = _.find(this.programRoles, {'name': this.userRoles}).defaultTab;
    const tabRoles = _.find(this.programRoles, {'name': this.userRoles}).tabs;
    this.tabs.forEach(tab => {
      if (tabRoles && tabRoles.includes(tab.index)) {
        tab.visibility = true;
      }
    });
  }
  ngOnChanges() {
    this.generateTabs();
  }

  handleTabs() {
    this.headerActions.showTabs = (this.state.stages.length > 1) ? false : true;
  }

  filterBy(prop: string) {
    return _.sortBy(this.tabs, ['index']);
  }
  handleBack() {
    this.programStageService.removeLastStage();
  }

  handleTabChange(component, index) {
    this.programStageService.removeLastStage();
    this.emitTabChange.emit(component);
    this.programStageService.addStage(component);
    this.defaultTabIndex = index;
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
