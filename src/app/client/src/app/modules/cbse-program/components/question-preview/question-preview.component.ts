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

  scroll(id) {
    if (id === 'question') {
      document.getElementById('answerBtn').style.display = 'block';
      document.getElementById('questionBtn').style.display = 'none';
    } else {
      document.getElementById('questionBtn').style.display = 'block';
      document.getElementById('answerBtn').style.display = 'none';
    }
    const el = document.getElementById(id);
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });

  }

  @HostListener('scroll', ['$event.target'])
  onScroll(event: any) {
    if (event.target.scrollTop > (event.target.firstChild.offsetHeight - event.target.firstChild.offsetTop )) {
      document.getElementById('questionBtn').style.display = 'block';
      document.getElementById('answerBtn').style.display = 'none';
    } else if (event.target.scrollTop < (event.target.firstChild.offsetHeight - event.target.firstChild.offsetTop) ) {
      document.getElementById('answerBtn').style.display = 'block';
      document.getElementById('questionBtn').style.display = 'none';
    }

  }

}
