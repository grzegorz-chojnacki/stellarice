class Trait extends Item {
  static costSum = (acc, { cost }) => acc + cost

  constructor(value, kind, rules) {
    super(rules)
    this.empireName += 's'
    this.value = value
    this.cost = -value
    this.kind = kind
  }

  origin = () => Object.values(traitsOrigin).includes(this)

  originClash = () => (this.origin() && !this.rules())

  normalClash = () => (Object.values(traitsNormal).includes(this)
      && none(pop.Biological, pop.Botanic, pop.Lithoid))

  botanicClash = () => (Object.values(traitsBotanic).includes(this)
      && none(pop.Botanic))

  lithoidClash = () => (Object.values(traitsLithoid).includes(this)
      && none(pop.Lithoid))

  clashes = () => this.normalClash() || this.botanicClash() || this.lithoidClash()

  hidden = () => !this.checked() && (this.clashes() || this.originClash())

  invalid = () => {
    if (!(this.rules()) || this.clashes()) return true
    const sum = this.empireList.reduce(Trait.costSum, 2)
    if (sum < 0 && this.value > 0) return true
    return false
  }

  genericConstraint = () => {
    return (this.empireList.length < 5)
     && !this.empireList.some(trait => trait.kind && trait.kind === this.kind)
     && this.empireList.reduce(Trait.costSum, 2) + this.cost >= 0}
}

const adaptive         = Symbol('adaptive')
const charismatic      = Symbol('charismatic')
const communal         = Symbol('communal')
const conformists      = Symbol('conformists')
const conservationists = Symbol('conservationists')
const docile           = Symbol('docile')
const enduring         = Symbol('enduring')
const nomadic          = Symbol('nomadic')
const learners         = Symbol('learners')
const breeders         = Symbol('breeders')
const strong           = Symbol('strong')
const traditional      = Symbol('traditional')
const trophic          = Symbol('botanic')
const gaseous          = Symbol('gaseous')

const traitsOrigin = {
  CloneSoldier: new Trait(0, breeders, () => every(origin.CloneArmy)),
  Survivor:     new Trait(0, null, () => every(origin.PostApocalyptic)),
  VoidDweller:  new Trait(0, null, () => every(origin.VoidDwellers)),
  Necrophages:  new Trait(0, null, () => every(
    origin.Necrophage,
    none(traits.Budding),
  )),
  CaveDweller:  new Trait(0, null, () => every(
    origin.Subterranean,
    none(traits.Phototrophic),
  )),
}

const traitsBotanic = {
  Radiotrophic: new Trait(2, trophic),
  Phototrophic: new Trait(1, trophic, () => every(
    pop.Botanic,
    none(origin.Subterranean)
  )),
  Budding:      new Trait(2, breeders, () => every(
    pop.Botanic,
    none(origin.CloneArmy, origin.Necrophage)
  )),
}

const traitsLithoid = {
  GaseousByproducts:  new Trait(2, gaseous),
  ScintillatingSkin:  new Trait(2, gaseous),
  VolatileExcretions: new Trait(2, gaseous),
}

const traitsNormal = {
  Adaptive:            new Trait( 2, adaptive),
  ExtremelyAdaptive:   new Trait( 4, adaptive),
  AgrarianIdyll:       new Trait( 2, null),
  Charismatic:         new Trait( 2, charismatic),
  Communal:            new Trait( 1, communal),
  Conformists:         new Trait( 2, conformists),
  Conservationist:     new Trait( 1, conservationists),
  Docile:              new Trait( 2, docile),
  Enduring:            new Trait( 1, enduring),
  Venerable:           new Trait( 4, enduring),
  Industrious:         new Trait( 2, null),
  Ingenious:           new Trait( 2, null),
  Intelligent:         new Trait( 2, null),
  NaturalEngineers:    new Trait( 1, null),
  NaturalPhysicists:   new Trait( 1, null),
  NaturalSociologists: new Trait( 1, null),
  Nomadic:             new Trait( 1, nomadic),
  QuickLearners:       new Trait( 1, learners),
  RapidBreeders:       new Trait( 2, breeders),
  Resilient:           new Trait( 1, null),
  Strong:              new Trait( 1, strong),
  VeryStrong:          new Trait( 3, strong),
  Talented:            new Trait( 1, null),
  Thrifty:             new Trait( 2, null),
  Traditional:         new Trait( 1, traditional),

  Nonadaptive:         new Trait(-2, adaptive),
  Repugnant:           new Trait(-2, charismatic),
  Solitary:            new Trait(-2, communal),
  Deviants:            new Trait(-1, conformists),
  Wasteful:            new Trait(-1, conservationists),
  Unruly:              new Trait(-2, docile),
  Fleeting:            new Trait(-1, enduring),
  Sedentary:           new Trait(-1, nomadic),
  SlowLearners:        new Trait(-1, learners),
  SlowBreeders:        new Trait(-2, breeders),
  Weak:                new Trait(-1, strong),
  Quarrelsome:         new Trait(-1, traditional),
  Decadent:            new Trait(-1, null),
}

const traits = nameItems({
  ...traitsOrigin,
  ...traitsBotanic,
  ...traitsLithoid,
  ...traitsNormal,
})
