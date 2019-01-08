import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  @Input() chartType;
  @Input() datasets;
  @Input() labels;
  @Input() colors;
  @Input() options;

  ngOnInit() {
  }

}
