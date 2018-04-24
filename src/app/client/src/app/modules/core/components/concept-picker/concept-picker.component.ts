import { ConceptPickerService } from './../../services/concept-picker/concept-picker.service';
import { ServerResponse, ResourceService, ToasterService } from '@sunbird/shared';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
declare var $: any;
@Component({
  selector: 'app-concept-picker',
  templateUrl: './concept-picker.component.html',
  styleUrls: ['./concept-picker.component.css']
})
export class ConceptPickerComponent implements OnInit {
  private conceptPickerService: ConceptPickerService;
  /**
   * concept Data
   */
  conceptData: object;
  /**
   * selectedConcepts Data
   */
  @Input() selectedConcepts: any;
  /**
   * number of selectedConcepts Data
   */
  contentConcepts: any;
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
  /**
   * emits selected concepts
   */
  @Output('Concepts')
  Concepts = new EventEmitter<any>();
  /**
    * Constructor to create injected service(s) object
    * Default method of Draft Component class
    * @param {ConceptPickerService} conceptPickerService Reference of ConceptPickerService
  */
  constructor( conceptPickerService: ConceptPickerService) {
    this.conceptPickerService = conceptPickerService;
  }
  /**
   * call tree picker
   */
  initConceptBrowser() {
    this.selectedConcepts = this.selectedConcepts || [];
    this.contentConcepts = this.selectedConcepts;
    this.pickerMessage = this.contentConcepts.length + ' concepts selected';
    $('.tree-picker-selector').val(this.pickerMessage);
    setTimeout(() => {
      $('.tree-picker-selector').treePicker({
        data: this.conceptData,
        name: 'Concepts',
        picked: this.contentConcepts,
        onSubmit: (nodes) => {
          $('.tree-picker-selector').val(nodes.length + ' concepts selected');
          this.contentConcepts = [];
          _.forEach(nodes, (obj) => {
            this.contentConcepts.push({
              id: obj.id,
              name: obj.name
            });
          });
          this.selectedConcepts = this.contentConcepts;
          this.Concepts.emit(this.selectedConcepts);
        },
        nodeName: 'conceptSelector_treePicker',
        minSearchQueryLength: 1
      });
    }, 500);
  }
  /**
   * calls conceptPickerService and initConceptBrowser
   */
  ngOnInit() {
    this.conceptPickerService.conceptData$.subscribe(apiData => {
      if (apiData && !apiData.err) {
        this.showLoader = false;
        this.conceptData = apiData.data;
        this.initConceptBrowser();
      } else if (apiData && apiData.err) {
        this.showLoader = false;
      }
    });
  }
}
