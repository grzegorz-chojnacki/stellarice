class Ethic extends Item {
  static valueSum = (acc, { value }) => acc + value

  constructor(value, rules) {
    super(rules)
    this.empireName += 's'
    this.value = value
  }

  generalTest = () => this.empireList.reduce(Ethic.valueSum, 0) + this.value <= 3
}

const militarist = () => one(
  pop.Mechanical,
  ethics.FanaticMilitarist, ethics.Militarist,
  ethics.FanaticPacifist, ethics.Pacifist,
)

const xenophobe = () => one(
  pop.Mechanical,
  ethics.FanaticXenophobe, ethics.Xenophobe,
  ethics.FanaticXenophile, ethics.Xenophile,
)

const authoritarian = () => one(
  pop.Mechanical,
  ethics.FanaticAuthoritarian, ethics.Authoritarian,
  ethics.FanaticEgalitarian, ethics.Egalitarian,
)

const materialist = () => one(
  pop.Mechanical,
  ethics.FanaticMaterialist, ethics.Materialist,
  ethics.FanaticSpiritualist, ethics.Spiritualist,
)

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
  Gestalt:              new Ethic(3, () => one(ethics.Gestalt)),
})
