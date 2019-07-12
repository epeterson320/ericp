module.exports = function Message({
  from = "HOST",
  to = "AUDIENCE",
  type,
  body
}) {
  return { from, to, type, body };
};
