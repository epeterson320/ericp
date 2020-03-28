const nodemon = require("nodemon");
const path = require("path");
const displayDevServer = require("./displayDevServer");

nodemon({
  script: path.resolve(__dirname, "runWsHost.js"),
  ext: "js json",
  watch: [path.resolve(__dirname, "runWsHost.js")]
});

displayDevServer.listen(3001, function() {
  console.log("Example app listening on port 3001");
});
