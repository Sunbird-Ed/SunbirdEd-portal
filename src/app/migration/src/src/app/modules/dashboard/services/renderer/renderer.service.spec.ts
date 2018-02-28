import { LineChartService } from './graphs/line-chart.service';
import { TestBed, inject } from '@angular/core/testing';
import { RendererService } from './renderer.service';

describe('RendererService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RendererService, LineChartService]
    });
  });

  it('should be created', inject([RendererService], (service: RendererService) => {
    expect(service).toBeTruthy();
  }));
});
