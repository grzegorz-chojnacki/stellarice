class Ethic extends Item {
  static valueSum = (acc, { value }) => acc + value

  constructor(value, rules) {
    super(rules)
    this.makeEmpireNamePlural()
    this.value = value
  }

  generalRule = () =>
    this.empireList.reduce(Ethic.valueSum, 0) + this.value <= 3
}

const militarist = () =>
  one(
    'Mechanical',
    'FanaticMilitarist',
    'Militarist',
    'FanaticPacifist',
    'Pacifist'
  )

const xenophobe = () =>
  one(
    'Mechanical',
    'FanaticXenophobe',
    'Xenophobe',
    'FanaticXenophile',
    'Xenophile'
  )

const authoritarian = () =>
  one(
    'Mechanical',
    'FanaticAuthoritarian',
    'Authoritarian',
    'FanaticEgalitarian',
    'Egalitarian'
  )

const materialist = () =>
  one(
    'Mechanical',
    'FanaticMaterialist',
    'Materialist',
    'FanaticSpiritualist',
    'Spiritualist'
  )

const gestalt = () => one(ethics.Gestalt)

const ethics = Item.create(Ethic, [
  {
    cost: 2,
    name: 'FanaticMilitarist',
    rule: militarist,
  },
  {
    cost: 2,
    name: 'FanaticPacifist',
    rule: militarist,
  },
  {
    cost: 2,
    name: 'FanaticXenophobe',
    rule: xenophobe,
  },
  {
    cost: 2,
    name: 'FanaticXenophile',
    rule: xenophobe,
  },
  {
    cost: 2,
    name: 'FanaticAuthoritarian',
    rule: authoritarian,
  },
  {
    cost: 2,
    name: 'FanaticEgalitarian',
    rule: authoritarian,
  },
  {
    cost: 2,
    name: 'FanaticMaterialist',
    rule: materialist,
  },
  {
    cost: 2,
    name: 'FanaticSpiritualist',
    rule: materialist,
  },
  {
    cost: 1,
    name: 'Militarist',
    rule: militarist,
  },
  {
    cost: 1,
    name: 'Pacifist',
    rule: militarist,
  },
  {
    cost: 1,
    name: 'Xenophobe',
    rule: xenophobe,
  },
  {
    cost: 1,
    name: 'Xenophile',
    rule: xenophobe,
  },
  {
    cost: 1,
    name: 'Authoritarian',
    rule: authoritarian,
  },
  {
    cost: 1,
    name: 'Egalitarian',
    rule: authoritarian,
  },
  {
    cost: 1,
    name: 'Materialist',
    rule: materialist,
  },
  {
    cost: 1,
    name: 'Spiritualist',
    rule: materialist,
  },
  {
    cost: 3,
    name: 'Gestalt',
    rule: gestalt,
  },
])
