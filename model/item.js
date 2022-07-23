// @ts-check
/// <reference path="../paths.js" />

/**
 * @typedef RawItem
 * @property {string} id
 * @property {number=} cost
 * @property {Rule=} rule
 */

class Item {
  /**
   * Helper method for constructing items from simple objects
   * @param {typeof Item} classRef
   * @param {RawItem[]} objects
   * @returns {Item[]}
   */
  static create = (classRef, objects) => {
    return objects.map(o => new classRef(o))
  }

  /**
   * Helper method that creates function for merging with rules of an item
   * @param {Rule} rule
   * @returns {(item: Item) => Item}
   */
  static withRule = rule => item => {
    if (item.rule?.constructor === Rule) {
      item.rule = rule
    } else if (rule.constructor === item.rule?.constructor) {
      item.rule.items = rule.items.concat(item.rule?.items)
    } else if (rule instanceof Every) {
      item.rule = every(...rule.items, item.rule)
    } else if (item.rule instanceof Every) {
      item.rule = every(rule, ...item.rule.items)
    } else {
      item.rule = every(rule, item.rule)
    }
    return item
  }

  /** @param {RawItem} _ */
  constructor({ id, cost = 0, rule = new Rule() }) {
    this.id = id
    this.name = prettify(id)
    this.cost = cost
    this.rule = rule.without(this.id)
    this.empireName = this.constructor.name.toLowerCase()
  }

  // Used for displaying the rule
  get fullName() {
    return `${this.constructor.name} ${this.name}`
  }

  // Used to display the input label (and e.g. differentiate from the summary)
  get label() {
    return this.name
  }

  /**
   * Empire list of related items
   *
   * Used as getter, because empire doesn't exist yet while defining the model
   * @abstract
   * @returns {Item[]}
   */
  get empireList() {
    throw new Error('Item does not have an empireList defined!')
  }

  /**
   * A general rule to check for every item in the class
   *
   * Used to determine if the composition is valid
   * @returns {boolean}
   */
  generalRule = () => true

  /**
   * A general rule to check for every item in the class
   *
   * Used to determine if the composition is valid
   * @returns {boolean}
   */
  isAvailable = () => true

  // Logic & HTML formatting helper methods
  valid = () => this.rule.test()
  invalid = () => !this.rule.test()
  checked = () => this.empireList.includes(this)
  disabled = () => !this.checked() && (!this.isAvailable() || this.invalid())
}
