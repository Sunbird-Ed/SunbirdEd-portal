import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-cbse',
  templateUrl: './cbse.component.html',
  styleUrls: ['./cbse.component.scss']
})
export class CbseComponent implements OnInit {

  @Input() programDetails: any;
  @Input() userProfile: any;
  public selectedOptions: any;
  public stages: Array<string> = ['chooseClass', 'topicList', 'createQuestion'];
  public currentStage = 0;
  public defaultSelectedOptions: any;
  constructor() { }

  ngOnInit() {
    console.log('programDetails', this.programDetails, this.userProfile);
  }

  public selectedTextbookHandler(event) {
    console.log(event);
    this.selectedOptions =  event;
    this.navigate('next');
  }
  navigate(step) {
    if (step === 'next') {
      this.currentStage = this.currentStage + 1;
    } else if (step === 'prev') {
      this.currentStage = this.currentStage - 1;
    }
  }
}
