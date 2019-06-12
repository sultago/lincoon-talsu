const mongooose = require('mongoose');

const LincoonDocument = mongooose.model('LincoonDocument', {
  key: String,
  title: String,
  text: String,
});

module.exports = {
  LincoonDocument,
};
