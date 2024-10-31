const persianUsers = require('./data.json');
const foreignUsers = require('./records.json');

module.exports = () => ({
  persianUsers: persianUsers,
  foreignUsers: foreignUsers
});