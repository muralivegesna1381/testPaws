export interface RecordGrpuActRequst {
  performedBy: number;
  performedDate: string;
  actId: number;
  userInfoId: number;
  acts: Act[];
}

export interface Act {
  actResultr: any;
  [x: string]: any;
  actResult: any;
  animalId: number;
  actScheduleId: number;
  scheduleDate: string;
  actCategoryId: string;
  results: Result[];
  ///This flag is for checking eligibity for saving.
  isReadyForSave: boolean;
}

export interface Result {
  numericResults: NumericResult[];
  scaleResults: ScaleResult[];
  binaryResults: BinaryResult[];
  comments: string;
}

export interface NumericResult {
  numericResultId: number;
  resultValue: string;
  resultName: string;
  unitId: number;
  unitName: string;
  units: Unit[];
  noOfDecimals: number;
  limits: Limit[];
  dvc: string;
  resultId: number;
  alphaNumeric: boolean;
  previousValue: string;
  truncate: boolean;
  mandatory: boolean;
  idealBodyWeight: string;
}

export interface Unit {
  unitId: number;
  unitName: string;
  default: boolean;
}

export interface Limit {
  resultId: number;
  speciesId: number;
  breedId: number;
  minAge: number;
  maxAge: number;
  validMinRange: number;
  validMaxRange: number;
}

export interface ScaleResult {
  resultValue: number;
  resultName: string;
  scaleResultId: number;
  dvc: string;
  scaleList: ScaleList[];
  previousValue: string;
  selectedValue: any;
  resultId: number;
  mandatory: boolean;
  isAdded: boolean;
}

export interface ScaleList {
  scaleId: number;
  scaleValue: string;
  isDefault: number;
}

export interface BinaryResult {
  resultId: number;
  resultName: string;
  resultValue: number;
  resultTypeId: number;
  binaryResultId: number;
  dvc: string;
  firstOptionValue: string;
  secondOptionValue: string;
  firstOptionId: number;
  secondOptionId: number;
  previousValue: string;
  mandatory: boolean;
}
