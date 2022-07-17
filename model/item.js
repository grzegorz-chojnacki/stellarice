class Item {
  constructor(rules) {
    this.rules = rules
    this.empireName = this.constructor.name.toLowerCase()
  }

  test = x => {
    if (x === undefined) throw new Error('Encountered undefined value while testing rules')
    if (x instanceof Item) return nestedIn(empire, x)
    switch (x.type) {
      case 'every': return  x.items.every(this.test)
      case 'some':  return  x.items.some(this.test)
      case 'none':  return !x.items.some(this.test)
      case 'one':   return !x.items.filter(i => i !== this).some(this.test)
    }
  }

  get empireList() { return empire[this.empireName] }

  generalTest = () => true

  hidden = () => false

  unmetRules = () => !!(this.rules && !this.test(this.rules()))

  checked = () => this.empireList.includes(this)
  invalid = () => this.unmetRules()
  valid   = () => this.checked() || (this.generalTest() && !this.unmetRules())
}
