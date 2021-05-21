export const mandatoryFieldError = {
  status: 400,
  code: 'MANDATORY_FIELD_MISSING',
  message: 'Mandatory fields are missing'
}
export const networkError = {
  status: 400,
  code: 'NETWORK_UNAVAILABLE',
  message: 'Network unavailable'
}

export const helpDeskError = {
  status: 400,
  code: 'FRESH_DESK_API_ERROR',
  message: 'test message'
}

export const helpDeskSuccess = {
  status: 200,
  code: 'SUCCESS',
  message: 'Ticket created successfully'
}

export const ticketReq = {
  email:"anoopm@ilimi.in", description: "test ticket"
}