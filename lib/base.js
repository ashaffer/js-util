/**
 * Imports
 */

const assert = import('assert')

/**
 * Transformation functions
 */

const identity = val => val

function count (it, fn) {
    let i = 0
    let count = 0

    for (const item of it) {
        if (fn(item, i)) {
            ++count
        }

        ++i
    }

    return count
}


function rand_int (min, max = 0) {
    if (max === 0) {
        max = min
        min = 0
    }

    const val = (Math.random() * max) + min
    return Math.floor(val)
}

const $ = Symbol('placeholder')
const strict_equals = val => val2 => val === val2
const is_placeholder = strict_equals($)

function times (n, fn)  {
    const result = []

    for (let i = 0; i < n; i++) {
        result.push(fn(i))
    }

    return result
}

function partial (fn, ...args) {
    const args_len = args.length

    return function (...inner) {
        const arr = [].concat(args.map(arg => is_placeholder(arg) ? inner.shift() : arg), inner)
        return fn.apply(this, arr)
    }
}

function bind (fn, self) {
    return fn.bind(self)
}

function compose (...fns) {
    switch (fns.length) {
    case 0:
        return identity
    case 1:
        return fns[0]
    case 2: {
        const [a, b] = fns
        return function () {
            return a.call(this, b.apply(this, arguments))
        }
    }
    case 3: {
        const [a, b, c] = fns
        return function () {
            return a.call(this, b.call(this, c.apply(this, arguments)))
        }
    }
    case 4: {
        const [a, b, c, d] = fns
        return function () {
            return a.call(this, b.call(this, c.apply(this, arguments)))
        }
    }
    default:
        return compose(compose(...fns.slice(0, 4)), ...fns.slice(4))
    }
}

function create_iterator (next, is_done) {
    return function *iterator (val) {
        while (!is_done(val)) {
            val = next(val)
        }
    }
}

function *concat (...its) {
    for (const it of its) {
        for (const item of it) {
            yield item
        }
    }
}

function *map (it, fn) {
    let i = 0
    for (const item of it) {
        yield fn(it, i++)
    }
}

function *flat_map (it, fn) {
    let i = 0

    for (const item of it) {
        const it2 = fn(item)

        if (is_iterable(it)) {
            for (const item2 of it2) {
                yield fn(item2)
            }
        } else {
            yield it2
        }
    }
}

function *find_indexes (it, fn) {
   let i = 0

   for (const item of it) {
       if (fn(item)) {
           yield i
       }

       ++i
   }
}

function some (it, fn) {
    for (const item of it) {
        if (fn(it)) {
            return true
        }
    }

    return false
}

function every (it, fn) {
    for (const item of it) {
        if (!fn(it)) {
            return false
        }
    }

    return true
}

function flat_mapper (fn) {
   return it => flat_map(it, fn)
}

function with_replaced (obj, props, fn) {
    const keys = Object.keys(props)
    const old_props = Object.fromEntries(keys.map(key => ([key, obj[key]])))
    Object.assign(obj, props)
    const result = fn()
    Object.assign(obj, old_props)
    return result
}



/**
 * Type check meta functions
 */

const instanceof_check = Of => val => val instanceof Of
const typeof_check = name => val => typeof val === name

/**
 * Proerty/symbols/prototype functions
 */

const get_proto = val => Object.getPrototypeOf(val)
const get_proto_chain = create_iterator(get_proto, null)
const map_proto_chain = fn => map(get_proto_chain(val), fn)
const get_own_names = val => Object.getOwnPropertyNames(val)
const get_own_symbols = val => Object.getOwnPropertySymbols(val)
const get_own_props = val => concat(get_own_names(val), get_own_symbols(val))
const get_all_props = val => flat_map(get_proto_chain(val), get_own_props)

const prop_get = prop => val => (val?.[prop])
const prop_check = (prop, check) => val => check(val?.[prop])

/**
 * Type checks
 */

const is_array = val => Array.isArray(val)
const is_set = instanceof_check(Set)
const is_weak_map = instanceof_check(WeakMap)
const is_function = instanceof_check(Function)
const is_iterable = prop_check(Symbol.iterator, is_function)

/**
 * Type coercion
 */

function ensure_array (val) {
    if (is_array(val)) {
        return val
    } else if (is_set(b)) {
        return Array.from(val)
    } else {
        return [val]
    }
}

/**
 * Misc
 */

const sleep = ms => new Promise((resolve, reject) => setTimeout(resolve, ms))


function option_combinations (opts) {
    const result = []

    opts = {...opts}

    // Make sure everything is plain lists
    const keys = Object.keys(buckets)

    for (const key of keys) {
        const b = buckets[key]
        if (b instanceof Set || b instanceof WeakMap) {
            buckets[key] = Array.from(buckets[key])
        }
    }

    const idxs = (new Array(keys.length)).fill(0)
    let done = false

    while (idxs[0] < buckets[keys[0]].length) {
        const map = {}
        let i = 0
        for (const key of keys) {
            const bucket = buckets[key]
            map[key] = bucket[idxs[i]]
            ++i
        }

        result.push(map)


        // Update the indexes
        let k = keys.length - 1
        ++idxs[k]

        while (idxs[k] === buckets[keys[k]].length) {
            if (k == 0) {
                done = true
                break
            }

            idxs[k] = 0
            --k
            idxs[k] += 1
        }
    }

    return result
}

const construct = T => (...args) => new T(...args)

const array_from = bind(Array.from, Array)
const set_from = compose(construct(Set), concat)

function between (v, bot, top) {
    return (v >= bot) && (v <= top)
}


/**
 * Exports
 */

module.exports = {
    /**
     * Functional functions
     */
    $,
    partial,
    bind,
    compose,
    is_placeholder,
    times,
    create_iterator,
    concat,
    map,
    flat_map,
    find_indexes,
    concat,
    some,
    every,
    flat_mapper,

    /**
     * Proerty/symbols/prototype functions
     */

    get_proto,
    get_proto_chain,
    map_proto_chain,
    get_own_names,
    get_own_symbols,
    get_own_props,
    get_all_props,

    prop_get,
    prop_check,

    /**
     * Type checks
     */

    instanceof_check,
    typeof_check,
    is_array,
    is_set,
    is_weak_map,
    is_function,
    is_iterable,

    /**
     * Type coercion
     */

    ensure_array,
    array_from,
    set_from,

    /**
     * Misc
     */

    construct,
    sleep,
    option_combinations,
    identity,
    count,
    rand_int,
    strict_equals,
    with_replaced,
    between
}
