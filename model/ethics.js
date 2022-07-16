class Ethic extends Authority {
  static valueSum = (acc, { value }) => acc + value

  constructor(name, value) {
    this.name = name
    this.value = value
  }

  checked = () => empire.has(this)

  valid = () => {
    if (this.checked()) return true
    return (empire.ethics.length < 2)
        && (empire.ethics.reduce(Ethic.valueSum, 0) + this.value <= 3)
  }
}

const ethics = {
  Gestalt:              new Ethic('Gestalt', 3),
  FanaticMilitarist:    new Ethic('Fanatic Militarist', 2),
  FanaticPacifist:      new Ethic('Fanatic Pacifist', 2),
  FanaticXenophobe:     new Ethic('Fanatic Xenophobe', 2),
  FanaticXenophile:     new Ethic('Fanatic Xenophile', 2),
  FanaticAuthoritarian: new Ethic('Fanatic Authoritarian', 2),
  FanaticEgalitarian:   new Ethic('Fanatic Egalitarian', 2),
  Militarist:           new Ethic('Militarist', 1),
  Pacifist:             new Ethic('Pacifist', 1),
  Xenophobe:            new Ethic('Xenophobe', 1),
  Xenophile:            new Ethic('Xenophile', 1),
  Authoritarian:        new Ethic('Authoritarian', 1),
  Egalitarian:          new Ethic('Egalitarian', 1),
}