class Item {
  // Helper method for constructing items from simple objects
  static create = (classRef, objects) => {
    if (!Item.isPrototypeOf(classRef))
      throw new Error('Supplied class does not extend Item')
    return objects.map(o => new classRef(o))
  }

  static withRule = rule => item => {
    if (item.rule.constructor === Rule) {
      item.rule = rule
    } else if (rule.constructor === item.rule.constructor) {
      item.rule.items = rule.items.concat(item.rule.items)
    } else if (rule instanceof Every) {
      item.rule = every(...rule.items, item.rule)
    } else if (item.rule instanceof Every) {
      item.rule = every(rule, ...item.rule.items)
    } else {
      item.rule = every(rule, item.rule)
    }
    return item
  }

  constructor({ id, rule = new Rule() }) {
    this.id = id
    this.name = prettify(id)
    this.rule = rule
    this.rule.remove(this.id)
    this.empireName = this.constructor.name.toLowerCase()
  }

  makeEmpireNamePlural = () => (this.empireName += 's')

  // Empire is not initialize before the creation of Items, so we have to defer
  get empireList() {
    return empire[this.empireName]
  }

  // A general rule for every item in class
  generalRule = () => true

  // Logic & HTML formatting helper methods
  hidden = () => false
  unmetRule = () => !this.rule.test()
  invalid = () => this.unmetRule()
  checked = () => this.empireList.includes(this)
  disabled = () =>
    !(this.checked() || (this.generalRule() && !this.unmetRule()))
}
