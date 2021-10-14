'use strict';
const data = require('../tables/user');
const migrations = require('../migrations');
module.exports = migrations.createAndDrop(data);