const User = require('../models/users');

/**
 * Overwrite native `res.render` with one that conforms with request type and
 * decorates (HTML) state with user data
 */

module.exports = function render(req, res, next) {
  const orig = res.render;

  res.render = function (route, state, formatter) {
    if (typeof route === 'object' && !state) {
      state = route;
    }

    /**
     * Determine format of return value -> HTML/JSON
     */

    if (typeof route === 'string' && req.accepts('html')) {

      /**
       * Pipe state through (optional) formatter for decorating HTML state
       */

      if (typeof formatter === 'function') {
        formatter((err, formatted) => {
          if (err) {
            res.status(500).render('/error', { err: err.message });
          } else {
            send(formatted);
          }
        });
      } else {
        send(state || {});
      }
    } else {
      res.json(state);
    }

    /**
     * Decorate state with user data before passing it to the render method
     * @param  {Object} state State object to be decorated
     */

    function send(_state) {
      const output = Object.assign({}, _state);

      // Ensure state consistency
      output.geoip = {};
      output.consumptions = {};
      output.actions = _state.actions || [];
      output.cooperatives = _state.cooperatives || [];
      output.user = Object.assign({
        hasBoarded: JSON.parse(req.cookies.hasBoarded || false),
        isAuthenticated: false
      }, _state.user);
      output.auth = req.get('Authorization');

      if (req.user) {
        User.getProfile(req.user._id, (err, user) => {
          if (err) {
            res.status(500).render('/error', { err: err.message });
          } else {
            const cooperatives = _state.cooperatives;
            const id = user.cooperative._id.toString();

            if (!cooperatives.find(item => item._id.toString() === id)) {
              cooperatives.push(user.cooperative.toJSON());
            }

            Object.assign(output.user, { isAuthenticated: true }, user.toJSON());

            orig.call(res, route, output);
          }
        });
      } else {
        orig.call(res, route, output);
      }
    }
  };

  next();
};
