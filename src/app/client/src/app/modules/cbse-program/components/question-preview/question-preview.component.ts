import { Component, OnInit, Input, Pipe} from '@angular/core';
import { config } from 'rxjs';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss']
})
export class QuestionPreviewComponent implements OnInit {

  @Input() previewConfig: any;
  @Input() previewData: any;
  constructor() { }

  ngOnInit() {
    console.log(this.previewConfig);
    console.log(this.previewData);
  }

}
