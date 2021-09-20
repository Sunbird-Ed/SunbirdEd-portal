const mapping = {
    'config_userType_v2_app': {
        type: 'config',
        subType: 'userType_v2_ios'
    }
}

const IOSFormMiddleware = (req, res, next) => {
    const platform = req.get('X-Platform-Id');
    if (platform && typeof(platform) == 'string' && platform.toLowerCase() === 'ios') {
        const { body } = req;
        if (body) {
            const { type, subType, component } = body.request || {};
            const key = `${type}_${subType}_${component}`;
            const hasMapping = key in mapping;
            if (hasMapping) {
                req.body.request = {
                    ...req.body.request,
                    ...mapping[key]
                }
            }
        }
    }
    next();
}

module.exports = { IOSFormMiddleware }