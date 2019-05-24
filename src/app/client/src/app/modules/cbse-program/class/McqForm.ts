import * as _ from 'lodash-es';

export class McqOptions {
  constructor(public body: string, length: number) {
  }
}
export class McqForm {

  constructor(public question: string, public options: Array<McqOptions>,
    public templateId: string, public answer: string, public learningOutcome?,
    public bloomsLevel?, public maxScore?) {
    if (!options || !options.length) {
      _.times(4, index => console.log(index));
      this.options = [
        new McqOptions('', 0),
        new McqOptions('', 0),
        new McqOptions('', 0),
        new McqOptions('', 0)
      ];
    }
  }

}

