const html = require('choo/html')
const modal = require('../modal')
const Search = require('./search')
const { __ } = require('../../locale')
const { getPerformance, distance } = require('../utils')

const SELECTED_COOPERATIVE = /cooperative:(\w+)/
const TYPES = {
  electricity: 'Electricity',
  heat: 'Heating & Hot water'
}

const search = new Search()

module.exports = function form (cooperative, state, emit) {
  const consumptions = state.consumptions || {}
  const cooperatives = state.cooperatives || []
  const { granularity, type, compare, normalized } = consumptions
  const performance = getPerformance(cooperative)
  const disabled = consumptions.isLoading
  const onchange = event => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    emit(target.name, value)
    event.preventDefault()
  }

  const typeOptions = Object.keys(TYPES).map(key => {
    const addSuffix = key === 'electricity' && performance && performance.incHouseholdElectricity

    return {
      value: key,
      disabled: !cooperative.meters.find(meter => meter.type === key),
      isSelected: type === key,
      label: addSuffix ? __('Total elec (incl. households)') : __(TYPES[key])
    }
  })
  const selectedType = typeOptions.find(item => item.isSelected)

  let compareLabel = __('Pick one')
  if (compare) {
    if (compare === 'prev_year') {
      compareLabel = __('Previous year')
    } else {
      const match = compare.match(/cooperative:(.+)/)
      const cooperative = cooperatives.find(item => item._id === match[1])
      compareLabel = cooperative.name
    }
  } else if (granularity === 'year') {
    compareLabel = __('Pick a cooperative')
  }

  const closeby = cooperatives
    .filter(item => {
      if (item._id === cooperative._id) return false
      return item.meters.find(meter => meter.type === type)
    })
    .sort((a, b) => {
      const from = [cooperative.lng, cooperative.lat]
      const distanceA = distance(from, [a.lng, a.lat])
      const distanceB = distance(from, [b.lng, b.lat])
      return distanceA > distanceB ? 1 : -1
    })
    .slice(0, 12)

  const match = compare && compare.match(SELECTED_COOPERATIVE)
  const selected = match && cooperatives.find(item => item._id === match[1])

  /**
   * Using a lot of flex and margin utilities here to:
   * - Switch between row/col flex layout depending on viewport width
   * - Stretch/align elements based on viewport width
   * - Align flexed items to right edge in large viewports
   * - Have container apply margin left and each individual element margin right
   * - Have each individual element apply margin bottom
   * - Toggles have individual flex grow depending on context
   */

  return html`
    <form class="Form u-flex u-flexCol u-flexJustifyEnd u-md-flexRow u-lg-flexRow u-md-flexAlignItemsBaseline u-lg-flexAlignItemsBaseline u-paddingLb">

      <!-- Medium & large viewports: move granularity toggle to end of form -->
      <div class="u-md-flexOrderLast u-lg-flexOrderLast u-marginRb">
        <div class="Form-switchGroup u-marginBs u-sizeFull">
          <label class="Form-switch u-flexGrow1">
            <input class="u-hiddenVisually" type="radio" name="consumptions:granularity" value="month" onchange=${onchange} checked=${granularity === 'month'} disabled=${disabled}/>
            <span class="Form-label">${__('Monthly')}</span>
          </label>
          <label class="Form-switch u-flexGrow1">
            <input class="u-hiddenVisually" type="radio" name="consumptions:granularity" value="year" onchange=${onchange} checked=${granularity === 'year'} disabled=${disabled} />
            <span class="Form-label">${__('Yearly')}</span>
          </label>
        </div>

        <label class="u-marginBs u-sizeFull">
          <span class="Form-pill Form-pill--single ${type !== 'heat' || disabled ? 'is-disabled' : ''}">
            ${__('Normalize')}
            <input type="checkbox" name="consumptions:normalized" onchange=${onchange} checked=${normalized} disabled=${type !== 'heat' || disabled} class="Form-toggle">
            <span class="Form-proxy Form-proxy--checkbox Form-proxy--small"></span>
          </span>
          <a href="/how-it-works#korrigering-foer-utomhustemperatur" class="Link u-colorCurrent u-floatRight u-marginTb u-marginBm u-textS">
            ${__('What\'s this?')}
          </a>
        </label>
      </div>

      <!-- Medium & large viewports: break grid and flex elements horizontally -->
      <div class="u-marginRb">
        <label class="u-flex u-posRelative u-marginBs">
          <select class="u-overlay" name="consumptions:type" onchange=${onchange} disabled=${disabled}>
            ${typeOptions.map(({ value, label, isSelected, disabled }) => html`
              <option disabled=${disabled} value="${value}" selected=${isSelected}>
                ${label}
              </option>
            `)}
          </select>
          <span class="Form-pill Form-pill--leading u-clickthrough ${disabled ? 'is-disabled' : ''}">${__('Show')}</span>
          <span class="Form-pill Form-pill--trailing Form-pill--select u-flexGrow1 u-textNowrap u-clickthrough ${disabled ? 'is-disabled' : ''}">
            ${selectedType ? selectedType.label : __('No data')}
          </span>
        </label>

        <label class="u-flex u-posRelative">
          <select class="u-overlay" name="consumptions:compare" disabled=${disabled} onchange=${oncompare}>
            ${granularity === 'month' ? html`
              <option value="prev_year" selected=${compare === 'prev_year'} disabled=${granularity === 'year'}>
                ${__('Previous year')}
              </option>
            ` : null}
            ${selected && !closeby.includes(selected) ? html`
              <option selected disabled>${selected.name}</option>
            ` : null}
            <option value="search">${__('Find cooperative')}</option>
            <optgroup label="${__('Other cooperatives close by')}">
              ${closeby.map(cooperative => {
                const value = `cooperative:${cooperative._id}`
                return html`
                  <option value="${value}" selected=${compare === value}>
                    ${cooperative.name}
                  </option>
                `
              })}
            </optgroup>
          </select>
          <span class="Form-pill Form-pill--leading u-textNowrap u-clickthrough ${disabled ? 'is-disabled' : ''}">${__('Compare with')}</span>
          <span class="Form-pill Form-pill--trailing Form-pill--select u-flexGrow1 u-textNowrap u-clickthrough ${disabled ? 'is-disabled' : ''}">${compareLabel}</span>
        </label>
      </div>
    </form>
  `

  function oncompare (event) {
    if (event.target.value !== 'search') return onchange(event)
    event.target.value = compare
    modal.render(search.render(cooperative, state, onselect))
    event.preventDefault()
  }

  function onselect (event) {
    onchange(event)
    modal.close()
    event.preventDefault()
  }
}
