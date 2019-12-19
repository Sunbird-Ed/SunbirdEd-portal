export interface ISessionContext { // TODO: remove any 'textbook' reference
  textBookUnitIdentifier?: any;
  collectionUnitIdentifier?: any;
  lastOpenedUnit?: any;
  framework?: string;
  channel?: string;
  board?: string;
  medium?: string;
  gradeLevel?: string;
  subject?: string;
  textbook?: string;
  collection?: string;
  topic?: string;
  questionType?: string;
  programId?: string;
  program?: string;
  currentRole?: string;
  currentRoleId?: null | number;
  bloomsLevel?: Array<any>;
  topicList?: Array<any>;
  onBoardSchool?: string;
  selectedSchoolForReview?: string;
  resourceIdentifier?: string;
  hierarchyObj?: any;
  textbookName?: any;
  collectionName?: any;
  collectionType?: any;
  collectionStatus?: any;
}

export interface ICollectionComponentInput {
  programDetails?: any;
  userProfile?: any;
  entireConfig?: any;
  config?: any;
}
