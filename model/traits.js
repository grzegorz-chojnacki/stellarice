class Trait extends Item {
  static costSum = (acc, { cost }) => acc + cost

  constructor(value, rules) {
    super(rules)
    this.makeEmpireNamePlural()
    this.value = value
    this.cost = -value
  }

  originClash = () => this.testClash(traitsOrigin, none()) && this.unmetRules()
  botanicClash = () => this.testClash(traitsBotanic, none(pop.Botanic))
  lithoidClash = () => this.testClash(traitsLithoid, none(pop.Lithoid))
  mechanicClash = () => this.testClash(traitsMechanic, none(pop.Mechanical))
  normalClash = () =>
    this.testClash(traitsNormal, none(pop.Botanic, pop.Lithoid, pop.Biological))

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

const charismatic = () => one(traits.Charismatic, traits.Repugnant)
const communal = () => one(traits.Communal, traits.Solitary)
const conformists = () => one(traits.Conformists, traits.Deviants)
const conservationists = () => one(traits.Conservationist, traits.Wasteful)
const docile = () => one(traits.Docile, traits.Unruly)
const nomadic = () => one(traits.Nomadic, traits.Sedentary)
const learners = () => one(traits.QuickLearners, traits.SlowLearners)
const breeders = () => one(traits.RapidBreeders, traits.SlowBreeders)
const traditional = () => one(traits.Traditional, traits.Quarrelsome)
const trophic = () => one(traits.Phototrophic, traits.Radiotrophic)
const strong = () => one(traits.Strong, traits.VeryStrong, traits.Weak)
const enduring = () => one(traits.Enduring, traits.Venerable, traits.Fleeting)
const adaptive = () =>
  one(traits.Adaptive, traits.ExtremelyAdaptive, traits.Nonadaptive)
const gaseous = () =>
  one(
    traits.GaseousByproducts,
    traits.ScintillatingSkin,
    traits.VolatileExcretions
  )

const traitsOrigin = {
  CloneSoldier: new Trait(0, () => every(origin.CloneArmy, breeders())),
  Survivor: new Trait(0, () => every(origin.PostApocalyptic)),
  VoidDweller: new Trait(0, () => every(origin.VoidDwellers)),
  Necrophages: new Trait(0, () =>
    every(origin.Necrophage, none(traits.Budding))
  ),
  CaveDweller: new Trait(0, () =>
    every(origin.Subterranean, none(traits.Phototrophic))
  ),
}

const traitsBotanic = {
  Radiotrophic: new Trait(2, trophic),
  Phototrophic: new Trait(1, () =>
    every(pop.Botanic, trophic(), none(origin.Subterranean))
  ),
  Budding: new Trait(2, () =>
    every(pop.Botanic, breeders(), none(origin.CloneArmy, origin.Necrophage))
  ),
}

const traitsLithoid = {
  GaseousByproducts: new Trait(2, () => every(pop.Lithoid, gaseous())),
  ScintillatingSkin: new Trait(2, () => every(pop.Lithoid, gaseous())),
  VolatileExcretions: new Trait(2, () => every(pop.Lithoid, gaseous())),
}

const traitsNormal = {
  // Positive traits
  Adaptive: new Trait(2, adaptive),
  ExtremelyAdaptive: new Trait(4, adaptive),
  Agrarian: new Trait(2),
  Charismatic: new Trait(2, charismatic),
  Communal: new Trait(1, communal),
  Conformists: new Trait(2, conformists),
  Conservationist: new Trait(1, conservationists),
  Docile: new Trait(2, docile),
  Enduring: new Trait(1, enduring),
  Venerable: new Trait(4, enduring),
  Industrious: new Trait(2),
  Ingenious: new Trait(2),
  Intelligent: new Trait(2),
  NaturalEngineers: new Trait(1),
  NaturalPhysicists: new Trait(1),
  NaturalSociologists: new Trait(1),
  Nomadic: new Trait(1, nomadic),
  QuickLearners: new Trait(1, learners),
  RapidBreeders: new Trait(2, breeders),
  Resilient: new Trait(1),
  Strong: new Trait(1, strong),
  VeryStrong: new Trait(3, strong),
  Talented: new Trait(1),
  Thrifty: new Trait(2),
  Traditional: new Trait(1, traditional),

  // Negative traits
  Nonadaptive: new Trait(-2, adaptive),
  Repugnant: new Trait(-2, charismatic),
  Solitary: new Trait(-2, communal),
  Deviants: new Trait(-1, conformists),
  Wasteful: new Trait(-1, conservationists),
  Unruly: new Trait(-2, docile),
  Fleeting: new Trait(-1, enduring),
  Sedentary: new Trait(-1, nomadic),
  SlowLearners: new Trait(-1, learners),
  SlowBreeders: new Trait(-2, breeders),
  Weak: new Trait(-1, strong),
  Quarrelsome: new Trait(-1, traditional),
  Decadent: new Trait(-1),
}

const traitsMechanic = {}

const traits = nameItems({
  ...traitsOrigin,
  ...traitsBotanic,
  ...traitsLithoid,
  ...traitsNormal,
  ...traitsMechanic,
})
