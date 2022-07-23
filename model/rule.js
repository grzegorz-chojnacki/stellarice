// @ts-check
/// <reference path="../paths.js" />

/** @typedef {Rule|Item} Entry */
/** @typedef {Entry|string} RawEntry */

class Rule {
  text = 'No special rules'

  /**
   * @param {RawEntry[]} entries
   */
  constructor(entries = []) {
    this.entries = entries
  }

  /**
   * Remove items (or item ids) from rule recursively
   * @param {RawEntry} entry
   * @returns {Rule}
   */
  without = entry => {
    this.entries.forEach((e, i) => {
      if (e === entry) this.entries.splice(i, 1)
      if (entry instanceof Rule) entry.without(e)
    })
    return this
  }

  /**
   * Checks if rule is passing, should call match for every item
   * @abstract
   * @returns {boolean}
   */
  test = () => true

  /**
   * Checks if a given item from entries is passing
   * @param {RawEntry} entry
   * @returns {boolean}
   */
  match = entry => {
    if (entry instanceof Item) return entry.checked()
    if (entry instanceof Rule) return entry.test()
    throw new Error(`Rule wasn't properly injected with items,
      found: '${entry}'`)
  }
}

// Every entry is true
class Every extends Rule {
  text = 'Must have'
  test = () => this.entries.every(this.match)
}

// At least one entry is true
class Some extends Rule {
  text = 'At least one of'
  test = () => this.entries.some(this.match)
}

// None of the entries are true
class None extends Rule {
  text = 'Cannot have'
  test = () => !this.entries.some(this.match)
}

// Syntax sugar for creating rule objects
/** @param {RawEntry[]} entries */
const some = (...entries) => new Some(entries)

/** @param {RawEntry[]} entries */
const none = (...entries) => new None(entries)

/** @param {RawEntry[]} entries */
const every = (...entries) => new Every(entries)

/** @param {RawEntry[]} entries */
const one =
  (...entries) =>
  () =>
    none(...entries)
