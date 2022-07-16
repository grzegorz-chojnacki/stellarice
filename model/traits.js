class Trait extends Item {
  constructor(name, rules) {
    super(name, rules)
    this.empireName += 's'
  }

  genericConstraint = () => (this.empireList.length < 5)
}

const traits = {}