import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'info-card-container',
  templateUrl: './info-card-container.component.html',
  styleUrls: ['./info-card-container.component.scss']
})
export class InfoCardContainerComponent implements OnInit {
  @Input() cardInfo:any = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {}

}
