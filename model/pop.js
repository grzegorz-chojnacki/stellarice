class Pop extends Item {
  constructor(rules) {
    super(rules)
  }

  generalRule = () => this.empireList.length < 1
}

const pop = Item.create(Pop, [
  { name: 'Biological' },
  { name: 'Botanic' },
  { name: 'Lithoid' },
  { name: 'Mechanical' },
])
