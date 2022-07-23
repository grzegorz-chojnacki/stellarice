// @ts-check
/// <reference path="../paths.js" />

class Rule {
  text = 'No special rules'

  /**
   * @param {(Rule|Item|string)[]} items
   */
  constructor(items = []) {
    this.items = items
  }

  /**
   * Remove items (or item ids) from rule recursively
   * @param {Item|Rule|string} x
   * @returns {Rule}
   */
  without = x => {
    this.items.forEach((item, i) => {
      if (item === x) this.items.splice(i, 1)
      if (x instanceof Rule) x.without(item)
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
   * Checks if a given item from items is passing
   * @param {Item|Rule|string} x
   * @returns {boolean}
   */
  match = x => {
    if (x instanceof Item) return x.checked()
    if (x instanceof Rule) return x.test()
    throw new Error(`Rule wasn't properly injected with items, found: '${x}'`)
  }
}

// Every subitem is true
class Every extends Rule {
  text = 'Must have'
  test = () => this.items.every(this.match)
}

// At least one subitem is true
class Some extends Rule {
  text = 'At least one of'
  test = () => this.items.some(this.match)
}

// None of the subitems are true
class None extends Rule {
  text = 'Cannot have'
  test = () => !this.items.some(this.match)
}

// Syntax sugar for creating rule objects
/** @param {(Item|Rule|string)[]} items */
const some = (...items) => new Some(items)

/** @param {(Item|Rule|string)[]} items */
const none = (...items) => new None(items)

/** @param {(Item|Rule|string)[]} items */
const every = (...items) => new Every(items)

/** @param {(Item|Rule|string)[]} items */
const one =
  (...items) =>
  () =>
    none(...items)
