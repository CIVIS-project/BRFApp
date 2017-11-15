const Choo = require('choo')
const nanohref = require('nanohref')

module.exports = Core

/**
 * Custom extensions on choo to support anchor links and other shananigans
 * @param {object} opts
 * @returns Core
 */

function Core (opts) {
  if (!(this instanceof Core)) { return new Core(opts) }

  // Fix for https://github.com/choojs/choo/pull/589
  this.hasWindow = typeof window !== 'undefined'

  Choo.call(this, Object.assign({}, opts, { href: false }))

  // Strips out the hash when figuring out thewindow.location
  this._createLocation = function () {
    return window.location.pathname.replace(/\/$/, '')
  }
}

Core.prototype = Object.create(Choo.prototype)

Core.prototype.start = function (...args) {
  nanohref(anchor => {
    const hash = anchor.href.split('#')[1]

    if (anchor.pathname === window.location.pathname) {
      if (hash !== window.location.hash) {
        // If it's an anchor on the same page scroll into view
        const element = document.querySelector(`#${hash}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
      return
    }

    // Emit navigation event
    this.emitter.emit(this._events.PUSHSTATE, anchor.pathname)

    // Add on hash because the URL is UI
    const href = `${anchor.pathname.replace(/\/$/, '')}${hash ? `#${hash}` : ''}`
    window.history.replaceState({}, document.title, href)
  })

  return Choo.prototype.start.call(this, ...args)
}