const Mustache = require('mustache');
module.exports = (template, payload) => Mustache.render(template, payload)