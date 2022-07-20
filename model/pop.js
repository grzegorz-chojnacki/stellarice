class Pop extends Item {
  isAvailable = () => this.empireList.length === 0
}

const pop = Item.create(Pop, [
  { id: 'Botanic' },
  { id: 'Lithoid' },
  { id: 'Mechanical' },
])
