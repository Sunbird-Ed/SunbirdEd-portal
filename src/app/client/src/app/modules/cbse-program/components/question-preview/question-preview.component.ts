import { Component, OnInit, Input, Pipe, HostListener } from '@angular/core';
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

  @HostListener('scroll', ['$event.target'])
  onScroll(event: any) {
    if (event === 'question' || event === 'answer') {
      const el = document.getElementById(event);
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    } else if (event.target.scrollTop > (event.target.lastChild.offsetHeight / 2)) {
      document.getElementById('questionBtn').style.display = 'inline-block';
      document.getElementById('answerBtn').style.display = 'none';
    } else if (event.target.scrollTop < (event.target.firstChild.offsetHeight / 2) ) {
      document.getElementById('answerBtn').style.display = 'inline-block';
      document.getElementById('questionBtn').style.display = 'none';
    }

  }
}
