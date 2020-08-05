export const mockUpdateContactData = {
  tenantData: {
    logo: 'logo',
    titleName: 'title Name'
  },
  snapshotData: {
    data: {
      telemetry: {
        env: 'sso-sign-in', pageid: '/update-contact', uri: '/update-contact',
        type: 'view', mode: 'self', uuid: 'hadfisgefkjsdvv'
      }
    }
  },
  userData: {
    result: {
      response: {
        rootOrgId: 'rootOrgId',
        id: 'userId'
      }
    }
  },
  custOrgDetails: {
    result: {
      response: {
        value: 'rootOrgId'
      }
    }
  },
  nonCustOrgDetails: {
    result: {
      response: {
        value: 'root_Org_Id_2'
      }
    }
  },
  blockedUserError: {
    error: {
      params: {
        status: 'USER_ACCOUNT_BLOCKED'
      }
    }
  },
  phoneAlreadyUsedError: {
    error: {
      params: {
        status: 'PHONE_ALREADY_IN_USE',
        errmsg: 'PHONE_ALREADY_IN_USE'
      }
    }
  },
  emailAlreadyUsedError: {
    error: {
      params: {
        status: 'EMAIL_IN_USE',
        errmsg: 'EMAIL_IN_USE'
      }
    }
  },
  rateLimitExceed: {
    error: {
      params: {
        status: 'ERROR_RATE_LIMIT_EXCEEDED',
        errmsg: 'ERROR_RATE_LIMIT_EXCEEDED'
      }
    }
  },
  serverError: {
    error: {
      params: {
        status: 'USER_NOT_FOUND'
      }
    }
  },
  successResponse: {
    responseCode: 'OK'
  },
  resourceBundle: {
    frmelmnts: {
      instn: {
        t0083: 't0083',
        t0084: 't0084',
      },
      lbl: {
        unableToUpdateMobile: 'unableToUpdateMobile',
        unableToUpdateEmail: 'unableToUpdateEmail',
        wrongPhoneOTP: 'wrongPhoneOTP',
        wrongEmailOTP: 'wrongEmailOTP',
      },
    },
    messages: {
      fmsg: {
        m0085: 'm0085',
        m0004: 'm0004'
      }
    },
  },
  otpData: {
    type: 'email',
    value: 'test@gmail.com',
    instructions: 't0084',
    retryMessage: 'unableToUpdateEmail',
    wrongOtpMessage: 'wrongEmailOTP'
  },
  phoneOtpData: {
    type: 'phone',
    value: '7896541257',
    instructions: 't0083',
    retryMessage: 'unableToUpdateMobile',
    wrongOtpMessage: 'wrongPhoneOTP'
  },
  tncConfig: {
    'id': 'api',
    'params': {
      'status': 'success',
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'id': 'tncConfig',
        'field': 'tncConfig',
        'value': '{"latestVersion":"v4","v4":{"url":"http://test.com/tnc.html"}}'
      }
    }
  },
  tncConfigIncorrectData: {
    'id': 'api',
    'params': {
      'status': 'success',
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'id': 'tncConfig',
        'field': 'tncConfig',
        'value': '{"latestVersion":"v4","v4":{"url":}}'
      }
    }
  },
  interactEDataUnSelected: {
    context: {
      env: 'sso-signup',
      cdata: [
        {id: 'user:tnc:accept', type: 'Feature'},
        {id: 'SB-16663', type: 'Task'}
      ]
    },
    edata: {
      id: 'user:tnc:accept',
      type: 'click',
      subtype: 'unselected',
      pageid: 'sso-signup'
    }
  },
  interactEDataSelected: {
    context: {
      env: 'sso-signup',
      cdata: [
        {id: 'user:tnc:accept', type: 'Feature'},
        {id: 'SB-16663', type: 'Task'}
      ]
    },
    edata: {
      id: 'user:tnc:accept',
      type: 'click',
      subtype: 'selected',
      pageid: 'sso-signup'
    }
  },
  telemetryLogError: {
    context: {
      env: 'sso-signup'
    },
    edata: {
      type: 'fetch-terms-condition',
      level: 'ERROR',
      message: 'fetch-terms-condition failed'
    }
  },
  telemetryLogSuccess: {
    context: {
      env: 'sso-signup'
    },
    edata: {
      type: 'fetch-terms-condition',
      level: 'SUCCESS',
      message: 'fetch-terms-condition success'
    }
  },
  captchaToken: '3AGdBq25UpSe5i7AFyfS78B19CoQAdUNbZZDadCc6TuaMhGffNYC42'
};

