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
 * Item name comparator used for sorting
 * @param {Item} a
 * @param {Item} b
 * @returns {number}
 */
const compareItems = (a, b) => a.fullName.localeCompare(b.fullName)

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
 * @param {() => Rule} ruleFn
 * @returns {(item: Item) => Item}
 */
const withRule = ruleFn => item => {
  item.ruleFns.push(ruleFn)
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

/** @type {(type: typeof Rule) => (rule: Rule) => (Rule|Entry[])} */
const flattenIfOfType = type => rule => {
  if (rule instanceof type) return rule.entries
  else return rule
}

/** @type {(a: Rule, b: Rule) => boolean} */
const areMergable = (a, b) =>
  (a instanceof Every || a instanceof None) && a.constructor === b.constructor

/**
 * A rule can be omitted if it adds unnecessary nesting: e.g. Every & Some with
 * one child rule will always have the same test result as its child
 * @type {(rule: Rule) => boolean}
 */
const canBeOmitted = rule =>
  (rule instanceof Every || rule instanceof Some) &&
  rule.entries.length === 1 &&
  rule.entries[0] instanceof Rule

/** @type {(rule: Rule[]) => Rule[]} */
const merge = rules =>
  rules.reduce((acc, rule) => {
    const target = acc.find(r => areMergable(r, rule))
    if (target) {
      target.entries = target.entries.concat(rule.entries)
      return acc
    } else return acc.concat(rule)
  }, /** @type {Rule[]} */ ([]))

/** @type {(root: Rule) => Rule} */
const simplify = root => {
  if (root.rules.length === 0) return root

  // Recursive simplify + merge of rules
  if (root instanceof Every || root instanceof None) {
    const ctor = /** @type {typeof Rule}*/ (root.constructor)
    const simple = root.rules.map(simplify)
    const entries = merge(simple).flatMap(flattenIfOfType(ctor))
    const items = entries.filter(isItem)
    const rules = entries.filter(isRule)
    const rule = new ctor([...root.items, ...items, ...merge(rules)])
    if (canBeOmitted(rule)) return rule.rules[0]
    return rule
  }

  return root
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
