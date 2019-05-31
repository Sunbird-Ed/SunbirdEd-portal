import { Component, OnInit, Input, Pipe, HostListener, AfterViewInit, OnDestroy, OnChanges } from '@angular/core';
import { config } from 'rxjs';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss']
})
export class QuestionPreviewComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input() questionMetaData: any;
  constructor() { }

  ngOnInit() {

  }
  
  ngOnChanges(){

  }

  ngAfterViewInit() {
    $(document).on('click', '.cheveron-helper .chevron', (e) => {
      $('.mcq-title').toggleClass('expand');
      $(e.target).toggleClass('icon-active');
      console.log('icon', e.target);
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
    $(document).off('click', '.cheveron-helper .chevron');
  }
}
