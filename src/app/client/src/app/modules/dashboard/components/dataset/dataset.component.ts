import { Component, OnInit, Input } from '@angular/core';
import { IDataset } from '../../interfaces'
import { DatasetService } from '../../services';
@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {

  @Input() dataset: IDataset;

  constructor(private datasetService: DatasetService) { }

  options: any = { maxLines: 1000, printMargin: false };

  onChange(updatedData) {
    this.markdown = updatedData;
  }

  markdown: string;

  ngOnInit() {
    this.datasetService.getDataSet({ datasetId: "raw", from: "2020-07-01", to: "2020-07-10" })
      .subscribe(res => {
        console.log({ res });
      }, err => {
        console.log({ err });
      })
  }

}
