import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit, AfterViewInit {
 @Output() questionFormMeta = new EventEmitter<any>();
  public  questionTabs = [];
  public active: boolean[] = [];
  public emptyState = true;
  public questionMetaData: any;
  public editorMode: any;
  public enableCreateButton = true;
  public tabs: { header: string; content: string }[] = [
      { header: 'Q', content: '' }
  ];
  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }
  public createButtonHandler(event) {
    this.enableCreateButton = event;
  }
  public addTab(): void {
    this.emptyState = false;
    this.enableCreateButton = false;
    this.editorMode = 'edit';
    this.questionMetaData = {
        mode : this.editorMode,
        data : ''
    };
    // this.active.push(true);
    // console.log(this.tabs.length);
    // console.log(document.querySelector( '#editor' ));
}
public questionStatusHandler(status) {
    if (status === 'failed') {
        console.log('FAILEEDDDDD');
    } else {
        this.editorMode = 'view';
        this.questionMetaData = {
            mode : this.editorMode,
            data : ''
        };
        this.enableCreateButton = true;
        this.questionTabs.push(this.questionTabs.length);
    }
}
public removeTab(): void {
    this.active.pop();
    this.tabs.pop();
}

}
