import { Subscription } from 'rxjs';
import { IConceptData } from './../../interfaces';
import { ConceptPickerService } from './../../services';
import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'app-concept-picker',
  templateUrl: './concept-picker.component.html',
  styleUrls: ['./concept-picker.component.css']
})
export class ConceptPickerComponent implements OnInit, OnDestroy {
  private conceptPickerService: ConceptPickerService;
  /**
   * concept Data
   */
  conceptData: Array<IConceptData>;
  /**
   * selectedConcepts Data
   */
  @Input() selectedConcepts: any;
  /**
   * class for concept picker
   */
  @Input() conceptPickerClass: string;

  /**
   * message about how many concept are selected
   */
  pickerMessage: string;
  /**
   * This variable hepls to show and hide page loader.
   * It is kept true by default as at first when we comes
   * to a page the loader should be displayed before showing
   * any data
   */
  showLoader = true;
  contentConcepts: any;
  conceptDataSubscription: Subscription;
  /**
   * emits selected concepts
   */
  @Output('Concepts')
  Concepts = new EventEmitter();
  /**
    * Constructor to create injected service(s) object
    * Default method of Draft Component class
    * @param {ConceptPickerService} conceptPickerService Reference of ConceptPickerService
  */
  constructor(conceptPickerService: ConceptPickerService) {
    this.conceptPickerService = conceptPickerService;
  }
  /**
   * call tree picker
   */
  initConceptBrowser() {
    this.selectedConcepts = this.selectedConcepts || [];
    this.contentConcepts = _.map(this.selectedConcepts, 'identifier');
    this.pickerMessage = this.contentConcepts.length + ' concepts selected';
    $('.tree-picker-selector').val(this.pickerMessage);
    setTimeout(() => {
      $('.tree-picker-selector').treePicker({
        data: this.conceptData,
        name: 'Concepts',
        picked: this.contentConcepts,
        onSubmit: (nodes) => {
          $('.tree-picker-selector').val(nodes.length + ' concepts selected');
          const contentConcepts = [];
          _.forEach(nodes, (obj) => {
            contentConcepts.push({
              identifier: obj.id,
              name: obj.name
            });
          });
          this.selectedConcepts = contentConcepts;
          this.Concepts.emit(this.selectedConcepts);
        },
        nodeName: 'conceptSelector_treePicker',
        minSearchQueryLength: 1
      });
      setTimeout(() => {
        document.getElementById('conceptSelector_treePicker').classList.add(this.conceptPickerClass);
      }, 500);
    }, 500);
  }
  /**
   * calls conceptPickerService and initConceptBrowser
   */
  ngOnInit() {
    this.conceptDataSubscription = this.conceptPickerService.conceptData$.subscribe(apiData => {
      if (apiData && !apiData.err) {
        this.showLoader = false;
        this.conceptData = apiData.data;
        this.initConceptBrowser();
      } else if (apiData && apiData.err) {
        this.showLoader = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.conceptDataSubscription) {
      this.conceptDataSubscription.unsubscribe();
    }
  }
}
