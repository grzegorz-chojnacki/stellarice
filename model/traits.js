// @ts-check
/// <reference path="../paths.js" />

class Trait extends Item {
  /** @type {(acc: number, o: { cost: number }) => number } */
  static costSum = (acc, { cost }) => acc - cost

  empireList = empire.traits

  get label() {
    return `[${this.cost.toString().padStart(2)}] ${this.id}`
  }

  isAvailable = () => this.empireList.length < 5
}

// Source: https://stellaris.paradoxwikis.com/Traits

// Biological
const charismatic = one('Charismatic', 'Repugnant')
const communal = one('Communal', 'Solitary')
const conformists = one('Conformists', 'Deviants')
const conservationist = one('Conservationist', 'Wasteful')
const docile = one('Docile', 'Unruly')
const nomadic = one('Nomadic', 'Sedentary')
const learners = one('Quick Learners', 'Slow Learners')
const breeders = one('Rapid Breeders', 'Slow Breeders')
const traditional = one('Traditional', 'Quarrelsome')
const strong = one('Strong', 'Very Strong', 'Weak')
const enduring = one('Enduring', 'Venerable', 'Fleeting')
const adaptive = one('Adaptive', 'Extremely Adaptive', 'Nonadaptive')
const scientist = one(
  'Natural Engineers',
  'Natural Physicists',
  'Natural Sociologists'
)

// Special
const trophic = one('Phototrophic', 'Radiotrophic')
const gaseous = one(
  'Gaseous Byproducts',
  'Scintillating Skin',
  'Volatile Excretions'
)

// Mechanical
const bulky = one('Bulky', 'Double Jointed')
const maintenance = one('High Maintenance', 'Durable')
const uncanny = one('Uncanny', 'Emotion Emulators')
const repurposed = one('Repurposed Hardware', 'Learning Algorithms')
const custom = one('Custom-Made', 'Mass-Produced')
const luxurious = one('Luxurious', 'Recycled')
const bandwidth = one('High Bandwidth', 'Streamlined Protocols')

const traitsNormal = [
  // Positive traits
  {
    cost: 2,
    id: 'Adaptive',
    rule: adaptive,
  },
  {
    cost: 4,
    id: 'Extremely Adaptive',
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
    rule: conservationist,
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
    id: 'Natural Engineers',
    rule: scientist,
  },
  {
    cost: 1,
    id: 'Natural Physicists',
    rule: scientist,
  },
  {
    cost: 1,
    id: 'Natural Sociologists',
    rule: scientist,
  },
  {
    cost: 1,
    id: 'Nomadic',
    rule: nomadic,
  },
  {
    cost: 1,
    id: 'Quick Learners',
    rule: learners,
  },
  {
    cost: 2,
    id: 'Rapid Breeders',
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
    id: 'Very Strong',
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
    cost: -1,
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
    rule: conservationist,
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
    id: 'Slow Learners',
    rule: learners,
  },
  {
    cost: -2,
    id: 'Slow Breeders',
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


const traitsBotanic = [
  {
    id: 'Phototrophic',
    cost: 1,
    rule: every(trophic, 'Botanic', none('Subterranean', 'Void Dwellers')),
  },
  {
    id: 'Radiotrophic',
    cost: 2,
    rule: every(trophic, some('Botanic', 'Lithoid'), none('Void Dwellers')),
  },
  {
    id: 'Budding',
    cost: 2,
    rule: every(breeders, 'Botanic', none('Clone Army', 'Necrophage')),
  },
].map(item => new Trait(item))


const traitsLithoid = [
  {
    id: 'Gaseous Byproducts',
    cost: 2,
    rule: gaseous,
  },
  {
    id: 'Scintillating Skin',
    cost: 2,
    rule: gaseous,
  },
  {
    id: 'Volatile Excretions',
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
    id: 'Inorganic Breath',
    cost: 3,
  },
]
  .map(item => new Trait(item))
  .map(Item.withRule(none('Mechanical')))

const traitsOverturned = [
  {
    id: 'Augmented Intelligence',
    cost: 1,
  },
  {
    id: 'Crafted Smiles',
    cost: 1,
  },
  {
    id: 'Dedicated Miner',
    cost: 1,
  },
  {
    id: 'Expressed Tradition',
    cost: 1,
  },
  {
    id: 'Farm Appendages',
    cost: 1,
  },
  {
    id: 'Gene Mentorship',
    cost: 1,
  },
  {
    id: 'Juiced Power',
    cost: 1,
  },
  {
    id: 'Low Maintenance',
    cost: 1,
  },
  {
    id: 'Spliced Adaptability',
    cost: 1,
  },
  {
    id: 'Technical Talent',
    cost: 1,
  },
  {
    id: 'Elevated Synapses',
    cost: 2,
  },
  {
    id: 'Pre-Planned Growth',
    cost: 2,
  },
  {
    id: 'Excessive Endurance',
    cost: 3,
  },
]
  .map(item => new Trait(item))
  .map(Item.withRule(every('Overturned')))

const traitsMechanic = [
  // Positive traits
  {
    cost: 2,
    id: 'Domestic Protocols',
  },
  {
    cost: 1,
    id: 'Double Jointed',
    rule: bulky,
  },
  {
    cost: 1,
    id: 'Durable',
    rule: maintenance,
  },
  {
    cost: 3,
    id: 'Efficient Processors',
  },
  {
    cost: 1,
    id: 'Emotion Emulators',
    rule: uncanny,
  },
  {
    cost: 2,
    id: 'Enhanced Memory',
  },
  {
    cost: 2,
    id: 'Harvesters',
  },
  {
    cost: 1,
    id: 'Learning Algorithms',
    rule: repurposed,
  },
  {
    cost: 2,
    id: 'Logic Engines',
  },
  {
    cost: 2,
    id: 'Loyalty Circuits',
  },
  {
    cost: 1,
    id: 'Mass-Produced',
    rule: custom,
  },
  {
    cost: 2,
    id: 'Power Drills',
  },
  {
    cost: 1,
    id: 'Propaganda Machines',
  },
  {
    cost: 2,
    id: 'Recycled',
    rule: luxurious,
  },
  {
    cost: 2,
    id: 'Streamlined Protocols',
    rule: bandwidth,
  },
  {
    cost: 2,
    id: 'Superconductive',
  },
  {
    cost: 2,
    id: 'Trading Algorithms',
  },

  // Negative traits
  {
    cost: -1,
    id: 'Bulky',
    rule: bulky,
  },
  {
    cost: -1,
    id: 'High Maintenance',
    rule: maintenance,
  },
  {
    cost: -1,
    id: 'Uncanny',
    rule: uncanny,
  },
  {
    cost: -1,
    id: 'Repurposed Hardware',
    rule: repurposed,
  },
  {
    cost: -1,
    id: 'Custom-Made',
    rule: custom,
  },
  {
    cost: -2,
    id: 'Luxurious',
    rule: luxurious,
  },
  {
    cost: -2,
    id: 'High Bandwidth',
    rule: bandwidth,
  },
]
  .map(item => new Trait(item))
  .map(Item.withRule(every('Mechanical')))

const traits = [
  ...traitsNormal,
  ...traitsBotanic,
  ...traitsLithoid,
  ...traitsToxoid,
  ...traitsOverturned,
  ...traitsMechanic,
]
