import { Injectable } from '@angular/core';
import { CollectionComponent, DashboardComponent, ContentUploaderComponent, QuestionListComponent } from '../../../cbse-program';
import { ToasterService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class ProgramComponentsService {
  private componentMapping = {
    dashboardComponent: DashboardComponent,
    collectionComponent: CollectionComponent,
    uploadComponent: ContentUploaderComponent,
    questionSetComponent: QuestionListComponent,
    curiositySetComponent: QuestionListComponent
  };
  constructor(public toasterService: ToasterService) {

  }

  getComponentInstance(component) {
    if (!this.componentMapping[component]) {
      this.toasterService.error('Component not configured for the content type');
    }
    return this.componentMapping[component];
  }
}
