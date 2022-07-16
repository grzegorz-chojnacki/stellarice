class Civic extends Item {
  constructor(name, rules) {
    super(name, rules)
    this.empireName += 's'
  }

  genericConstraint = () => (this.empireList.length < 2)
}

const civics = {}