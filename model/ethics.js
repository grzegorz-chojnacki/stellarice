class Ethic extends Item {
  static valueSum = (acc, { value }) => acc + value

  constructor(value, kind) {
    super()
    this.empireName += 's'
    this.value = value
    this.kind = kind
  }

  genericConstraint = () => this.empireList.length < 3
     && !this.empireList.some(ethic => ethic.kind && ethic.kind === this.kind)
     && this.empireList.reduce(Ethic.valueSum, 0) + this.value <= 3
}

const militarist    = Symbol('militarist')
const xenophobe     = Symbol('xenophobe')
const authoritarian = Symbol('authoritarian')
const materialist   = Symbol('materialist')

const ethics = nameItems({
  FanaticMilitarist:    new Ethic(2, militarist),
  FanaticPacifist:      new Ethic(2, militarist),
  FanaticXenophobe:     new Ethic(2, xenophobe),
  FanaticXenophile:     new Ethic(2, xenophobe),
  FanaticAuthoritarian: new Ethic(2, authoritarian),
  FanaticEgalitarian:   new Ethic(2, authoritarian),
  FanaticMaterialist:   new Ethic(2, materialist),
  FanaticSpiritualist:  new Ethic(2, materialist),
  Militarist:           new Ethic(1, militarist),
  Pacifist:             new Ethic(1, militarist),
  Xenophobe:            new Ethic(1, xenophobe),
  Xenophile:            new Ethic(1, xenophobe),
  Authoritarian:        new Ethic(1, authoritarian),
  Egalitarian:          new Ethic(1, authoritarian),
  Materialist:          new Ethic(1, materialist),
  Spiritualist:         new Ethic(1, materialist),
  Gestalt:              new Ethic(3, null),
})
