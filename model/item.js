// @ts-check
/// <reference path="../paths.js" />

class Item {
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
    this.name = prettify(id)
    this.cost = cost
    this.ruleFns = rule ? [rule] : []
    this.rule = new Every()
  }

  initialize() {
    const rules = this.ruleFns.map(fn => fn().without(this))
    this.rule = simplify(new Every(rules))
  }

  // Used for displaying the item in tooltip
  get fullName() {
    return `${this.constructor.name} ${this.name}`
  }

  // Used to display the input label (and e.g. differentiate from the summary)
  get label() {
    return this.name
  }

  toString = () => this.id

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
  invalid = () => !this.rule.test()
  checked = () => this.empireList.includes(this)
  disabled = () => !this.checked() && (!this.isAvailable() || this.invalid())
}
