import { Component, OnInit, Input } from '@angular/core';
import {SuiAccordionModule} from 'ng2-semantic-ui';

@Component({
  selector: 'app-chapter-list',
  templateUrl: './chapter-list.component.html',
  styleUrls: ['./chapter-list.component.scss']
})
export class ChapterListComponent implements OnInit {

  @Input() selectedOptionsMethod: any;

  topicList: any;
  public textBookChapters: any;
  constructor() { }

  ngOnInit() {
    this.textBookChapters = {
      'chapters': [
        {
          'name': 'chapter1',
          'vsa': {
            'name': 'VSA',
            'total': '10',
            'me': '2'
          },
          'sa': {
            'name': 'SA',
            'total': '10',
            'me': '2'
          },
          'lsa': {
            'name': 'LSA',
            'total': '10',
            'me': '2'
          },
          'mcq': {
            'name': 'MCQ',
            'total': '10',
            'me': '2'
          }
        },
        {
          'name': 'chapter2',
          'vsa': {
            'name': 'VSA',
            'total': '10',
            'me': '2'
          },
          'sa': {
            'name': 'SA',
            'total': '10',
            'me': '2'
          },
          'lsa': {
            'name': 'LSA',
            'total': '10',
            'me': '2'
          },
          'mcq': {
            'name': 'MCQ',
            'total': '10',
            'me': '2'
          }
        },
        {
          'name': 'chapter3',
          'vsa': {
            'name': 'VSA',
            'total': '10',
            'me': '2'
          },
          'sa': {
            'name': 'SA',
            'total': '10',
            'me': '2'
          },
          'lsa': {
            'name': 'LSA',
            'total': '10',
            'me': '2'
          },
          'mcq': {
            'name': 'MCQ',
            'total': '10',
            'me': '2'
          }
        },
        {
          'name': 'chapter4',
          'vsa': {
            'name': 'VSA',
            'total': '10',
            'me': '2'
          },
          'sa': {
            'name': 'SA',
            'total': '10',
            'me': '2'
          },
          'lsa': {
            'name': 'LSA',
            'total': '10',
            'me': '2'
          },
          'mcq': {
            'name': 'MCQ',
            'total': '10',
            'me': '2'
          }
        },
        {
          'name': 'chapter5',
          'vsa': {
            'name': 'VSA',
            'total': '10',
            'me': '2'
          },
          'sa': {
            'name': 'SA',
            'total': '10',
            'me': '2'
          },
          'lsa': {
            'name': 'LSA',
            'total': '10',
            'me': '2'
          },
          'mcq': {
            'name': 'MCQ',
            'total': '10',
            'me': '2'
          }
        }
      ]
    };
    this.topicList = this.selectedOptionsMethod.topics;
    console.log(this.selectedOptionsMethod);
  }

}
