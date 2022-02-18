import { TestBed, inject } from '@angular/core/testing';
import { RendererService } from './renderer.service';
import { LineChartService } from './../chartjs';
import { configureTestSuite } from '@sunbird/test-util';
describe('RendererService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RendererService, LineChartService]
    });
  });

  it('should be created', inject([RendererService], (service: RendererService) => {
    expect(service).toBeTruthy();
  }));
});
