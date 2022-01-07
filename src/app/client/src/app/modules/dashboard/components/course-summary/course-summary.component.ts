
import { Component, OnInit, Input } from '@angular/core';
import { SummaryReportsService } from './../../services';
import { UserService, SearchService } from '@sunbird/core';
import * as _ from 'lodash-es';

/**
 * The CourseSummaryCourses component
 *
 * Display summary reports for cash
 */
@Component({
  selector: 'app-course-summary',
  templateUrl: './course-summary.component.html',
  styleUrls: ['./course-summary.component.scss']
})

/**
 * @class CourseSummaryComponent
*/
export class CourseSummaryComponent implements OnInit{ 

  /**
   * To get logged-in user profile
   */
  userService: UserService;

  /**
   * Default method of CourseSummaryCourses class
   *
   * @param {SummaryReportsService} coursesSummaryCourses To get language constant
   */

  constructor( userService: UserService,
    public coursesSummaryCourses: SummaryReportsService) {
    this.userService = userService;
  }

  courseBatchesData:any;
  arrrayCourseReports : any = [];
  @Input() paginateLimit: number = 5;
  p: any;

  // Bar chart
  barChartLabels:any;
  barChartType = 'bar';
  barChartLegend :boolean= true;
  barChartData:any;
  public barChartOptions:any;
  orgIds : any;

  // Pie chart
  pieChartOptions : any;
  pieChartLabels :any;
  pieChartData : any;
  pieChartType = 'pie';
  pieChartLegend : boolean= true;
  pieChartPlugins = [];

  ngOnInit()
  {
    this.coursesSummaryCourses.getCourseSummaryReports(this.userService._rootOrgId).subscribe((res) => {
    if (res.responseCode == "OK") 
    {
      this.courseBatchesData = res.result.content;
      var courseBatchesIds: string[] = [];
      var totalCourseEnrolled: string[] = [];
      var totalCourseCompleted: string[] = [];
      var totalCompleted = 0;
      var totalEnrolled = 0;
      var totalIncompleted = 0;
      this.courseBatchesData.forEach(function (value) {

      if(value.batchId || value.totalCompleted)
      {
        courseBatchesIds.push(value.batchName);
        totalCourseEnrolled.push(value.totalEnrolled);
        totalCourseCompleted.push(value.totalCompleted);

        totalCompleted = totalCompleted + value.totalCompleted;
        totalEnrolled = totalEnrolled + value.totalEnrolled;         
      }
      });
      totalIncompleted = totalEnrolled - totalCompleted;
      this.createBarGraph(courseBatchesIds,totalCourseEnrolled,totalCourseCompleted);
      this.createPieChart(totalIncompleted,totalCompleted);
    }
    },(err) => {
      console.log({ err });
    });
  }

  createBarGraph(courseBatcheIds,totalCourseEnrolled,totalCourseCompleted)
  {
    this.barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
    yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Total Enrollled and Total Completed Courses'
        }
    }],
    xAxes: [{
      scaleLabel: {
          display: true,
          labelString: 'Batch Name'
      }
    }]
    },
    title: {
    text: 'Course wise Completion',
    display: true
    }
    };
    this.barChartLabels = courseBatcheIds;
    this.barChartType = 'bar';
    this.barChartLegend = true;

    this.barChartData = [
      {data: totalCourseEnrolled, label: 'Total Enrolled', stack: 'a'},
      {data: totalCourseCompleted, label: 'Total Completed', stack: 'a'}
    ];
  }

  createPieChart(totalIncompleted,totalCompleted)
  {
    this.pieChartOptions = {
      responsive: true,
      title: {
        text: 'Course Completion Summary',
        display: true
      }
    };

    this.pieChartLabels = ['Total Completed', 'Total Incomplete'];
    this.pieChartData = [totalIncompleted, totalCompleted];
    this.pieChartType = 'pie';
    this.pieChartLegend = true;
    this.pieChartPlugins = [];
  }

  getCourseReportsDataCsv()
  {
    this.courseBatchesData.forEach(item => {
    var reportsData: any = [];
    reportsData.CourseName = item.name;
    reportsData.CourseID = item.identifier;
    reportsData.BatchName = item.batchName;
    reportsData.BatchId = item.batchId;
    reportsData.LessonCount = '0';
    reportsData.UsersEnrolled = item.totalEnrolled;
    reportsData.UsersCompleted = item.totalCompleted;

    this.arrrayCourseReports.push(reportsData);      
    });

    this.coursesSummaryCourses.downloadFile(this.arrrayCourseReports, 'course-report');
  }
}
