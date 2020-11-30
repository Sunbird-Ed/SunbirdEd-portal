export interface IUser {
  _id?: string;
  name?: string;
  formatedName?: string;
  framework: IFramework;
  createdOn?: number;
  updatedOn?: number;
}

export interface IFramework {
    board: string,
    medium: Array<string>,
    gradeLevel: Array<string>,
    subject?: Array<string>
}