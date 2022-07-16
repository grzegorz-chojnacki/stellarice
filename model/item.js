class Item {
  constructor(name, rules = () => true) {
    this.name = name
    this.rules = rules
    this.empireName = this.constructor.name.toLowerCase()
  }

  get empireList() { return empire[this.empireName] }

  genericConstraint = () => true

  checked = () => this.empireList.includes(this)
  invalid = () => !(this.rules())
  valid   = () => this.checked() || (this.genericConstraint() && this.rules())
}