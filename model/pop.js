// @ts-check
/// <reference path="../paths.js" />

class Pop extends Item {
  empireList = empire.pop

  isAvailable = () => this.empireList.length === 0
}

// Source: https://stellaris.paradoxwikis.com/Species

const pop = [
  { id: 'Botanic' },
  {
    id: 'Lithoid',
    rule: none(
      'Agrarian',
      'Extremely Adaptive',
      'Nonadaptive',
      'Slow Breeders'
    ),
  },
  { id: 'Mechanical' },
].map(item => new Pop(item))
