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

const eGestalt              = new Ethic('Gestalt', 3)
const eFanaticMilitarist    = new Ethic('Fanatic Militarist', 2)
const eFanaticPacifist      = new Ethic('Fanatic Pacifist', 2)
const eFanaticXenophobe     = new Ethic('Fanatic Xenophobe', 2)
const eFanaticXenophile     = new Ethic('Fanatic Xenophile', 2)
const eFanaticAuthoritarian = new Ethic('Fanatic Authoritarian', 2)
const eFanaticEgalitarian   = new Ethic('Fanatic Egalitarian', 2)
const eMilitarist           = new Ethic('Militarist', 1)
const ePacifist             = new Ethic('Pacifist', 1)
const eXenophobe            = new Ethic('Xenophobe', 1)
const eXenophile            = new Ethic('Xenophile', 1)
const eAuthoritarian        = new Ethic('Authoritarian', 1)
const eEgalitarian          = new Ethic('Egalitarian', 1)

const ethics = [
  eGestalt,
  eFanaticMilitarist,
  eFanaticPacifist,
  eFanaticXenophobe,
  eFanaticXenophile,
  eFanaticAuthoritarian,
  eFanaticEgalitarian,
  eMilitarist,
  ePacifist,
  eXenophobe,
  eXenophile,
  eAuthoritarian,
  eEgalitarian,
]