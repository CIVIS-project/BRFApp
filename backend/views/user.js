const html = require('choo/html');
const header = require('../components/page-head')('user');

module.exports = view;

function view(state, emit) {
  return html`
    <div class="App">
      ${ header(state, emit) }
    </div>
  `;
}

view.title = state => state.user.name;
