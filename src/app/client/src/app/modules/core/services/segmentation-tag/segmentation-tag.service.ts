import { Injectable } from '@angular/core';
import { FrameworkService } from '../framework/framework.service';

@Injectable({
  providedIn: 'root'
})

export class SegmentationTagService {

  private comdList = [];
  public exeCommands = [];

  constructor(private frameworkService: FrameworkService) { }

  getSegmentCommand() {
    // FormConfig for Segment
    this.frameworkService.getSegmentationCommands()
    .then(cmdList => {
        if (cmdList && cmdList.length) {
            this.comdList = cmdList;
            this.evalCriteria();
        }
    });
  }

  async getUpdatedCommands() {
    this.exeCommands = [];
    this.evalCriteria();
  }

  evalCriteria() {
    const validCommand = window['TagManager'].SBActionCriteriaService.evaluateCriteria(
      window['TagManager'].SBTagService.__tagList,
        this.comdList
    );
    this.executeCommand(validCommand);
  }

  async executeCommand(validCmdList) {
    /*
    ** check if command already exist in command list
    ** check if command already executed, then do nothing
    ** if new command then execute command and store it in executedCommandList
    */
    validCmdList.forEach(cmdCriteria => {
        if (!this.exeCommands.find(ele => ele.commandId === cmdCriteria.commandId)) {
            switch (cmdCriteria.controlFunction) {
                case 'BANNER_CONFIG':
                    if (cmdCriteria.targetedClient === 'portal' && cmdCriteria.controlFunctionPayload && cmdCriteria.controlFunctionPayload.showBanner) {
                        this.exeCommands.push(cmdCriteria);
                    }
                    break;
                default:
                    break;
            }
        }
    });
  }
}
