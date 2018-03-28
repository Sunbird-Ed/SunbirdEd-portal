export class contentData {
    constructor(     
      public name: string,
      public subject: string,
      public gradeLevel: any,
      public board: string,
      public language: string,
      public resourceType: string,

    ) { 
        this.name = name;
        this.subject = subject;
        this.gradeLevel = gradeLevel;
        this.board = board;
        this.language = language;
        this.resourceType = resourceType;
     }
  
  }