import { Router } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { Component, OnInit, AfterViewInit, Output, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-watch-video',
  templateUrl: './watch-video.component.html',
  styleUrls: ['./watch-video.component.scss']
})
export class WatchVideoComponent implements OnInit {

  @ViewChild('modal') modal;
  @Output() closeVideoModal = new EventEmitter<any>();

  constructor(public resourceService: ResourceService, public router: Router, ) { }

  ngOnInit() {
  }
  closeModal() {
    this.closeVideoModal.emit('success');
  }
  modalClose() {
    this.modal.deny();
  }
}
