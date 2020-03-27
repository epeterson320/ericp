const nodemon = require('nodemon');
const path = require('path');

nodemon({
  script: path.resolve(__dirname, 'wsHost.js'),
  ext: 'js json',
  watch: [path.resolve(__dirname, 'wsHost.js')]
});
