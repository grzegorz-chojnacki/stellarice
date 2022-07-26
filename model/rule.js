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

  toString = () => `${this.constructor.name}(${this.items.map(String).concat(this.rules.map(String)).join(',')})`

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
const some =
  (...entries) =>
  () =>
    new Some(entries.map(unwrap))

/** @type {(...entries: RawEntry[]) => RuleGen} */
const none =
  (...entries) =>
  () =>
    new None(entries.map(unwrap))

/** @type {(...entries: RawEntry[]) => RuleGen} */
const every =
  (...entries) =>
  () =>
    new Every(entries.map(unwrap))

/** @type {(...entries: RawEntry[]) => RuleGen} */
const one = none
