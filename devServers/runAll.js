const nodemon = require("nodemon");
const path = require("path");
const Bundler = require('parcel-bundler');

nodemon({
  script: path.resolve(__dirname, "runWsHost.js"),
  ext: "js json",
  watch: [path.resolve(__dirname, "runWsHost.js")]
});

const displayEntry =  path.join(__dirname, '../display/index.html');
const displayBundler = new Bundler(displayEntry, { watch: true });
displayBundler.serve(3001);
