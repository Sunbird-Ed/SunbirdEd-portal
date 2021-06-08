import { Component, OnInit } from '@angular/core';
import { ResourceService } from "@sunbird/shared";
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.html',
  styleUrls: ['./remarks.component.scss']
})
export class RemarksComponent implements OnInit {
  remark="";
  isEditable=false;
  @Output() saveClicked = new EventEmitter();
  constructor(public resourceService: ResourceService) { }

  ngOnInit() {
  }

  saveRemark(){
  this.saveClicked.emit({value:this.remark});
}

}
