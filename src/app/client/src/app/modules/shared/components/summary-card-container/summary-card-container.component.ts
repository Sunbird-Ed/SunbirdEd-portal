import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-summary-card-container',
  templateUrl: './summary-card-container.component.html',
  styleUrls: ['./summary-card-container.component.scss']
})
export class SummaryCardContainerComponent implements OnInit {

  @Input() cardInfo: any = [];
  constructor(private httpClient: HttpClient) { }
  ngOnInit(): void {
  }

}
