const html = require('choo/html');
const moment = require('moment');
const createContainer = require('./container');
const { loader } = require('../icons');
const { __ } = require('../../locale');

const container = createContainer();

module.exports = function chart(cooperative, state, prev, send) {
  /**
   * Construct query objects that also works as cache keys
   */

  const queries = {};
  queries.current = {
    granularity: 'month',
    from: moment().subtract(1, 'year').startOf('month').toDate(),
    to: moment().endOf('month').toDate()
  };
  queries.compare = {
    granularity: 'month',
    from: moment(queries.current.from).subtract(1, 'year').toDate(),
    to: moment(queries.current.from).subtract(1, 'month').toDate()
  };

  const item = state.consumptions.items.find(item => {
    return item.cooperative === cooperative._id;
  });
  const current = item && item.values[JSON.stringify(queries.current)];
  const compare = item && item.values[JSON.stringify(queries.compare)];

  const query = [];
  if (!current) {
    query.push(Object.assign({ cooperative }, queries.current));
  }

  if (!compare) {
    query.push(Object.assign({ cooperative }, queries.compare));
  }

  if (query.length) {
    return loading(() => send('consumptions:fetch', query));
  }

  const actions = state.actions.items
    // Find cooperative's actions
    .filter(action => action.cooperative === cooperative._id)
    // Filter out only those who are within given time span
    .filter(action => moment(action.date).isBetween(
      queries.current.from,
      queries.current.to
    ))
    // Put together a chart compatible object
    .map((action, index) => {
      const match = current.findIndex(point => {
        return new Date(point.date) > new Date(action.date);
      });

      return {
        name: index + 1,
        date: action.date,
        value: current[match - 1].value
      };
    });

  return html`
    <div class="Chart">
      ${ container(actions, [
        { name: __('Current year'), values: current },
        { name: __('Previous year'), values: compare }
      ]) }
    </div>
  `;
};

function loading(onload = null) {
  return html`
    <div class="Chart" onload=${ onload }>
      ${ loader() }
    </div>
  `;
}
