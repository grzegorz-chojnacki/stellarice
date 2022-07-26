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

/**
 * Check if item has a None rule (or Every rule with None rule) and for each of
 * its items go to them and add None rule in the reversed direction
 * @param {Item} item
 */
const doubleBindNone = item => {
  let rule = item.rule
  if (rule instanceof Every) {
    // If rule is an instance of Every, we can check if it contains a None rule
    // and use that instead
    rule = rule.rules.find(e => e instanceof None) || rule
  }

  if (rule instanceof None) {
    rule.items.forEach(i => {
      const target = i.rule
      if (target.items.includes(item)) return
      if (target.constructor === Rule) {
        i.rule = new None([item])
      } else if (target instanceof None) {
        target.entries.push(item)
      } else if (target instanceof Every) {
        const none = target.rules.find(r => r instanceof None)
        if (none) {
          none.entries.push(item)
        } else {
          target.entries.push(new None([item]))
        }
      }
    })
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
