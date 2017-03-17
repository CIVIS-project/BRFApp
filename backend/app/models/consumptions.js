const url = require('url');
const moment = require('moment');

const FORMAT = 'YYYYMM';

module.exports = function consumtions(state) {
  return {
    namespace: 'consumptions',
    state: Object.assign({
      items: [],
      type: 'electricity',
      compare: 'prev_year',
      granularity: 'month'
    }, state),
    reducers: {
      type: (state, type) => Object.assign({}, state, { type }),
      add(state, data) {
        const items = state.items.slice();

        if (Array.isArray(data)) {
          data.forEach(addItem);
        } else {
          addItem(data);
        }

        function addItem({ values, id, query }) {
          let item = items.find(item => item.cooperative === id);

          if (!item) {
            item = { cooperative: id, values: {} };
            items.push(item);
          }

          // Cache result by query used to fetch it
          item.values[query] = values;
        }

        return Object.assign({}, state, { items });
      }
    },
    effects: {
      fetch(state, options, send, done) {
        if (Array.isArray(options)) {
          Promise
            .all(options.map(defaults).map(fetchConsumtion))
            .then(results => send('consumptions:add', results, done), done);
        } else {
          fetchConsumtion(defaults(options)).then(result => {
            send('consumptions:add', result, done);
          }, done);
        }

        function defaults(options) {
          return Object.assign({
            type: state.type,
            granularity: state.granularity
          }, options);
        }
      }
    }
  };
};

/**
 * Fetch consumtion for given cooperative with query parameterss granularity,
 * from and to
 * @param  {Object} options Hash with cooperative and query parameters
 * @return {Promise}        Resolves to parsed response
 */

function fetchConsumtion(options) {
  const id = options.cooperative._id;
  const { from, to, type, granularity } = options;
  const query = JSON.stringify({ type, granularity, from, to });

  return fetch(
    url.format({
      pathname: `/cooperatives/${ id }/consumption`,
      query: {
        type: type,
        granularity: granularity,
        from: moment(from).format(FORMAT),
        to: moment(to).format(FORMAT)
      }
    }),
    { headers: { accept: 'application/json' }}
  )
  .then(body => body.json().then(body => {
    const values = body
      // Index values by date
      .map((value, index) => {
        const date = moment(from, FORMAT).add(index, granularity + 's').toDate();
        return { value, date };
      })
      // Remove any empty values (i.e. current month)
      .filter(item => !!item.value);

    return { values, id, query };
  }));
}
