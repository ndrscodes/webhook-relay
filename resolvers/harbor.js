module.exports = payload => `harbor/${payload?.type?.toLowerCase() ?? "unknown"}.tpl`