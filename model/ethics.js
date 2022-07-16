class Ethic extends Item {
  static valueSum = (acc, { value }) => acc + value

  constructor(value, kind, name) {
    super(name)
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

const ethics = {
  FanaticMilitarist:    new Ethic(2, militarist,    'Fanatic Militarist'),
  FanaticPacifist:      new Ethic(2, militarist,    'Fanatic Pacifist'),
  FanaticXenophobe:     new Ethic(2, xenophobe,     'Fanatic Xenophobe'),
  FanaticXenophile:     new Ethic(2, xenophobe,     'Fanatic Xenophile'),
  FanaticAuthoritarian: new Ethic(2, authoritarian, 'Fanatic Authoritarian'),
  FanaticEgalitarian:   new Ethic(2, authoritarian, 'Fanatic Egalitarian'),
  FanaticMaterialist:   new Ethic(2, materialist,   'Fanatic Materialist'),
  FanaticSpiritualist:  new Ethic(2, materialist,   'Fanatic Spiritualist'),
  Militarist:           new Ethic(1, militarist,    'Militarist'),
  Pacifist:             new Ethic(1, militarist,    'Pacifist'),
  Xenophobe:            new Ethic(1, xenophobe,     'Xenophobe'),
  Xenophile:            new Ethic(1, xenophobe,     'Xenophile'),
  Authoritarian:        new Ethic(1, authoritarian, 'Authoritarian'),
  Egalitarian:          new Ethic(1, authoritarian, 'Egalitarian'),
  Materialist:          new Ethic(1, materialist,   'Materialist'),
  Spiritualist:         new Ethic(1, materialist,   'Spiritualist'),
  Gestalt:              new Ethic(3, null,          'Gestalt'),
}