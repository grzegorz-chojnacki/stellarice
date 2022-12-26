// @ts-check
/// <reference path="../paths.js" />

/**
 * @typedef RawRule
 * @property {typeof Rule} type
 * @property {(string|RawRule)[]} entries
 */

/**
 * @typedef {Item|Rule} Entry
 */

class Rule {
  /**
   * Checks if the entry passes its tests
   * @abstract
   * @param {Entry} entry
   * @returns {boolean}
   */
  static check = entry => {
    if (entry instanceof Item) return entry.checked()
    else return entry.test()
  }

  /**
   * Helper method for flattening the hierarchy of **Every and None** rules
   *
   * Parent rule can take on the entries from its child when their type match
   *
   * *To be used with `Array.map` or `Array.flatMap`*
   * @type {(type: (typeof Every|typeof None)) => (rule: Rule) => (Rule|Entry[])}
   */
  static flattenIfOfType = type => rule => {
    if (rule instanceof type) return rule.entries
    else return rule
  }

  /**
   * Check if the two rules can have their entries merged
   * @type {(a: Rule, b: Rule) => boolean}
   */
  static areMergable = (a, b) =>
    (a instanceof Every || a instanceof None) && a.constructor === b.constructor

  /**
   * A rule can be omitted if it adds unnecessary nesting: e.g. Every & Some
   * with one child rule will always have the same test result as its child
   * @type {(rule: Rule) => boolean}
   */
  static canBeOmitted = rule =>
    (rule instanceof Every || rule instanceof Some) &&
    rule.entries.length === 1 &&
    rule.entries[0] instanceof Rule

  /**
   * Go through rule array and entries from merge applicable rules
   * @type {(rule: Rule[]) => Rule[]}
   */
  static merge = rules =>
    rules.reduce((acc, rule) => {
      const target = acc.find(r => Rule.areMergable(r, rule))
      if (target) {
        target.entries = target.entries.concat(rule.entries)
        return acc
      } else return acc.concat(rule)
    }, /** @type {Rule[]} */ ([]))

  /**
   * Recursively go through rules and try to simplify their hierarchy
   * @type {(root: Rule) => Rule}
   */
  static simplify = root => {
    if (root.rules.length === 0) return root
    if (root instanceof Every || root instanceof None) {
      const ctor = /** @type {typeof Rule}*/ (root.constructor)
      const simple = root.rules.map(Rule.simplify)
      const entries = Rule.merge(simple).flatMap(Rule.flattenIfOfType(ctor))
      const items = entries.filter(isItem)
      const rules = entries.filter(isRule)
      const rule = new ctor([...root.items, ...items, ...Rule.merge(rules)])
      if (Rule.canBeOmitted(rule)) return rule.rules[0]
      return rule
    } else return root
  }

  text = 'No special rules'

  /**
   * @param {(Rule | Item)[]} entries
   */
  constructor(entries = []) {
    this.entries = entries
  }

  /**
   * Recursively create a copy o this rule without a given item
   * @param {Item} item
   * @returns {Rule}
   */
  without = item => {
    // @ts-ignore
    return new this.constructor([
      ...this.items.filter(i => i !== item),
      ...this.rules.map(rule => rule.without(item)),
    ])
  }

  toString = () =>
    `${this.constructor.name}(${this.items
      .map(String)
      .concat(this.rules.map(String))
      .join(',')})`

  /**
   * Checks if rule is passing, should call Rule.check for every item
   * @abstract
   * @returns {boolean}
   */
  test = () => true

  get items() {
    return this.entries.filter(isItem)
  }

  get rules() {
    return this.entries.filter(isRule)
  }
}

// Every entry is true
class Every extends Rule {
  text = 'Every one of:'
  test = () => this.entries.every(Rule.check)
}

// At least one entry is true
class Some extends Rule {
  text = 'At least one of:'
  test = () => this.entries.some(Rule.check)
}

// None of the entries are true
class None extends Rule {
  text = 'None of:'
  test = () => !this.entries.some(Rule.check)
}

/**
 * Take an item id and fetch the real item or take a rule generator and run it
 * @param {RawEntry} entry
 * @returns {Rule|Item}
 */
const unwrap = entry => {
  if (typeof entry === 'string') return getItemById(all, entry)
  else return entry()
}

/** @typedef {(() => Rule)} RuleGen  */
/** @typedef {string|RuleGen} RawEntry */

// Syntax sugar for creating rule objects
/** @type {(...entries: RawEntry[]) => RuleGen} */
const some = (...entries) => {
  return () => new Some(entries.map(unwrap))
}

/** @type {(...entries: RawEntry[]) => RuleGen} */
const none = (...entries) => {
  return () => new None(entries.map(unwrap))
}

/** @type {(...entries: RawEntry[]) => RuleGen} */
const every = (...entries) => {
  return () => new Every(entries.map(unwrap))
}

/**
 * Semantic helper used for exclusion groups (e.g. Authority militarist excludes
 * its fanatic version and the pacifist authorities).
 * Basically, an entry cannot exclude itself, so if we want to make an exlusion
 * group we can include every entry on a common rule and use it between all of
 * them.
 * @type {(...entries: RawEntry[]) => RuleGen}
 */
const one = none
