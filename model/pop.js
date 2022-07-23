// @ts-check
/// <reference path="../paths.js" />

class Pop extends Item {
  get empireList() {
    return empire.pop
  }

  isAvailable = () => this.empireList.length === 0
}

const pop = Item.create(Pop, [
  { id: 'Botanic' },
  { id: 'Lithoid' },
  { id: 'Mechanical' },
])
