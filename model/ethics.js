class Ethic extends Item {
  static costSum = (acc, { cost }) => acc + cost

  constructor(item) {
    super(item)
    this.makeEmpireNamePlural()
    this.cost = item.cost
  }

  generalRule = () => this.empireList.reduce(Ethic.costSum, 0) + this.cost <= 3
}

const militarist = () =>
  none('FanaticMilitarist', 'Militarist', 'FanaticPacifist', 'Pacifist')

const xenophobe = () =>
  none('FanaticXenophobe', 'Xenophobe', 'FanaticXenophile', 'Xenophile')

const authoritarian = () =>
  none(
    'FanaticAuthoritarian',
    'Authoritarian',
    'FanaticEgalitarian',
    'Egalitarian'
  )

const materialist = () =>
  none(
    'FanaticMaterialist',
    'Materialist',
    'FanaticSpiritualist',
    'Spiritualist'
  )

const ethics = Item.create(Ethic, [
  ...[
    {
      cost: 2,
      id: 'FanaticMilitarist',
      rule: militarist(),
    },
    {
      cost: 2,
      id: 'FanaticPacifist',
      rule: militarist(),
    },
    {
      cost: 2,
      id: 'FanaticXenophobe',
      rule: xenophobe(),
    },
    {
      cost: 2,
      id: 'FanaticXenophile',
      rule: xenophobe(),
    },
    {
      cost: 2,
      id: 'FanaticAuthoritarian',
      rule: authoritarian(),
    },
    {
      cost: 2,
      id: 'FanaticEgalitarian',
      rule: authoritarian(),
    },
    {
      cost: 2,
      id: 'FanaticMaterialist',
      rule: materialist(),
    },
    {
      cost: 2,
      id: 'FanaticSpiritualist',
      rule: materialist(),
    },
    {
      cost: 1,
      id: 'Militarist',
      rule: militarist(),
    },
    {
      cost: 1,
      id: 'Pacifist',
      rule: militarist(),
    },
    {
      cost: 1,
      id: 'Xenophobe',
      rule: xenophobe(),
    },
    {
      cost: 1,
      id: 'Xenophile',
      rule: xenophobe(),
    },
    {
      cost: 1,
      id: 'Authoritarian',
      rule: authoritarian(),
    },
    {
      cost: 1,
      id: 'Egalitarian',
      rule: authoritarian(),
    },
    {
      cost: 1,
      id: 'Materialist',
      rule: materialist(),
    },
    {
      cost: 1,
      id: 'Spiritualist',
      rule: materialist(),
    },
  ].map(Item.withRule(none('Mechanical'))),
  {
    cost: 3,
    id: 'Gestalt',
  },
])
