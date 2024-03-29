// @ts-check
/// <reference path="../paths.js" />

class Item {
  /**
   * Item name comparator used for sorting
   * @param {Item} a
   * @param {Item} b
   * @returns {number}
   */
  static compareItems = (a, b) => a.fullName.localeCompare(b.fullName)

  /**
   * Helper method that creates function for add rule to an item
   *
   * To be used in `Array.map` or `Array.flatMap`
   * @param {() => Rule} ruleFn
   * @returns {(item: Item) => Item}
   */
  static withRule = ruleFn => item => {
    item.ruleFns.push(ruleFn)
    return item
  }

  /**
   * List of items relevant to this item type
   * @abstract
   * @type {Item[]}
   */
  empireList = []

  /**
   * @typedef RawItem
   * @property {string} id
   * @property {number=} cost
   * @property {RuleGen=} rule
   */

  /** @param {RawItem} _ */
  constructor({ id, cost = 0, rule }) {
    this.id = id
    this.cost = cost
    this.ruleFns = rule ? [rule] : []
    this.rule = new Rule()

    // Special rule that will contain all items that have a None rule for this
    // item - meaning they exclude each other
    this.exclusive = new None([])
    this.exclusive.text = 'Excluded by:'
  }

  // Used for displaying the item in tooltip
  get fullName() {
    return `${this.constructor.name} ${this.id}`
  }

  // Used to display the input label (and e.g. differentiate from the summary)
  get label() {
    return this.id
  }

  // Each item has to be initialized before proper usage because of lazy-rules
  initialize() {
    if (this.ruleFns.length > 0) {
      const rules = this.ruleFns.map(fn => fn().without(this))
      this.rule = Rule.simplify(new Every(rules))
    }
  }

  toString = () => this.id

  /**
   * Add an item to the exclusive list of this item
   * @param {Item} item
   * @returns
   */
  exclude = item => {
    if (!this.exclusive.entries.includes(item)) {
      this.exclusive.entries.push(item)
    }
  }

  /**
   * A general rule to check for every item in the class
   *
   * Used to determine if the composition is valid
   * @returns {boolean}
   */
  isAvailable = () => true

  // Logic & HTML formatting helper methods
  invalid = () => !this.rule.test() || !this.exclusive.test()
  checked = () => this.empireList.includes(this)
  checkable = () => !this.checked() && this.isAvailable() && !this.invalid()
  disabled = () => !this.checked() && (!this.isAvailable() || this.invalid())
}
