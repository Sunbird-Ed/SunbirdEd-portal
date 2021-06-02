import { Component, Input, OnInit } from "@angular/core";
import { ResourceService } from "@sunbird/shared";
import { Output, EventEmitter } from "@angular/core";
import { Question } from "../../Interface/assessmentDetails";

@Component({
  selector: "app-remarks",
  templateUrl: "./remarks.component.html",
  styleUrls: ["./remarks.component.scss"],
})
export class RemarksComponent implements OnInit {
  remark = "";
  showRemarks;
  @Output() saveClicked = new EventEmitter();
  @Input() question: Question;
  constructor(public resourceService: ResourceService) {}

  ngOnInit() {
    this.remark = this.question.remarks;
    this.remark ? this.showRemarks = true : false
  }

  saveRemark() {
    this.question.remarks = this.remark;
    this.saveClicked.emit({ value: this.remark });
  }

  deleteRemark() {
    this.remark = "";
    this.saveRemark();
    this.showRemarks=false
  }
}
