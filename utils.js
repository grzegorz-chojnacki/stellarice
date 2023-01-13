// @ts-check
/// <reference path="paths.js" />

/** @type {(x: any) => x is Item} */
const isItem = x => x instanceof Item

/** @type {(x: any) => x is Rule} */
const isRule = x => x instanceof Rule

/**
 * Helper partition function
 * @template T
 * @param {T[]} arr - array of elements to partition
 * @param {(value: T) => boolean} fn - predicate for partitioning
 * @return {[T[], T[]]}
 */
const partition = (arr, fn) =>
  arr.reduce(
    ([a, b], x) => (fn(x) ? [a.concat(x), b] : [a, b.concat(x)]),
    /** @type {[T[], T[]]} */ ([[], []])
  )

/**
 * Remove element from list at index
 * @template T
 * @param {T[]} arr - array of elements to operate on
 * @param {Number} i - index of element to remove
 */
const removeAt = (arr, i) => arr.splice(i, 1)

/**
 * Get random element from an array
 * @template T
 * @param {T[]} arr - array of elements to choose from
 * @return {T}
 */
const choice = arr => arr[Math.floor(Math.random() * arr.length)]

/**
 * Helper function for getting item by id from all items
 * @param {Item[]} items
 * @param {string} id
 * @returns {Item}
 */
const getItemById = (items, id) => {
  const item = items.find(item => item.id === id)
  if (!item) throw new Error(`Couldn't find item with id: '${id}'!`)
  return item
}

/** @type {(arr: Array) => Array} */
const clear = arr => arr.splice(0, arr.length)

/**
 * Check if item has a nested None rule and for each of its excluded items go
 * to them and add None rule in the reversed direction (with the source item)
 * @param {Item} item
 * @param {Rule} rule
 */
const exclude = (item, rule = item.rule) => {
  if (rule instanceof Every || rule instanceof Some) {
    rule.rules.forEach(r => exclude(item, r))
  } else if (rule instanceof None) {
    rule.items.forEach(i => i.exclude(item))
  }
}

/**
 * Generate list of unique pairs (combinations of 2 elements)
 * @template T
 * @param {T[]} arr
 */
const pairs = arr => arr.flatMap((v, i) => arr.slice(i + 1).map(w => [v, w]))

/**
 * Insert item to the list if it is not already included, remove it if found
 * @param {Item[]} list
 * @param {Item} item
 */
const toggleIncluded = (list, item) => {
  if (list.includes(item)) {
    list.splice(list.indexOf(item), 1)
  } else {
    list.push(item)
  }
}

/**
 * Capitalize string
 * @type {(str: string) => string}
 */
const capitalize = str => str[0].toUpperCase() + str.slice(1)

/**
 * Make certain words lowercase
 * @type {(str: string) => string}
 */
const decapitalize = str =>
  str.replace(/\b(to|be|the|of)\b/gi, x => x.toLowerCase())

/**
 * Insert spaces before uppercase words
 * @type {(str: string) => string}
 */
const spacify = str => str.replace(/[A-Z](?=[a-z])/g, x => ' ' + x).trim()

/**
 * Convert PascalCase to normal wording, with specific capitalization rules
 * @type {(str: string) => string}
 */
const prettify = str => decapitalize(capitalize(spacify(str)))
