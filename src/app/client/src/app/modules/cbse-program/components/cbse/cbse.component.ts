import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cbse',
  templateUrl: './cbse.component.html',
  styleUrls: ['./cbse.component.scss']
})
export class CbseComponent implements OnInit {

  public stageId: any;
  // @Output() defaultSelectedOptions = new EventEmitter<any>();
  public selectedOptions: any;
  public stages: Array<any>;
  public currentStage: any;
  public defaultSelectedOptions: any;
  constructor() { }

  ngOnInit() {
    this.stages = ['chooseClass', 'topicList', 'createQuestion'];
    this.stageId = 0;
    this.currentStage = this.stages[0];
  }

  public selectedTextbookHandler(event) {
    console.log('PARENT COMPONENT ');
    console.log(event);
    this.selectedOptions =  event;
    this.changeStage('next');
  }
  public changeStage(state) {
    this.currentStage = (state) === 'previous' ? this.stages[this.stageId] : this.stages[this.stageId + 1];
    this.defaultSelectedOptions = this.selectedOptions;
    console.log(this.selectedOptions);

  }
}
