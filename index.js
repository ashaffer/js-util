/**
 * Imports
 */

const base = require('./lib/base')
const set = require('./lib/set')
const Logger = require('./lib/Logger')
const Emitter = require('./lib/Emitter')


/**
 * Exports
 */

module.exports = {
    ...base,
    ...set,
    Logger,
    Emitter
}
