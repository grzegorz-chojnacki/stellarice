// @ts-check
/// <reference path="../paths.js" />

class Pop extends Item {
  empireList = empire.pop

  isAvailable = () => this.empireList.length === 0
}

const pop = [
  { id: 'Botanic' },
  {
    id: 'Lithoid',
    rule: none('Agrarian', 'ExtremelyAdaptive', 'Nonadaptive', 'SlowBreeders'),
  },
  { id: 'Mechanical' }]
  .map(item => new Pop(item))
