class Pop extends Item {
  constructor(name, rules) {
    super(name, rules)
  }

  genericConstraint = () => this.empireList.length < 1
}

const pop = {
  Biological: new Pop('Biological'),
  Mechanical: new Pop('Mechanical', () => every(ethics.Gestalt)),
  Plantoid:   new Pop('Plantoid'),
  Lithoid:    new Pop('Lithoid'),
}