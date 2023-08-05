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
   * @type {(str: Object) => Item[]}
   */
  static loadData = data => {
    const ctorMap = {
      pop: Pop,
      traits: Trait,
      origins: Origin,
      ethics: Ethic,
      authority: Authority,
      civics: Civic,
    }

    const all = []

    for (let [domain, kinds] of Object.entries(data)) {
      const ctor = ctorMap[domain]
      for (let [kind, items] of Object.entries(kinds)) {
        for (let [id, item] of Object.entries(items)) {
          data[domain][kind][id] = new ctor(item)
          all.push(data[domain][kind][id])
        }
      }
    }
    return all
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
   * @property {RawRule=} rule
   */

  /** @param {RawItem} _ */
  constructor({ id, cost = 0, rule }) {
    this.id = id
    this.cost = cost
    this.rawRule = rule
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
    if (this.rawRule) {
      this.rule = Rule.simplify(Rule.fromRaw(this.rawRule))
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
