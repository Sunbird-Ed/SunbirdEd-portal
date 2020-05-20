import { Component, OnInit, Input, ViewChild, Output, EventEmitter, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-group-actions',
  templateUrl: './group-actions.component.html',
  styleUrls: ['./group-actions.component.scss']
})
export class GroupActionsComponent implements OnInit {

  @ViewChild('modal') modal;
  @Input() modalName: string;
  @Output() modalClosed = new EventEmitter();
  @Input() pastMembersList;
  @Input() groupName: string;

  constructor(private renderer: Renderer2) {
    this.renderer.listen('window', 'click', (e: Event) => {
      if (e.target['tabIndex'] === -1) {
        this.closeModal();
      }
     });
   }

  ngOnInit() {
  }

  closeModal() {
    this.modal.close();
    this.modalClosed.emit();
  }
}
