exports.getFullUrlFromRequest = req => req.protocol + '://' + req.get('host')
exports.getUrlWithoutPortFromRequest = req => req.protocol + '://' + req.hostname
