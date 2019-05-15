export class McqOptions {
  constructor(public body: string) {
  }
}
export class McqForm {

  constructor(public question: string, public options: Array<McqOptions>,
    public templateId: string, public answer: string, public learningOutcome?,
    public difficultyLevel?, public bloomsLevel?, public maxScore?) {
    if (!options || !options.length) {
      this.options = [
        new McqOptions(''),
        new McqOptions(''),
        new McqOptions(''),
        new McqOptions('')
      ];
    }
  }

}

