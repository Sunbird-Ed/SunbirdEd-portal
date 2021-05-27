import { Component, Input, OnInit } from "@angular/core";
import { ResourceService } from "@sunbird/shared";

@Component({
  selector: "question-generic-inputs",
  templateUrl: "./question-generic-inputs.component.html",
  styleUrls: ["./question-generic-inputs.component.scss"],
})
export class QuestionGenericInputsComponent implements OnInit  {
  @Input() questions: any;
  @Input() questionnaireForm: any;
  selectedIndex:any;
  constructor(public resourceService: ResourceService) {}

  ngOnInit() {}


openRemark(data,i){
  this.selectedIndex=i;
  data["isRemarkClicked"]=true;
}

deleteRemarks(data,i){
  data["isRemarkClicked"]=false;
}

saveClicked(event,data) {
  data["isRemarkClicked"]=false;
}


}