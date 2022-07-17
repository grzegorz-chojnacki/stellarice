class Pop extends Item {
  constructor(rules) {
    super(rules)
  }

  generalRule = () => this.empireList.length < 1
}

const pop = nameItems({
  Biological: new Pop(),
  Botanic: new Pop(),
  Lithoid: new Pop(),
  Mechanical: new Pop(),
})
