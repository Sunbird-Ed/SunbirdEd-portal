import { Component, Input } from '@angular/core';
import {ResourceService } from '@sunbird/shared';
import { GeneraliseLabelService } from '@sunbird/core';
import { CslFrameworkService } from '../../../../public/services/csl-framework/csl-framework.service';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent {
  @Input() courseHierarchy: any;
  readMore = false;
  public transformCourseHierarchy;
  public frameworkCategoriesList;

  constructor(public resourceService: ResourceService, public generaliseLabelService: GeneraliseLabelService, public cslFrameworkService: CslFrameworkService) {
    this.frameworkCategoriesList = this.cslFrameworkService.getGlobalFilterCategoriesObject();
    this.transformCourseHierarchy = this.cslFrameworkService.transformContentDataFwBased(this.frameworkCategoriesList,this.courseHierarchy);
   }
}
