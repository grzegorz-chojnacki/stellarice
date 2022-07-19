class Pop extends Item {
  generalRule = () => this.empireList.length < 1
}

const pop = Item.create(Pop, [
  { id: 'Biological' },
  { id: 'Botanic' },
  { id: 'Lithoid' },
  { id: 'Mechanical' },
])
