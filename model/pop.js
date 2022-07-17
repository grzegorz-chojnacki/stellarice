class Pop extends Item {
  constructor(rules) {
    super(rules)
  }

  genericConstraint = () => this.empireList.length < 1
}

const pop = nameItems({
  Biological: new Pop(),
  Mechanical: new Pop(() => every(ethics.Gestalt)),
  Botanic:    new Pop(),
  Lithoid:    new Pop(),
})
