export class McqOptions {
  constructor(public body: string, public isCorrectAnswer: boolean) {
  }
}
export class McqForm {

  constructor(public question: string, public options: Array<McqOptions>,
    public templateId: string, public answer: string) {
    if (!options || !options.length) {
      this.options = [
        new McqOptions('', false),
        new McqOptions('', false),
        new McqOptions('', false),
        new McqOptions('', false)
      ];
    }
  }

}

