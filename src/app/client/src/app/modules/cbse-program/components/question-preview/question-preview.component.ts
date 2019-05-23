import { Component, OnInit, Input, Pipe, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { config } from 'rxjs';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss']
})
export class QuestionPreviewComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() questionMetaData: any;
  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    $(document).on('click', '.mcq-title .chevron', (e) => {
      $(e.target).parent().toggleClass('expand');
      $(this).off('click');
    });
  }

  @HostListener('scroll', ['$event.target'])
  onScroll(event: any) {
    if (event === 'question') {
      $('.sb-question-content').animate( {
        scrollTop: $('#' + event).offset().top
      });
    } else if (event === 'answer') {
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
  ngOnDestroy() {
    $(document).off('click', '.mcq-title .chevron');
  }
}
