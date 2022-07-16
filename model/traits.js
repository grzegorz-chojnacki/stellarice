class Trait extends Item {
  static costSum = (acc, { cost }) => acc + cost

  constructor(value, kind, name, rules) {
    super(name, rules)
    this.empireName += 's'
    this.value = value
    this.cost = -value
    this.kind = kind
  }

  invalid = () => {
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

const traits = {
  Adaptive:            new Trait( 2, adaptive, 'Adaptive'),
  ExtremelyAdaptive:   new Trait( 4, adaptive, 'Extremely Adaptive'),
  Nonadaptive:         new Trait(-2, adaptive, 'Nonadaptive'),
  Agrarian:            new Trait( 2, null, 'Agrarian'),
  Charismatic:         new Trait( 2, charismatic, 'Charismatic'),
  Repugnant:           new Trait(-2, charismatic, 'Repugnant'),
  Communal:            new Trait( 1, communal, 'Communal'),
  Solitary:            new Trait(-2, communal, 'Solitary'),
  Conformists:         new Trait( 2, conformists, 'Conformists'),
  Deviants:            new Trait(-1, conformists, 'Deviants'),
  Conservationist:     new Trait( 1, conservationists, 'Conservationist'),
  Wasteful:            new Trait(-1, conservationists, 'Wasteful'),
  Docile:              new Trait( 2, docile, 'Docile'),
  Unruly:              new Trait(-2, docile, 'Unruly'),
  Enduring:            new Trait( 1, enduring, 'Enduring'),
  Venerable:           new Trait( 4, enduring, 'Venerable'),
  Fleeting:            new Trait(-1, enduring, 'Fleeting'),
  Industrious:         new Trait( 2, null, 'Industrious'),
  Ingenious:           new Trait( 2, null, 'Ingenious'),
  Intelligent:         new Trait( 2, null, 'Intelligent'),
  NaturalEngineers:    new Trait( 1, null, 'Natural Engineers'),
  NaturalPhysicists:   new Trait( 1, null, 'Natural Physicists'),
  NaturalSociologists: new Trait( 1, null, 'Natural Sociologists'),
  Nomadic:             new Trait( 1, nomadic, 'Nomadic'),
  Sedentary:           new Trait(-1, nomadic, 'Sedentary'),
  QuickLearners:       new Trait( 1, learners, 'Quick Learners'),
  SlowLearners:        new Trait(-1, learners, 'Slow Learners'),
  RapidBreeders:       new Trait( 2, breeders, 'Rapid Breeders'),
  SlowBreeders:        new Trait(-2, breeders, 'Slow Breeders'),
  Resilient:           new Trait( 1, null, 'Resilient'),
  Strong:              new Trait( 1, strong, 'Strong'),
  VeryStrong:          new Trait( 3, strong, 'Very Strong'),
  Weak:                new Trait(-1, strong, 'Weak'),
  Talented:            new Trait( 1, null, 'Talented'),
  Thrifty:             new Trait( 2, null, 'Thrifty'),
  Traditional:         new Trait( 1, traditional, 'Traditional'),
  Quarrelsome:         new Trait(-1, traditional, 'Quarrelsome'),
  Decadent:            new Trait(-1, null, 'Decadent'),
}