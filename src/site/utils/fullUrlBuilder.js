exports.getFullUrlFromRequest = req => req.protocol + '://' + req.get('host')
