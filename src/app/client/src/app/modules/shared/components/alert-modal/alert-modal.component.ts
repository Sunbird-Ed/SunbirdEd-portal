import { Component, OnInit } from '@angular/core';
import { SuiModal, ComponentModalConfig, ModalSize } from "ng2-semantic-ui";
import { Location } from '@angular/common';

interface IAlertModalContext {
    data:any;
}

@Component({
  selector: "app-alert-modal",
  templateUrl: "./alert-modal.component.html",
  styleUrls: ["./alert-modal.component.scss"],
})
export class AlertModalComponent {
  isChecked=false;
  constructor(public modal: SuiModal<IAlertModalContext, void, void>,private location:Location) {}

  getMethod(data){
    if(data.type=="cancel"){
      this.modal.deny(data.returnValue);
      return;
    }
    this.modal.approve(data.returnValue);
  }

  navigatePrevious(data){
    data.footer.buttons[0].returnValue=false;
    this.modal.deny(data.footer.buttons[0].returnValue);
    this.location.back();    
  }

}

export class AlertModal extends ComponentModalConfig<IAlertModalContext, void, void> {
  constructor(data: any) {
    super(AlertModalComponent, { data });

    this.transitionDuration = 200;
    this.isClosable = false;
    
    switch (data.size) {
      case "mini":
        this.size = ModalSize.Mini;
        break;
      case "tiny":
        this.size = ModalSize.Tiny;
        break;
      case "small":
        this.size = ModalSize.Small;
        break;
      case "normal":
        this.size = ModalSize.Normal;
        break;
      case "large":
        this.size = ModalSize.Large;
        break;
    }
  }
  
}
