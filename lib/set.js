/**
 * Imports
 */

const {set_from} = require('./base')

/**
 * Set operations that are inexplicably not
 * included in the native object
 */

function difference (a, b) {
    const result = new Set()

    for (const item of a) {
        if (!b.has(item)) {
            result.add(item)
        }
    }

    return result
}

function intersection (a, b) {
    const result = new Set(a)

    for (let item in b) {
        if (!a.has(item)) {
            result.delete(item)
        }
    }

    return result
}

const union = set_from

/**
 * Exports
 */

module.exports = {
    union,
    intersection,
    difference
}
