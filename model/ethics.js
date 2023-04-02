// @ts-check
/// <reference path="../paths.js" />

class Ethic extends Item {
  /** @type {(acc: number, o: { cost: number }) => number} */
  static costSum = (acc, { cost }) => acc - cost

  empireList = empire.ethics

  isAvailable = () => this.empireList.reduce(Ethic.costSum, 3) - this.cost >= 0
}

// Source: https://stellaris.paradoxwikis.com/Ethics

const militarist = one(
  'Fanatic Militarist',
  'Militarist',
  'Fanatic Pacifist',
  'Pacifist'
)

const xenophobe = one(
  'Fanatic Xenophobe',
  'Xenophobe',
  'Fanatic Xenophile',
  'Xenophile'
)

const authoritarian = one(
  'Fanatic Authoritarian',
  'Authoritarian',
  'Fanatic Egalitarian',
  'Egalitarian'
)

const materialist = one(
  'Fanatic Materialist',
  'Materialist',
  'Fanatic Spiritualist',
  'Spiritualist'
)

const normalEthics = [
  {
    cost: 2,
    id: 'Fanatic Militarist',
    rule: militarist,
  },
  {
    cost: 2,
    id: 'Fanatic Pacifist',
    rule: militarist,
  },
  {
    cost: 2,
    id: 'Fanatic Xenophobe',
    rule: xenophobe,
  },
  {
    cost: 2,
    id: 'Fanatic Xenophile',
    rule: xenophobe,
  },
  {
    cost: 2,
    id: 'Fanatic Authoritarian',
    rule: authoritarian,
  },
  {
    cost: 2,
    id: 'Fanatic Egalitarian',
    rule: authoritarian,
  },
  {
    cost: 2,
    id: 'Fanatic Materialist',
    rule: materialist,
  },
  {
    cost: 2,
    id: 'Fanatic Spiritualist',
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
  .map(Item.withRule(none('Mechanical')))

const ethics = [...normalEthics, new Ethic({ id: 'Gestalt', cost: 3 })]
