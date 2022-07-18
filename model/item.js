class Item {
  // Helper method for constructing items from simple objects
  static create = (classRef, objects) => {
    if (!Item.isPrototypeOf(classRef))
      throw new Error('Supplied class does not extend Item')
    return objects.map(o => new classRef(o))
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
