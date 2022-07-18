class Trait extends Item {
  static costSum = (acc, { cost }) => acc - cost

  constructor(item) {
    super(item)
    this.makeEmpireNamePlural()
    this.cost = item.cost
  }

  invalid = () => {
    if (this.unmetRule()) return true
    const sum = this.empireList.reduce(Trait.costSum, 2)
    if (sum < 0 && this.cost >= 0) return true
    return false
  }

  generalRule = () =>
    this.empireList.length < 5 &&
    this.empireList.reduce(Trait.costSum, 2) - this.cost >= 0
}

// Biological
const charismatic = () => none('Charismatic', 'Repugnant')
const communal = () => none('Communal', 'Solitary')
const conformists = () => none('Conformists', 'Deviants')
const conservationists = () => none('Conservationist', 'Wasteful')
const docile = () => none('Docile', 'Unruly')
const nomadic = () => none('Nomadic', 'Sedentary')
const learners = () => none('QuickLearners', 'SlowLearners')
const breeders = () => none('RapidBreeders', 'SlowBreeders')
const traditional = () => none('Traditional', 'Quarrelsome')
const trophic = () => none('Phototrophic', 'Radiotrophic')
const strong = () => none('Strong', 'VeryStrong', 'Weak')
const enduring = () => none('Enduring', 'Venerable', 'Fleeting')
const adaptive = () => none('Adaptive', 'ExtremelyAdaptive', 'Nonadaptive')
const gaseous = () =>
  none('GaseousByproducts', 'ScintillatingSkin', 'VolatileExcretions')

// Mechanical
const bulky = () => none('Bulky', 'DoubleJointed')
const maintenance = () => none('HighMaintenance', 'Durable')
const uncanny = () => none('Uncanny', 'EmotionEmulators')
const repurposed = () => none('RepurposedHardware', 'LearningAlgorithms')
const custom = () => none('CustomMade', 'MassProduced')
const luxurious = () => none('Luxurious', 'Recycled')
const bandwidth = () => none('HighBandwidth', 'StreamlinedProtocols')

const traitsOrigin = Item.create(Trait, [
  {
    id: 'CloneSoldier',
    cost: 0,
    rule: every('CloneArmy', breeders()),
  },
  {
    id: 'Survivor',
    cost: 0,
    rule: every('PostApocalyptic'),
  },
  {
    id: 'VoidDweller',
    cost: 0,
    rule: every('VoidDwellers'),
  },
  {
    id: 'Necrophages',
    cost: 0,
    rule: every('Necrophage', none('Budding')),
  },
  {
    id: 'CaveDweller',
    cost: 0,
    rule: every('Subterranean', none('Phototrophic')),
  },
])

const traitsBotanic = Item.create(Trait, [
  {
    id: 'Radiotrophic',
    cost: 2,
    rule: trophic(),
  },
  {
    id: 'Phototrophic',
    cost: 1,
    rule: every(trophic(), none('Subterranean')),
  },
  {
    id: 'Budding',
    cost: 2,
    rule: every(breeders(), none('CloneArmy', 'Necrophage')),
  },
]).map(Item.withRule(every('Botanic')))

const traitsLithoid = Item.create(Trait, [
  {
    id: 'GaseousByproducts',
    cost: 2,
    rule: gaseous(),
  },
  {
    id: 'ScintillatingSkin',
    cost: 2,
    rule: gaseous(),
  },
  {
    id: 'VolatileExcretions',
    cost: 2,
    rule: gaseous(),
  },
]).map(Item.withRule(every('Lithoid')))

