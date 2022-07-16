class Ethic {
  static valueSum = (acc, { value }) => acc + value

  constructor(name, value) {
    this.name = name
    this.value = value
  }

  checked = () => empire.ethics.includes(this)

  valid = () => {
    if (this.checked()) return true
    return (empire.ethics.length < 2)
        && (empire.ethics.reduce(Ethic.valueSum, 0) + this.value <= 3)
  }
}

const ethics = [
  new Ethic('Gestalt', 3),
  new Ethic('Fanatic Militarist', 2),
  new Ethic('Fanatic Pacifist', 2),
  new Ethic('Fanatic Xenophobe', 2),
  new Ethic('Fanatic Xenophile', 2),
  new Ethic('Fanatic Authoritarian', 2),
  new Ethic('Fanatic Egalitarian', 2),
  new Ethic('Militarist', 1),
  new Ethic('Pacifist', 1),
  new Ethic('Xenophobe', 1),
  new Ethic('Xenophile', 1),
  new Ethic('Authoritarian', 1),
  new Ethic('Egalitarian', 1),
]