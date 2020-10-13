import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';


@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {

  public unsubscribe$ = new Subject<void>();
  // userPreference: FormGroup;
  // selectStateOption: any = [];
  // selectLanguageOption: any = [];
  // selectState:any;
  // selectLanguage:any;
  // showSelectImageModal;
  // showUploadUserModal;
  constructor() { }

  ngOnInit() {
    // this.selectStateOption = [
    //   {
    //     name: 'Karnataka',
    //     value: '0'
    //   },
    //   {
    //     name: 'Maharashtra',
    //     value: '1'
    //    },
    //    {
    //     name: 'Tamil Nadu',
    //     value: '2'
    //   },
    //   {
    //     name: 'Andhra Pradesh',
    //     value: '3'
    //    },
    // ];
    // this.selectLanguageOption = [
    //   {
    //     name: 'All',
    //     value: '0'
    //   },
    //   {
    //     name: 'hindi',
    //     value: '1'
    //    },
    //    {
    //     name: 'English',
    //     value: '2'
    //   }
    // ];
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createCertTemplate() {

  }

  onTemplateChange() {

  }
}
