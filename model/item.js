// @ts-check
/// <reference path="../paths.js" />

/**
 * The empire structure, used for keeping the state of which item is checked
 * @type {{ [x: string]: Item[] }}
 */
const empire = {
  pop: [],
  traits: [],
  origin: [],
  ethics: [],
  authority: [],
  civics: [],
}

/**
 * @typedef RawItem
 * @property {typeof Item} type
 * @property {string} id
 * @property {number=} cost
 * @property {RawRule=} rule
 */

class Item {
  /**
   * List of items relevant to this item type
   * @abstract
   * @type {Item[]}
   */
  empireList = []

  /**
   * @param {string} id
   * @param {number=} cost
   * @param {RawRule=} rule
   */
  constructor(id, cost = 0, rule = { type: Rule, entries: [] }) {
    this.id = id
    this.name = prettify(id)
    this.cost = cost
    this.rule = new Every([])
    this.rawRule = rule
  }

  // Used for displaying the item in tooltip
  get fullName() {
    return `${this.constructor.name} ${this.name}`
  }

  // Used to display the input label (and e.g. differentiate from the summary)
  get label() {
    return this.name
  }

  clean() {
    this.rule = this.rule.without(this)
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
