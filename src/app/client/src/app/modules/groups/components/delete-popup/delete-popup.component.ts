import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {
  @Input() modalName: string;
  @Input() member;
  constructor() { }

  ngOnInit() {
  }

}
