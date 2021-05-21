import { Component, OnInit } from '@angular/core';
import { SuiModal, ComponentModalConfig, ModalSize } from "ng2-semantic-ui";

interface IAlertModalContext {
    message?:string;
    title?:string;
    button1?:string;
    button2?:string;
}

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})

export class AlertModalComponent {
  constructor(public modal:SuiModal<IAlertModalContext, void, void>) {}
}

export class AlertModal extends ComponentModalConfig<IAlertModalContext, void, void> {
  constructor(message:string, title:string,button1?:string,button2?:string) {
      super(AlertModalComponent, { message, title, button1,button2 });

      this.transitionDuration = 200;
      this.isClosable = false;
      this.size = ModalSize.Mini;
  }
}
