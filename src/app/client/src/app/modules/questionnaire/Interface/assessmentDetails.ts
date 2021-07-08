export interface IAssessmentDetails {
  message?: string;
  status?: number;
  result: AssessmentInfo;
  responseCode: string;
}

export interface AssessmentInfo {
  entityProfile: EntityProfile;
  solution: Solution;
  program: Program;
  assessment: Assessment;
}

export interface EntityProfile {
  _id: string;
  entityTypeId: string;
  entityType: string;
}

export interface Solution {
  _id: string;
  externalId: string;
  name: string;
  description: string;
  registry: any[];
  captureGpsLocationAtQuestionLevel: boolean;
  enableQuestionReadOut: boolean;
  scoringSystem: null;
  isRubricDriven: boolean;
  pageHeading: string;
  criteriaLevelReport?:boolean
}

export interface Program {
  _id: string;
  isAPrivateProgram: boolean;
  externalId: string;
  name: string;
  description: string;
  imageCompression: ImageCompression;
}

export interface Assessment {
  name: string;
  description: string;
  externalId: string;
  pageHeading: string;
  submissionId: string;
  evidences: Evidence[];
  submissions: Submissions;
}

export type Code = string;

export interface Evidence {
  code: Code;
  sections: Section[];
  externalId: Code;
  tip: null;
  name: string;
  description: null;
  modeOfCollection: string;
  canBeNotApplicable: boolean;
  notApplicable: boolean;
  canBeNotAllowed: boolean;
  remarks: null;
  startTime: number;
  endTime: string;
  isSubmitted: boolean;
  submissions: any[];
}

export interface Section {
  code: string;
  questions: Question[];
  name: string;
}

export interface Question {
  _id: string;
  question: string;
  isCompleted: boolean;
  showRemarks: string;
  options: string;
  sliderOptions: string;
  children: string[];
  questionGroup: string;
  fileName: string;
  instanceQuestions: string;
  isAGeneralQuestion: string;
  autoCapture: string;
  allowAudioRecording: string;
  prefillFromEntityProfile: string;
  entityFieldName: string;
  isEditable: string;
  showQuestionInPreview: string;
  deleted: string;
  remarks: string;
  value: string | string[];
  usedForScoring: string;
  questionType: string;
  canBeNotApplicable: string;
  visibleIf: VisibleIfUnion;
  validation: string | Validation;
  dateFormat: string;
  externalId: string;
  tip: string;
  hint: string;
  responseType: ResponseType;
  modeOfCollection: string;
  accessibility: string;
  rubricLevel: string;
  sectionHeader: string;
  page: string;
  questionNumber: string;
  updatedAt: string;
  createdAt: string;
  __v: string;
  createdFromQuestionId: string;
  evidenceMethod: string;
  payload: Payload;
  startTime: number;
  endTime: number;
  gpsLocation: string;
  file: string;
  pageQuestions: Question[];
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface PageQuestion
  extends Omit<Question, "responseType" | "pageQuestions"> {
  value: "pageQuestions";
  pageQuestions: Question[];
}
export interface MatrixQuestion
  extends Omit<Question, "responseType" | "instanceQuestions" | "value"> {
  responseType: "matix";
  value: Array<Question[]>;
  instanceQuestions: Question[];
  instanceIdentifier: string;
}

export enum ResponseType {
  TEXT = "text",
  NUMBER = "number",
  RADIO = "radio",
  MULTISELECT = "multiselect",
  DATE = "date",
  SLIDER = "slider",
  PAGEQUESTIONS = "pageQuestions",
  MATRIX = "matrix",
}

export type FileUnion = FileClass | string;

export interface FileClass {
  required: boolean;
  type: string[];
  minCount: number;
  maxCount: number;
  caption: string;
}

export interface Payload {
  criteriaId: string;
  responseType: string;
  evidenceMethod: Code;
  rubricLevel: string;
}

export interface Validation {
  required: boolean;
  max?: string;
  min?: string;
  IsNumber?: string;
  regex:RegExp
}

export interface Option {
  value: string;
  label: string;
}

export type VisibleIfUnion = VisibleIfElement[] | string;

export interface VisibleIfElement {
  operator: string;
  value: string[];
  _id: string;
}

export interface Submissions {}

export interface ImageCompression {
  quality: number;
}
