class Item {
  constructor(rules = () => true) {
    this.rules = rules
    this.empireName = this.constructor.name.toLowerCase()
  }

  get empireList() { return empire[this.empireName] }

  genericConstraint = () => true

  checked = () => this.empireList.includes(this)
  invalid = () => !(this.rules())
  valid   = () => this.checked() || (this.genericConstraint() && this.rules())
}