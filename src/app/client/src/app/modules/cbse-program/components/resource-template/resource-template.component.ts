import { Component, OnInit, ViewChild, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ISessionContext, IChapterListComponentInput, IResourceTemplateComponentInput } from '../../interfaces';
import { ProgramTelemetryService } from '../../../program/services';
import { ConfigService } from '@sunbird/shared';
import { UserService } from '@sunbird/core';

@Component({
  selector: 'app-resource-template',
  templateUrl: './resource-template.component.html',
  styleUrls: ['./resource-template.component.scss']
})
export class ResourceTemplateComponent implements OnInit, OnDestroy {

  @ViewChild('modal') private modal;
  @Input() resourceTemplateComponentInput: IResourceTemplateComponentInput = {};
  @Output() templateSelection = new EventEmitter<any>();
  showButton = false;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any;
  public templateList;
  public templateSelected;
  public programContext;
  public sessionContext;
  public unitIdentifier;
  constructor( public programTelemetryService: ProgramTelemetryService, public userService: UserService,
    public configService: ConfigService ) { }


  ngOnInit() {
    this.templateList = _.get(this.resourceTemplateComponentInput, 'templateList');
    this.programContext = _.get(this.resourceTemplateComponentInput, 'programContext');
    this.sessionContext = _.get(this.resourceTemplateComponentInput, 'sessionContext');
    this.unitIdentifier  = _.get(this.resourceTemplateComponentInput, 'unitIdentifier');

    // tslint:disable-next-line:max-line-length
    this.telemetryInteractCdata = this.programTelemetryService.getTelemetryInteractCdata(this.programContext.userDetails.programId, 'Program');
    // tslint:disable-next-line:max-line-length
    this.telemetryInteractPdata = this.programTelemetryService.getTelemetryInteractPdata(this.userService.appId, this.configService.appConfig.TELEMETRY.PID + '.programs');
     // tslint:disable-next-line:max-line-length
     this.telemetryInteractObject = this.programTelemetryService.getTelemetryInteractObject(this.unitIdentifier, 'Content', '1.0', {l1: this.sessionContext.collection});
  }


  handleSubmit() {
    const templateDetails = _.find(this.templateList, (template) => {
      return template.id === this.templateSelected;
    });
    this.templateSelection.emit({ type: 'next', template: this.templateSelected, templateDetails: templateDetails });
  }

  ngOnDestroy() {
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
  }

}
