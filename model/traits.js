// @ts-check
/// <reference path="../paths.js" />

class Trait extends Item {
  /** @type {(acc: number, o: { cost: number }) => number } */
  static costSum = (acc, { cost }) => acc - cost

  empireList = empire.traits

  get label() {
    return `[${this.cost.toString().padStart(2)}] ${this.name}`
  }

  isAvailable = () => this.empireList.length < 5
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
const scientist = one(
  'NaturalEngineers',
  'NaturalPhysicists',
  'NaturalSociologists'
)

// Mechanical
const bulky = one('Bulky', 'DoubleJointed')
const maintenance = one('HighMaintenance', 'Durable')
const uncanny = one('Uncanny', 'EmotionEmulators')
const repurposed = one('RepurposedHardware', 'LearningAlgorithms')
const custom = one('CustomMade', 'MassProduced')
const luxurious = one('Luxurious', 'Recycled')
const bandwidth = one('HighBandwidth', 'StreamlinedProtocols')

const traitsBotanic = [
  {
    id: 'Radiotrophic',
    cost: 2,
    rule: every(trophic, some('Botanic', 'Lithoid')),
  },
  {
    id: 'Phototrophic',
    cost: 1,
    rule: every(trophic, 'Botanic', none('Subterranean')),
  },
  {
    id: 'Budding',
    cost: 2,
    rule: every(breeders, 'Botanic', none('CloneArmy', 'Necrophage')),
  },
].map(item => new Trait(item))

const traitsLithoid = [
  {
    id: 'GaseousByproducts',
    cost: 2,
    rule: gaseous,
  },
  {
    id: 'ScintillatingSkin',
    cost: 2,
    rule: gaseous,
  },
  {
    id: 'VolatileExcretions',
    cost: 2,
    rule: gaseous,
  },
  {
    id: 'Crystallization',
    cost: 2,
  },
]
  .map(item => new Trait(item))
  .map(Item.withRule(every('Lithoid')))

const traitsNormal = [
  // Positive traits
  {
    cost: 2,
    id: 'Adaptive',
    rule: adaptive,
  },
  {
    cost: 4,
    id: 'ExtremelyAdaptive',
    rule: adaptive,
  },
  {
    cost: 2,
    id: 'Agrarian',
  },
  {
    cost: 2,
    id: 'Charismatic',
    rule: charismatic,
  },
  {
    cost: 1,
    id: 'Communal',
    rule: communal,
  },
  {
    cost: 2,
    id: 'Conformists',
    rule: conformists,
  },
  {
    cost: 1,
    id: 'Conservationist',
    rule: conservationists,
  },
  {
    cost: 2,
    id: 'Docile',
    rule: docile,
  },
  {
    cost: 1,
    id: 'Enduring',
    rule: enduring,
  },
  {
    cost: 4,
    id: 'Venerable',
    rule: enduring,
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
    rule: scientist,
  },
  {
    cost: 1,
    id: 'NaturalPhysicists',
    rule: scientist,
  },
  {
    cost: 1,
    id: 'NaturalSociologists',
    rule: scientist,
  },
  {
    cost: 1,
    id: 'Nomadic',
    rule: nomadic,
  },
  {
    cost: 1,
    id: 'QuickLearners',
    rule: learners,
  },
  {
    cost: 2,
    id: 'RapidBreeders',
    rule: breeders,
  },
  {
    cost: 1,
    id: 'Resilient',
  },
  {
    cost: 1,
    id: 'Strong',
    rule: strong,
  },
  {
    cost: 3,
    id: 'VeryStrong',
    rule: strong,
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
    rule: traditional,
  },

  // Negative traits
  {
    cost: -2,
    id: 'Nonadaptive',
    rule: adaptive,
  },
  {
    cost: -2,
    id: 'Repugnant',
    rule: charismatic,
  },
  {
    cost: -2,
    id: 'Solitary',
    rule: communal,
  },
  {
    cost: -1,
    id: 'Deviants',
    rule: conformists,
  },
  {
    cost: -1,
    id: 'Wasteful',
    rule: conservationists,
  },
  {
    cost: -2,
    id: 'Unruly',
    rule: docile,
  },
  {
    cost: -1,
    id: 'Fleeting',
    rule: enduring,
  },
  {
    cost: -1,
    id: 'Sedentary',
    rule: nomadic,
  },
  {
    cost: -1,
    id: 'SlowLearners',
    rule: learners,
  },
  {
    cost: -2,
    id: 'SlowBreeders',
    rule: breeders,
  },
  {
    cost: -1,
    id: 'Weak',
    rule: strong,
  },
  {
    cost: -1,
    id: 'Quarrelsome',
    rule: traditional,
  },
  {
    cost: -1,
    id: 'Decadent',
  },
]
  .map(item => new Trait(item))
  .map(Item.withRule(none('Mechanical')))

const traitsMechanic = [
  // Positive traits
  {
    cost: 2,
    id: 'DomesticProtocols',
  },
  {
    cost: 1,
    id: 'DoubleJointed',
    rule: bulky,
  },
  {
    cost: 1,
    id: 'Durable',
    rule: maintenance,
  },
  {
    cost: 3,
    id: 'EfficientProcessors',
  },
  {
    cost: 1,
    id: 'EmotionEmulators',
    rule: uncanny,
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
    rule: repurposed,
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
    rule: custom,
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
    rule: luxurious,
  },
  {
    cost: 2,
    id: 'StreamlinedProtocols',
    rule: bandwidth,
  },
  {
    cost: 2,
    id: 'Superconductiv',
  },

  // Negative traits
  {
    cost: -1,
    id: 'Bulky',
    rule: bulky,
  },
  {
    cost: -1,
    id: 'HighMaintenance',
    rule: maintenance,
  },
  {
    cost: -1,
    id: 'Uncanny',
    rule: uncanny,
  },
  {
    cost: -1,
    id: 'RepurposedHardware',
    rule: repurposed,
  },
  {
    cost: -1,
    id: 'CustomMade',
    rule: custom,
  },
  {
    cost: -1,
    id: 'Luxurious',
    rule: luxurious,
  },
  {
    cost: -1,
    id: 'HighBandwidth',
    rule: bandwidth,
  },
]
  .map(item => new Trait(item))
  .map(Item.withRule(every('Mechanical')))

const traitsToxoid = [
  {
    id: 'Incubators',
    cost: 2,
    rule: none(breeders, 'Budding'),
  },
  {
    id: 'Noxious',
    cost: 1,
  },
  {
    id: 'InorganicBreath',
    cost: 3,
  },
]
  .map(item => new Trait(item))
  .map(Item.withRule(none('Mechanical')))

const traitsOverturned = [
  {
    id: 'AugmentedIntelligence',
    cost: 1,
  },
  {
    id: 'CraftedSmiles',
    cost: 1,
  },
  {
    id: 'DedicatedMiner',
    cost: 1,
  },
  {
    id: 'ExpressedTradition',
    cost: 1,
  },
  {
    id: 'FarmAppendages',
    cost: 1,
  },
  {
    id: 'GeneMentorship',
    cost: 1,
  },
  {
    id: 'JuicedPower',
    cost: 1,
  },
  {
    id: 'LowMaintenance',
    cost: 1,
  },
  {
    id: 'SplicedAdaptability',
    cost: 1,
  },
  {
    id: 'TechnicalTalent',
    cost: 1,
  },
  {
    id: 'ElevatedSynapses',
    cost: 2,
  },
  {
    id: 'PrePlannedGrowth',
    cost: 2,
  },
  {
    id: 'ExcessiveEndurance',
    cost: 2,
  },
]
  .map(item => new Trait(item))
  .map(Item.withRule(every('Overturned')))

const traits = [
  ...traitsBotanic,
  ...traitsLithoid,
  ...traitsNormal,
  ...traitsMechanic,
  ...traitsToxoid,
  ...traitsOverturned,
]