const traitsNormal = Item.create(Trait, [
  // Positive traits
  {
    cost: 2,
    id: 'Adaptive',
    rule: adaptive(),
  },
  {
    cost: 4,
    id: 'ExtremelyAdaptive',
    rule: adaptive(),
  },
  {
    cost: 2,
    id: 'Agrarian',
  },
  {
    cost: 2,
    id: 'Charismatic',
    rule: charismatic(),
  },
  {
    cost: 1,
    id: 'Communal',
    rule: communal(),
  },
  {
    cost: 2,
    id: 'Conformists',
    rule: conformists(),
  },
  {
    cost: 1,
    id: 'Conservationist',
    rule: conservationists(),
  },
  {
    cost: 2,
    id: 'Docile',
    rule: docile(),
  },
  {
    cost: 1,
    id: 'Enduring',
    rule: enduring(),
  },
  {
    cost: 4,
    id: 'Venerable',
    rule: enduring(),
  },
  {
    cost: 2,
    id: 'Industrious',
  },
  {
    cost: 2,
    id: 'Ingenious',
  },
  {
    cost: 2,
    id: 'Intelligent',
  },
  {
    cost: 1,
    id: 'NaturalEngineers',
  },
  {
    cost: 1,
    id: 'NaturalPhysicists',
  },
  {
    cost: 1,
    id: 'NaturalSociologists',
  },
  {
    cost: 1,
    id: 'Nomadic',
    rule: nomadic(),
  },
  {
    cost: 1,
    id: 'QuickLearners',
    rule: learners(),
  },
  {
    cost: 2,
    id: 'RapidBreeders',
    rule: breeders(),
  },
  {
    cost: 1,
    id: 'Resilient',
  },
  {
    cost: 1,
    id: 'Strong',
    rule: strong(),
  },
  {
    cost: 3,
    id: 'VeryStrong',
    rule: strong(),
  },
  {
    cost: 1,
    id: 'Talented',
  },
  {
    cost: 2,
    id: 'Thrifty',
  },
  {
    cost: 1,
    id: 'Traditional',
    rule: traditional(),
  },

  // Negative traits
  {
    cost: -2,
    id: 'Nonadaptive',
    rule: adaptive(),
  },
  {
    cost: -2,
    id: 'Repugnant',
    rule: charismatic(),
  },
  {
    cost: -2,
    id: 'Solitary',
    rule: communal(),
  },
  {
    cost: -1,
    id: 'Deviants',
    rule: conformists(),
  },
  {
    cost: -1,
    id: 'Wasteful',
    rule: conservationists(),
  },
  {
    cost: -2,
    id: 'Unruly',
    rule: docile(),
  },
  {
    cost: -1,
    id: 'Fleeting',
    rule: enduring(),
  },
  {
    cost: -1,
    id: 'Sedentary',
    rule: nomadic(),
  },
  {
    cost: -1,
    id: 'SlowLearners',
    rule: learners(),
  },
  {
    cost: -2,
    id: 'SlowBreeders',
    rule: breeders(),
  },
  {
    cost: -1,
    id: 'Weak',
    rule: strong(),
  },
  {
    cost: -1,
    id: 'Quarrelsome',
    rule: traditional(),
  },
  {
    cost: -1,
    id: 'Decadent',
  },
]).map(Item.withRule(some('Biological', 'Lithoid', 'Botanic')))

const traitsMechanic = Item.create(Trait, [
  // Positive traits
  {
    cost: 2,
    id: 'DomesticProtocols',
  },
  {
    cost: 1,
    id: 'DoubleJointed',
    rule: bulky(),
  },
  {
    cost: 1,
    id: 'Durable',
    rule: maintenance(),
  },
  {
    cost: 3,
    id: 'EfficientProcessors',
  },
  {
    cost: 1,
    id: 'EmotionEmulators',
    rule: uncanny(),
  },
  {
    cost: 2,
    id: 'EnhancedMemory',
  },
  {
    cost: 2,
    id: 'Harvesters',
  },
  {
    cost: 1,
    id: 'LearningAlgorithms',
    rule: repurposed(),
  },
  {
    cost: 2,
    id: 'LogicEngines',
  },
  {
    cost: 2,
    id: 'LoyaltyCircuits',
  },
  {
    cost: 1,
    id: 'MassProduced',
    rule: custom(),
  },
  {
    cost: 2,
    id: 'PowerDrills',
  },
  {
    cost: 1,
    id: 'PropagandaMachines',
  },
  {
    cost: 2,
    id: 'Recycled',
    rule: luxurious(),
  },
  {
    cost: 2,
    id: 'StreamlinedProtocols',
    rule: bandwidth(),
  },
  {
    cost: 2,
    id: 'Superconductiv',
  },

  // Negative traits
  {
    cost: -1,
    id: 'Bulky',
    rule: bulky(),
  },
  {
    cost: -1,
    id: 'HighMaintenance',
    rule: maintenance(),
  },
  {
    cost: -1,
    id: 'Uncanny',
    rule: uncanny(),
  },
  {
    cost: -1,
    id: 'RepurposedHardware',
    rule: repurposed(),
  },
  {
    cost: -1,
    id: 'CustomMade',
    rule: custom(),
  },
  {
    cost: -1,
    id: 'Luxurious',
    rule: luxurious(),
  },
  {
    cost: -1,
    id: 'HighBandwidth',
    rule: bandwidth(),
  },
]).map(Item.withRule(every('Mechanical')))

const traits = [
  ...traitsOrigin,
  ...traitsBotanic,
  ...traitsLithoid,
  ...traitsNormal.filter(x => x.cost > 0),
  ...traitsMechanic.filter(x => x.cost > 0),
  ...traitsNormal.filter(x => x.cost < 0),
  ...traitsMechanic.filter(x => x.cost < 0),
]
