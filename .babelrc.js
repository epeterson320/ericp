/* Babel config, used by jest when loading files */
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: 'current' } }],
    "@babel/preset-typescript",
    "@babel/preset-react"
  ]
}