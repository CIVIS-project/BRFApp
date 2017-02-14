const User = require('../models/users');

/**
 * Overwrite native `res.render` with one that conforms with request type and
 * decorates HTML state with user data
 */

module.exports = function render(req, res, next) {
  const orig = res.render;

  res.render = function (route, state) {
    const send = (state) => {
      if (route && req.accepts('html')) {
        orig.call(this, route, state);
      } else {
        res.json(state);
      }
    };

    if (req.user) {
      User.getProfile(req.user._id, (err, user) => {
        if (err) {
          res.status(500).render('/error', { err: err.message });
        } else {
          send(Object.assign({ user }, state));
        }
      });
    } else {
      send(state);
    }
  };

  next();
};
