export class McqOptions {
  constructor(public body: string) {
  }
}
export class McqForm {

  constructor(public question: string, public options: Array<McqOptions>,
    public templateId: string, public answer: string, learningOutcome?, difficultyLevel?, bloomsLevel?, max_score?) {
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

