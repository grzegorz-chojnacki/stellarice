class Pop extends Item {
  generalRule = () => this.empireList.length === 1
  isAvailable = () => this.empireList.length === 0
}

const pop = Item.create(Pop, [
  { id: 'Botanic' },
  { id: 'Lithoid' },
  { id: 'Mechanical' },
])
