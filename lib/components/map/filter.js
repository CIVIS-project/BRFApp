const html = require('choo/html')
const raw = require('choo/html/raw')
const Component = require('choo/component')
const { __ } = require('../../locale')
const { input, checkbox, radiogroup } = require('../form')

module.exports = class Filter extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
    this.state = state
    this.emit = emit
    this.props = {}
    this.search = ''
    this.panel = 'filter'
    this.criteria = 'includes'
  }

  static apply (cooperatives, filter = {}) {
    const filters = Object.keys(filter)
    if (!filters.length) return cooperatives

    return cooperatives.filter((cooperative) => {
      for (let i = 0, len = filters.length, key, value; i < len; i++) {
        key = filters[i]
        value = filter[key]

        if (typeof value === 'string') {
          value = value.toLowerCase()
          // Match text content
          if (cooperative[key].toLowerCase().indexOf(value) === -1) {
            return false
          }
        } else {
          if (key === 'hasEnergyProduction') {
            // Proxy all types of energy production
            if (
              !!cooperative.hasEnergyProduction !== value &&
              !!cooperative.hasGeothermalHeating !== value &&
              !!cooperative.hasSolarPanels !== value
            ) return false
          }
          // Compare boolean values
          if (!!cooperative[key] !== value) return false
        }
      }

      return true
    })
  }

  update () {
    return false
  }

  createElement (cooperatives, onfilter) {
    const self = this
    const props = this.props

    const results = []
    if (this.panel === 'search' && this.search) {
      const pattern = new RegExp(this.search.replace(/\\/, '//'), 'i')
      results.push(...cooperatives.filter(item => pattern.test(item.name)))
    } else if (this.panel === 'filter') {
      results.push(...Filter.apply(cooperatives, this.props))
    }

    return html`
      <form class="Form u-flex u-flexCol" onsubmit=${onsubmit}>
        <div>
          <button role="tab" aria-controls="${this.id}-filter" aria-expanded="${this.panel === 'filter'}" onclick=${show('filter')} class="${this.panel === 'filter' ? 'Display Display--6' : 'Link'} u-inlineBlock u-marginAs">${__('Filter')}</button>
          <button role="tab" aria-controls="${this.id}-search" aria-expanded="${this.panel === 'search'}" onclick=${show('search')} class="${this.panel === 'search' ? 'Display Display--6' : 'Link'} u-inlineBlock u-marginAs">${__('Search')}</button>
        </div>
        <div role="tabpanel" id="${this.id}-search">
          ${this.panel === 'search' ? html`
            <fieldset>
              <legend class="Form-label u-colorDark u-marginAs">${__('Find a cooperative by searhing for it by its name.')}</legend>
              ${input({ label: __('Type here'), id: 'coop-search-input', type: 'search', name: 'name', oninput: filter, value: this.search, autocomplete: 'off', autofocus: true, autocorrect: 'off' })}
              ${this.search ? html`
                <ul class="List">
                  ${results.length ? results.slice(0, 6).map(item => html`
                    <li class="List-item">
                      <button class="Button Button--link u-block u-sizeFull u-paddingAb" name="_id" value="${item._id}" data-prevent-rerender="true" onclick=${setProp}>
                        ${item.name}
                      </button>
                    </li>
                  `) : html`
                    <li class="ListItem u-paddingHb u-paddingVm u-textCenter">
                      <em class="u-colorDark">${__('Sorry, we couldn\'t find any cooperative by that name')}</em>
                    </li>
                  `}
                </ul>
              ` : null}
              ${props._id ? html`
                <button type="reset" onclick=${reset} class="Button Button--secondary u-block u-sizeFull">
                  ${__('Reset')}
                </button>
              ` : null}
            </fieldset>
          ` : null}
        </div>
        <div role="tabpanel" id="${this.id}-filter" class="u-flexGrow1 u-flex u-flexCol">
          ${this.panel === 'filter' ? [html`
            <div class="u-flexGrow1 u-nbfc">
              <fieldset>
                <legend class="Form-label u-colorDark u-marginAs">${__('Select which cooperatives are shown on the map based on what they have or do not have.')}</legend>
                ${radiogroup([{
                  label: __('Show cooperatives that have'),
                  value: 'includes',
                  checked: this.criteria === 'includes',
                  name: 'criteria',
                  onchange: setProp
                }, {
                  label: raw(__('Show cooperatives that _do not_ have').replace(/_(.+?)_/, '<em>$1</em>')),
                  value: 'excludes',
                  checked: this.criteria === 'excludes',
                  name: 'criteria',
                  onchange: setProp
                }])}
              </fieldset>
              <fieldset class="u-marginTs">
                <legend class="Form-label u-colorDark u-marginAs">${__('Pick one or more energy initiatives below.')}</legend>
                ${[
                  checkbox({ label: __('Assigned energy representative'), onchange: setProp, name: 'hasRepresentative', checked: props.hasRepresentative }),
                  checkbox({ label: __('Energy consumption mapping'), onchange: setProp, name: 'hasConsumptionMapping', checked: props.hasConsumptionMapping }),
                  checkbox({ label: __('Goal oriented energy management'), onchange: setProp, name: 'hasGoalManagement', checked: props.hasGoalManagement }),
                  checkbox({ label: __('Participating in belysningsutmaningen'), onchange: setProp, name: 'hasBelysningsutmaningen', checked: props.hasBelysningsutmaningen }),
                  checkbox({ label: __('Charger for electric cars'), onchange: setProp, name: 'hasCharger', checked: props.hasCharger }),
                  checkbox({ label: __('Renewable energy production'), onchange: setProp, name: 'hasEnergyProduction', checked: props.hasEnergyProduction })
                ]}
              </fieldset>
            </div>`, html`
            <div class="u-flex">
              <button type="reset" onclick=${reset} class="Button Button--secondary u-flexGrow1">
                ${__('Reset')}
              </button>
              <button type="submit" class="Button u-flexGrow1">
                ${__('Filter')} ${Object.keys(props).length ? ` (${results.length})` : ''}
              </button>
            </div>
          `] : null}
        </div>
      </form>
    `

    function show (id) {
      return function (event) {
        if (self.panel !== id) {
          self.panel = id
          self.search = ''
          self.props = {}
          self.rerender()
          self.element.querySelector('input,select,textarea').focus()
        }
        event.preventDefault()
      }
    }

    function filter (event) {
      self.search = event.target.value
      self.rerender()
    }

    function reset (event) {
      self.search = ''
      self.props = {}
      onfilter({})
      event.preventDefault()
    }

    function onsubmit (event) {
      onfilter(self.props)
      self.emit('track', {
        event_name: self.props._id ? 'search' : 'filter',
        event_category: 'map',
        event_label: self.props._id || `${self.criteria}:${Object.keys(props).join(',')}`
      })
      event.preventDefault()
    }

    function setProp (event) {
      if (event.target.name === 'criteria') {
        self.criteria = event.target.value
        self.props = {}
      } else {
        if (event.target.value) {
          if (event.target.type === 'checkbox') {
            if (event.target.checked) {
              props[event.target.name] = self.criteria === 'includes'
            } else {
              delete props[event.target.name]
            }
          } else {
            props[event.target.name] = event.target.value
          }
        } else {
          delete [event.target.name]
        }
      }

      if (!event.target.dataset.preventRerender) self.rerender()
    }
  }
}
