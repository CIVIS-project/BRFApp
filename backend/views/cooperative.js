const html = require('choo/html');
const header = require('../components/page-head');
const performance = require('../components/performance');

module.exports = function (state, prev, send) {
  return html`
    <div class="App">
      ${ header(state, prev, send) }
      <div class="App-container">
        <h1 class="App-title">${ state.name }</h1>
        ${ performance({ performance: state.performance }) }
      </div>
    </div>
  `;
};
