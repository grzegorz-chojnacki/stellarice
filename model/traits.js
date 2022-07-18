class Trait extends Item {
  static costSum = (acc, { cost }) => acc + cost

  constructor(value, rules) {
    super(rules)
    this.makeEmpireNamePlural()
    this.value = value
    this.cost = -value
  }

  originClash = () => this.testClash(traitsOrigin, none()) && this.unmetRules()
  botanicClash = () => this.testClash(traitsBotanic, none('Botanic'))
  lithoidClash = () => this.testClash(traitsLithoid, none('Lithoid'))
  mechanicClash = () => this.testClash(traitsMechanic, none('Mechanical'))
  normalClash = () =>
    this.testClash(traitsNormal, none('Botanic', 'Lithoid', 'Biological'))

  clashes = () =>
    this.normalClash() ||
    this.botanicClash() ||
    this.lithoidClash() ||
    this.mechanicClash()

  hidden = () => !this.checked() && (this.clashes() || this.originClash())

  invalid = () => {
    if (this.unmetRules()) return true
    const sum = this.empireList.reduce(Trait.costSum, 2)
    if (sum < 0 && this.value > 0) return true
    return false
  }

  generalRule = () =>
    this.empireList.length < 5 &&
    this.empireList.reduce(Trait.costSum, 2) + this.cost >= 0
}

// Biological
const charismatic = one('Charismatic', 'Repugnant')
const communal = one('Communal', 'Solitary')
const conformists = one('Conformists', 'Deviants')
const conservationists = one('Conservationist', 'Wasteful')
const docile = one('Docile', 'Unruly')
const nomadic = one('Nomadic', 'Sedentary')
const learners = one('QuickLearners', 'SlowLearners')
const breeders = one('RapidBreeders', 'SlowBreeders')
const traditional = one('Traditional', 'Quarrelsome')
const trophic = one('Phototrophic', 'Radiotrophic')
const strong = one('Strong', 'VeryStrong', 'Weak')
const enduring = one('Enduring', 'Venerable', 'Fleeting')
const adaptive = one('Adaptive', 'ExtremelyAdaptive', 'Nonadaptive')
const gaseous = one(
  'GaseousByproducts',
  'ScintillatingSkin',
  'VolatileExcretions'
)

// Mechanical
const bulky = one('Bulky', 'DoubleJointed')
const maintenance = one('HighMaintenance', 'Durable')
const uncanny = one('Uncanny', 'EmotionEmulators')
const repurposed = one('RepurposedHardware', 'LearningAlgorithms')
const custom = one('CustomMade', 'MassProduced')
const luxurious = one('Luxurious', 'Recycled')
const bandwith = one('HighBandwidth', 'StreamlinedProtocols')

const traitsOrigin = [
  {
    name: 'CloneSoldier',
    cost: 0,
    rule: every('CloneArmy', breeders()),
  },
  {
    name: 'Survivor',
    cost: 0,
    rule: every('PostApocalyptic'),
  },
  {
    name: 'VoidDweller',
    cost: 0,
    rule: every('VoidDwellers'),
  },
  {
    name: 'Necrophages',
    cost: 0,
    rule: every('Necrophage', none('Budding')),
  },
  {
    name: 'CaveDweller',
    cost: 0,
    rule: every('Subterranean', none('Phototrophic')),
  },
]

const traitsBotanic = [
  {
    name: 'Radiotrophic',
    cost: 2,
    rule: trophic,
  },
  {
    name: 'Phototrophic',
    cost: 1,
    rule: every('Botanic', trophic, none('Subterranean')),
  },
  {
    name: 'Budding',
    cost: 2,
    rule: every('Botanic', breeders, none('CloneArmy', 'Necrophage')),
  },
]

const traitsLithoid = [
  {
    name: 'GaseousByproducts',
    cost: 2,
    rule: every('Lithoid', gaseous),
  },
  {
    name: 'ScintillatingSkin',
    cost: 2,
    rule: every('Lithoid', gaseous),
  },
  {
    name: 'VolatileExcretions',
    cost: 2,
    rule: every('Lithoid', gaseous),
  },
]

