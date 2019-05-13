import { Component, OnInit, Input } from '@angular/core';
import { config } from 'rxjs';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss']
})
export class QuestionPreviewComponent implements OnInit {

  @Input() config: any;
  @Input() data: any;
  constructor() { }

  ngOnInit() {
  }

}
