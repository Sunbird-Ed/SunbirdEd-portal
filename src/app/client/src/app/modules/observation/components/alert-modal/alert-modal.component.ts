import { Component, OnInit } from '@angular/core';
import { SuiModal, ComponentModalConfig, ModalSize } from "ng2-semantic-ui";

interface IAlertModalContext {
    data:any;
}

@Component({
  selector: "app-alert-modal",
  templateUrl: "./alert-modal.component.html",
  styleUrls: ["./alert-modal.component.scss"],
})
export class AlertModalComponent {
  isChecked = false;
  isDisabled = true;
  constructor(public modal: SuiModal<IAlertModalContext, void, void>) {}
  checkValue(event: any) {
    if (event == true) {
      this.isDisabled = false;
      return;
    }
    this.isDisabled = true;
  }
}

export class AlertModal extends ComponentModalConfig<IAlertModalContext, void, void> {
  isDisabled = false;
  constructor(data: any) {
    super(AlertModalComponent, { data });

    this.transitionDuration = 200;
    this.isClosable = false;
    
    if(data.content.body.type=='text'){
    this.size = ModalSize.Mini;
    }
    else{
      this.size = ModalSize.Tiny;
    }
  }
  
}
