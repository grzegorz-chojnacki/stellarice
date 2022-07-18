class Item {
  // Helper method for constructing items from simple objects
  static create = (classRef, objects) => {
    if (!Item.isPrototypeOf(classRef)) throw new Error('Supplied class does not extend Item')
    return objects.map(o => new classRef(o))
  }

  constructor({ id, rule = null }) {
    this.id = id
    this.name = prettify(id)
    this.rule = rule
    this.empireName = this.constructor.name.toLowerCase()
  }

  makeEmpireNamePlural = () => (this.empireName += 's')

  // Test x in the context of this item, x can be either another Item or a rule.
  //   - When x is an Item tests if it is selected (is in the empire)
  //   - When x has a 'type' property we assume that it is a rule object and
  //     we can test the rule according to that type
  test = x => {
    if (x instanceof Item) return x.checked()
    switch (x.type) {
      case 'every': // Every subitem is true
        return x.items.every(this.test)
      case 'some': // At least one subitem is true
        return x.items.some(this.test)
      case 'none': // None of the subitems are true
        return !x.items.some(this.test)
      case 'one': // Just one subitem is true
        return !x.items.filter(i => i !== this).some(this.test)
    }
  }

  // Empire is not initialize before the creation of Items, so we have to defer
  get empireList() {
    return empire[this.empireName]
  }

  // A general rule for every item in class
  generalRule = () => true

  // Logic & HTML formatting helper methods
  hidden = () => false
  unmetRule = () => !!(this.rule && !this.test(this.rule))
  invalid = () => this.unmetRule()
  checked = () => this.empireList.includes(this)
  disabled = () =>
    !(this.checked() || (this.generalRule() && !this.unmetRule()))
}
