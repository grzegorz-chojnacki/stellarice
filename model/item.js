class Item {
  // Helper method for constructing items from simple objects
  static create = (classRef, objects) => objects.map(o => new classRef(o))

  constructor(rules) {
    this.rules = rules
    this.empireName = this.constructor.name.toLowerCase()
  }

  makeEmpireNamePlural = () => (this.empireName += 's')

  // Test x in the context of this item, x can be either another Item or a rule.
  //   - When x is an Item tests if it is selected (is in the empire)
  //   - When x has a 'type' property we assume that it is a rule object and
  //     we can test the rule according to that type
  test = x => {
    if (x === undefined)
      throw new Error('Encountered undefined value while testing rules')
    if (x instanceof Item) return nestedIn(empire, x)
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

  // Abstract, test if the item from the list meets special rules
  testClash = (list, rules) => nestedIn(list, this) && this.test(rules)

  // A general rule for every item in class
  generalRule = () => true

  // Logic & HTML formatting helper methods
  hidden = () => false
  unmetRules = () => !!(this.rules && !this.test(this.rules()))
  invalid = () => this.unmetRules()
  checked = () => this.empireList.includes(this)
  disabled = () =>
    !(this.checked() || (this.generalRule() && !this.unmetRules()))
}
