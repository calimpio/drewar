'use strict';
const data = require('../tables/devices')
const migrations = require('../migrations');
module.exports = migrations.createAndDrop(data);