import { Component, ContentChild, OnInit, Directive, TemplateRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { v4 as UUID } from 'uuid';
import { Overlay } from '@angular/cdk/overlay';


const modalSizeToMinWidthMapping = {
  small: '30rem',
  normal: '45rem',
  large: '56.5rem'
};

type ModalSize = keyof typeof modalSizeToMinWidthMapping;
interface AdditionalConfig {
  size: string;
}
type IMatDialogConfig = MatDialogConfig & AdditionalConfig;

@Directive({
  selector: '[sbModalContent]'
})
export class ModalContentDirective {
  constructor(private templateRef: TemplateRef<any>) { }
}

/**
 * @description Wrapper component to turn semantic modals into Material UI Modals
 * @export
 * @class ModalWrapperComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-modal-wrapper',
  template: ''
})
export class ModalWrapperComponent implements OnInit, OnDestroy {

  @Input() config: IMatDialogConfig;
  @ContentChild(ModalContentDirective, { static: true }) private modalContent: any;
  @Output() dismiss = new EventEmitter();
  public modal: MatDialogRef<unknown>;

  private getDefaultConfig(): MatDialogConfig {
    return { disableClose: true };
  }

  constructor(private matDialog: MatDialog, private overlay: Overlay) { }

  private getDialogConfig(): MatDialogConfig {
    const { size: modalSize = 'normal', id = UUID(), data = {}, scrollStrategy = this.overlay.scrollStrategies.reposition(), ...config } = this.config || {};
    return {
      id,
      ...this.getDefaultConfig(),
      ...config,
      data: { id, ...data },
      // scrollStrategy
    };
  }

  private open(templateRef: TemplateRef<any>, options: MatDialogConfig): MatDialogRef<any> {
    this.setElementStyle(document.body)('overflow', 'hidden');
    this.setElementStyle(document.documentElement)('overflow', 'hidden');
    return this.matDialog.open(templateRef, options);
  }

  public deny() {
    this.modal && this.modal.close();
  }

  private subscribeToDialogDismiss() {
    this.modal && this.modal.afterClosed().subscribe(event => {
      this.setElementStyle(document.body)('overflow', 'auto');
      this.setElementStyle(document.documentElement)('overflow', 'inherit');
      this.dismiss.emit(event);
    });
  }

  ngOnInit(): void {
    const config = this.getDialogConfig();
    this.modal = this.open(this.modalContent.templateRef, config);
    this.subscribeToDialogDismiss();
  }

  ngOnDestroy() {
    this.deny();
  }

  private setElementStyle(element: HTMLElement) {
    return (styleProperty: string, styleValue: string) => {
      element.style[styleProperty] = styleValue;
    };
  }
}




