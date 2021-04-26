const DEFAULT_USER = 'guest'

const userCreateWithDefaultName = {
  framework: {
  board: 'English',
  medium: ['English'],
  gradeLevel: ['Class 5']
}};

const userCreateWithName1 = {
  name: "anoop",
  data: {
  formatedName: "Anoop",
  framework: {
  board: 'English',
  medium: ['English'],
  gradeLevel: ['Class 5']
}}};

const userCreateWithName2 = {
  name: "anoop hm",
  data: {
  formatedName: " Anoop HM ",
  framework: {
  board: 'English',
  medium: ['English'],
  gradeLevel: ['Class 5']
}}};

const createError = {
  code: "UPDATE_CONFLICT",
  status: 409,
  message: `User already exist with name`
}

const readError = {
  code: "USER_NOT_FOUND",
  status: 404,
  message: `User not found with name`
}
const updateError = {
  code: "DOC_NOT_FOUND",
  status: 404,
  message: `Document not found with id`
}
const updateMandatoryError = {
  code: "BAD_REQUEST",
  status: 400,
  message: `_id is mandatory to update user`
}
const mandatoryFrameworkError = {
  code: "BAD_REQUEST",
  status: 400,
  message: `Framework is mandatory to create user`
}

export {
  userCreateWithDefaultName,
  userCreateWithName1,
  userCreateWithName2,
  createError,
  readError,
  DEFAULT_USER,
  mandatoryFrameworkError,
  updateError,
  updateMandatoryError
}