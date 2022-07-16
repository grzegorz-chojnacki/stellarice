class Authority extends Item {
  constructor(name, rules) {
    super(name, rules)
  }

  genericConstraint = () => (this.empireList.length < 1)
}

const authority = {
  Democratic: () => new Authority('Democratic', () => none(
    ethics.Authoritarian,
    ethics.FanaticAuthoritarian,
    ethics.Gestalt
  )),
  Oligarchic: () => new Authority('Oligarchic', () => none(
    ethics.FanaticAuthoritarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  )),
  Dictatorial: () => new Authority('Dictatorial', () => none(
    ethics.Egalitarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  )),
  Imperial: () => new Authority('Imperial', () => none(
    ethics.Egalitarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  )),
  Corporate: () => new Authority('Corporate', () => none(
    ethics.FanaticAuthoritarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  )),
  HiveMind: () => new Authority('Hive Mind', () => every(
    none(pop.Mechanical),
    every(ethics.Gestalt)
  )),
  MachineIntelligence: () => new Authority('Machine Intelligence', () => every(
    pop.Mechanical,
    ethics.Gestalt
  )),
}