const traitsNormal = [
  // Positive traits
  {
    cost: 2,
    name: 'Adaptive',
    rule: adaptive,
  },
  {
    cost: 4,
    name: 'ExtremelyAdaptive',
    rule: adaptive,
  },
  {
    cost: 2,
    name: 'Agrarian',
  },
  {
    cost: 2,
    name: 'Charismatic',
    rule: charismatic,
  },
  {
    cost: 1,
    name: 'Communal',
    rule: communal,
  },
  {
    cost: 2,
    name: 'Conformists',
    rule: conformists,
  },
  {
    cost: 1,
    name: 'Conservationist',
    rule: conservationists,
  },
  {
    cost: 2,
    name: 'Docile',
    rule: docile,
  },
  {
    cost: 1,
    name: 'Enduring',
    rule: enduring,
  },
  {
    cost: 4,
    name: 'Venerable',
    rule: enduring,
  },
  {
    cost: 2,
    name: 'Industrious',
  },
  {
    cost: 2,
    name: 'Ingenious',
  },
  {
    cost: 2,
    name: 'Intelligent',
  },
  {
    cost: 1,
    name: 'NaturalEngineers',
  },
  {
    cost: 1,
    name: 'NaturalPhysicists',
  },
  {
    cost: 1,
    name: 'NaturalSociologists',
  },
  {
    cost: 1,
    name: 'Nomadic',
    rule: nomadic,
  },
  {
    cost: 1,
    name: 'QuickLearners',
    rule: learners,
  },
  {
    cost: 2,
    name: 'RapidBreeders',
    rule: breeders,
  },
  {
    cost: 1,
    name: 'Resilient',
  },
  {
    cost: 1,
    name: 'Strong',
    rule: strong,
  },
  {
    cost: 3,
    name: 'VeryStrong',
    rule: strong,
  },
  {
    cost: 1,
    name: 'Talented',
  },
  {
    cost: 2,
    name: 'Thrifty',
  },
  {
    cost: 1,
    name: 'Traditional',
    rule: traditional,
  },

  // Negative traits
  {
    cost: -2,
    name: 'Nonadaptive',
    rule: adaptive,
  },
  {
    cost: -2,
    name: 'Repugnant',
    rule: charismatic,
  },
  {
    cost: -2,
    name: 'Solitary',
    rule: communal,
  },
  {
    cost: -1,
    name: 'Deviants',
    rule: conformists,
  },
  {
    cost: -1,
    name: 'Wasteful',
    rule: conservationists,
  },
  {
    cost: -2,
    name: 'Unruly',
    rule: docile,
  },
  {
    cost: -1,
    name: 'Fleeting',
    rule: enduring,
  },
  {
    cost: -1,
    name: 'Sedentary',
    rule: nomadic,
  },
  {
    cost: -1,
    name: 'SlowLearners',
    rule: learners,
  },
  {
    cost: -2,
    name: 'SlowBreeders',
    rule: breeders,
  },
  {
    cost: -1,
    name: 'Weak',
    rule: strong,
  },
  {
    cost: -1,
    name: 'Quarrelsome',
    rule: traditional,
  },
  {
    cost: -1,
    name: 'Decadent',
  },
]

const traitsMechanic = [
  // Positive traits
  {
    cost: 2,
    name: 'DomesticProtocols',
  },
  {
    cost: 1,
    name: 'DoubleJointed',
    rule: bulky,
  },
  {
    cost: 1,
    name: 'Durable',
    rule: maintenance,
  },
  {
    cost: 3,
    name: 'EfficientProcessors',
  },
  {
    cost: 1,
    name: 'EmotionEmulators',
    rule: uncanny,
  },
  {
    cost: 2,
    name: 'EnhancedMemory',
  },
  {
    cost: 2,
    name: 'Harvesters',
  },
  {
    cost: 1,
    name: 'LearningAlgorithms',
    rule: repurposed,
  },
  {
    cost: 2,
    name: 'LogicEngines',
  },
  {
    cost: 2,
    name: 'LoyaltyCircuits',
  },
  {
    cost: 1,
    name: 'MassProduced',
    rule: custom,
  },
  {
    cost: 2,
    name: 'PowerDrills',
  },
  {
    cost: 1,
    name: 'PropagandaMachines',
  },
  {
    cost: 2,
    name: 'Recycled',
    rule: luxurious,
  },
  {
    cost: 2,
    name: 'StreamlinedProtocols',
    rule: bandwith,
  },
  {
    cost: 2,
    name: 'Superconductiv',
  },

  // Negative traits
  {
    cost: -1,
    name: 'Bulky',
    rule: bulky,
  },
  {
    cost: -1,
    name: 'HighMaintenance',
    rule: maintenance,
  },
  {
    cost: -1,
    name: 'Uncanny',
    rule: uncanny,
  },
  {
    cost: -1,
    name: 'RepurposedHardware',
    rule: repurposed,
  },
  {
    cost: -1,
    name: 'CustomMade',
    rule: custom,
  },
  {
    cost: -1,
    name: 'Luxurious',
    rule: luxurious,
  },
  {
    cost: -1,
    name: 'HighBandwidth',
    rule: bandwith,
  },
]

const traits = Item.create(Trait, [
  ...traitsOrigin,
  ...traitsBotanic,
  ...traitsLithoid,
  ...traitsNormal,
  ...traitsMechanic,
])
