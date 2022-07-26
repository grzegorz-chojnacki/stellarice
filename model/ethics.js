// @ts-check
/// <reference path="../paths.js" />

class Ethic extends Item {
  /** @type {(acc: number, { cost: number }) => number} */
  static costSum = (acc, { cost }) => acc - cost

  empireList = empire.ethics

  generalRule = () => this.empireList.reduce(Ethic.costSum, 3) === 0
  isAvailable = () => this.empireList.reduce(Ethic.costSum, 3) - this.cost >= 0
}

const militarist = one(
  'FanaticMilitarist',
  'Militarist',
  'FanaticPacifist',
  'Pacifist'
)

const xenophobe = one(
  'FanaticXenophobe',
  'Xenophobe',
  'FanaticXenophile',
  'Xenophile'
)

const authoritarian = one(
  'FanaticAuthoritarian',
  'Authoritarian',
  'FanaticEgalitarian',
  'Egalitarian'
)

const materialist = one(
  'FanaticMaterialist',
  'Materialist',
  'FanaticSpiritualist',
  'Spiritualist'
)

const normalEthics = [
  {
    cost: 2,
    id: 'FanaticMilitarist',
    rule: militarist,
  },
  {
    cost: 2,
    id: 'FanaticPacifist',
    rule: militarist,
  },
  {
    cost: 2,
    id: 'FanaticXenophobe',
    rule: xenophobe,
  },
  {
    cost: 2,
    id: 'FanaticXenophile',
    rule: xenophobe,
  },
  {
    cost: 2,
    id: 'FanaticAuthoritarian',
    rule: authoritarian,
  },
  {
    cost: 2,
    id: 'FanaticEgalitarian',
    rule: authoritarian,
  },
  {
    cost: 2,
    id: 'FanaticMaterialist',
    rule: materialist,
  },
  {
    cost: 2,
    id: 'FanaticSpiritualist',
    rule: materialist,
  },
  {
    cost: 1,
    id: 'Militarist',
    rule: militarist,
  },
  {
    cost: 1,
    id: 'Pacifist',
    rule: militarist,
  },
  {
    cost: 1,
    id: 'Xenophobe',
    rule: xenophobe,
  },
  {
    cost: 1,
    id: 'Xenophile',
    rule: xenophobe,
  },
  {
    cost: 1,
    id: 'Authoritarian',
    rule: authoritarian,
  },
  {
    cost: 1,
    id: 'Egalitarian',
    rule: authoritarian,
  },
  {
    cost: 1,
    id: 'Materialist',
    rule: materialist,
  },
  {
    cost: 1,
    id: 'Spiritualist',
    rule: materialist,
  },
]
  .map(item => new Ethic(item))
  .map(withRule(none('Mechanical')))

const ethics = [...normalEthics, new Ethic({ id: 'Gestalt', cost: 3 })]
