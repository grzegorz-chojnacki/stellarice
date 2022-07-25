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
 * Sort rules/items alphabetically, hoist items to the top
 * @param {Entry[]} entries
 * @returns {Entry[]}
 */
const sortEntries = entries => {
  const [items, rules] =
    /** @type {[Item[], Rule[]]} */
    (partition(entries, x => x instanceof Item))

  items.sort((a, b) => a.fullName.localeCompare(b.fullName))
  return [...items, ...rules]
}

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
 * Add type to RawItem-like object
 * @param {typeof Item} type
 * @returns {(item: { id: string, cost?: number, rule?: RawRule }) => RawItem }
 */
const addItemType = type => item => ({ ...item, type })

/**
 * Construct item from a raw item object, item has still raw rules inside
 * @type {(item: RawItem) => Item}
 */
const cookItem = ({ type, id, cost, rule }) => new type(id, cost, rule)

/**
 * Construct rule from a raw rule object
 * @type {(rule: RawRule, items: Item[]) => Rule}
 */
const cookRule = ({ type, entries }, items) =>
  new type(
    entries.map(entry => {
      if (typeof entry === 'string') return getItemById(items, entry)
      else return cookRule(entry, items)
    })
  )

/**
 * Helper method that creates function for merging with rules of an item
 * @param {() => RawRule} ruleFn
 * @returns {(item: RawItem) => RawItem}
 */
const withRule = ruleFn => item => {
  const rule = ruleFn()
  if (!item.rule || item.rule.type === Rule) {
    item.rule = rule
  } else if (rule.type === item.rule.type) {
    item.rule.entries = rule.entries.concat(item.rule?.entries)
  } else if (rule.type === Every) {
    item.rule = every(...rule.entries, item.rule)
  } else if (item.rule.type === Every) {
    item.rule = every(rule, ...item.rule.entries)
  } else {
    item.rule = every(rule, item.rule)
  }
  return item
}

/**
 * Check if item has a None rule (or Every rule with None rule) and for each of
 * its items go to them and add None rule in the reversed direction
 * @param {Item} item
 */
const doubleBindNone = item => {
  let rule = item.rule
  if (item.rule instanceof Every) {
    // @ts-ignore
    rule = item.rule.entries.find(e => e instanceof None)
  }

  if (rule instanceof None) {
    rule.entries.forEach(entry => {
      if (entry instanceof Item) {
        if (!entry.rule.entries.includes(item)) {
          if (entry.rule.constructor === Rule) {
            entry.rule = new None([item])
          } else if (entry.rule instanceof None) {
            entry.rule.entries.push(item)
          } else if (entry.rule instanceof Every) {
            const none = entry.rule.entries.find(r => r instanceof None)
            if (none instanceof None) {
              none.entries.push(item)
            } else {
              entry.rule.entries.push(new None([item]))
            }
          }
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
 * Recursively go through rules and simplify them
 * @param {Rule} rule - rule to inject with item references
 */
const mergeRules = rule => {
  rule.entries.forEach(entry => {
    if (entry instanceof Rule) mergeRules(entry)
  })

  pairs(rule.entries).forEach(([a, b]) => {
    if (a instanceof Item || b instanceof Item) return
    if (a.constructor === Some) return
    if (b.constructor === Some) return
    if (a.constructor === b.constructor) {
      a.entries = a.entries.concat(b.entries)
      rule.entries.splice(
        rule.entries.findIndex(e => e === b),
        1
      )
    }
  })
}

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
