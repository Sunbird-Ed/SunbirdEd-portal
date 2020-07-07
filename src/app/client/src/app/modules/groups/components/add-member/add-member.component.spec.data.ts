export const addMemberTestData = {
    recaptchaResponse: {
        result: {
            success: true
        }
    },
    recaptchaErrorResponse: {
        error: {success: false}
    },
    telemetryLogSuccess: {
        context: {
            env: 'add-member'
        },
        edata: {
            type: 'validate-recaptcha',
            level: 'SUCCESS',
            message: 'validate-recaptcha success'
        }
    },
    telemetryLogError: {
        env: 'add-member',
        errorMessage: '',
        errorType: 'SYSTEM',
        stackTrace: '{"success":false}',
        pageid: 'add-member'
    }
}