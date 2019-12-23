import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

interface InitialState {
  stages: Array<{}>;
}

interface Stage {
  stageId: number;
  stage?: any;
}

@Injectable({
  providedIn: 'root'
})

export class ProgramStageService {
  private stagesInService: InitialState = {
    stages: []
  };
  private stageCount = 1;
  public stageObservable = new Subject<InitialState>();

  constructor() { }

  initialize() {
    let { stages } = this.stagesInService;
    this.stageCount = 1;
    stages = [];
    this.stagesInService = {
      stages: stages
    };
    this.stageObservable.next(this.stagesInService);
  }
  addStage(stage) {
    const stg = {
      stageId: this.stageCount++,
      stage: stage
    };
    this.stagesInService = {
      stages: [...this.stagesInService.stages, stg]
    };
    // this.stageObservable.next({stageId: this.stageCount++, stage: stage  });
    this.stageObservable.next(this.stagesInService);
  }

  removeStage(item) {
    const { stages } = this.stagesInService;
    const updatedStages = stages.filter((stage: Stage) => stage.stage !== item);
    this.stagesInService = {
      stages: updatedStages
    };
    // this.stagesInService.stages.filter(stg => stg.stage !== stage);
    this.stageObservable.next(this.stagesInService);
  }

  removeLastStage() {
    const { stages } = this.stagesInService;
    stages.splice(-1);
    // const updatedStages = stages.pop();
    this.stagesInService = {
      stages: stages
    };
    // this.stagesInService.stages.filter(stg => stg.stage !== stage);
    this.stageObservable.next(this.stagesInService);
    this.stageCount--;
  }

  getStage(): Observable<any> {
    return this.stageObservable.asObservable();
  }
}
