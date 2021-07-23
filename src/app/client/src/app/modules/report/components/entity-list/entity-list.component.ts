import { LocationStrategy } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ResourceService } from '@sunbird/shared';

@Component({
  selector: 'app-entity-list',
  templateUrl: './entity-list.component.html',
  styleUrls: ['./entity-list.component.scss'],
})
export class EntityListComponent implements OnInit {
  @ViewChild('modal') modal;
  @Output() closeEvent = new EventEmitter<any>();
  @Input() solution: any;
  showLoaderBox = false;
  public throttle = 50;
  public scrollDistance = 2;
  selectedListCount = 0;
  showSuccessModal;
  selectedEntity: any;
  constructor(public resourceService: ResourceService, public location: LocationStrategy) {
    this.location.onPopState(() => {
      this.modal.deny();
   });
  }

  ngOnInit() {}

  public closeModal() {
    this.modal.approve();
    this.closeEvent.emit({value: null});
  }
  onEntityChange(entity) {
    this.selectedEntity = {};
    this.solution.entities.forEach(item => {
      if (item._id !== entity._id) {
         item.selected = false;
      } else {
         item.selected = true;
         this.selectedEntity = entity;
      }
    });
    this.selectedListCount = 1;
  }

  submit() {
    const data = {
      solutionDetail: this.solution,
      selectedEntity: this.selectedEntity
    };
    this.closeEvent.emit({value: data});
    this.modal.approve();
  }
}
