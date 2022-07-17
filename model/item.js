class Item {
  constructor(rules) {
    this.rules = rules
    this.empireName = this.constructor.name.toLowerCase()
  }

  get empireList() { return empire[this.empireName] }

  genericConstraint = () => true

  hidden = () => false

  unmetRules = () => (this.rules && !this.rules())

  checked = () => this.empireList.includes(this)
  invalid = () => this.unmetRules()
  valid   = () => this.checked() || (this.genericConstraint() && !this.unmetRules())
}
