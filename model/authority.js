class Authority {
  constructor(name, cannotHave, mustHave) {
    this.name = name
    this.cannotHave = cannotHave
    this.mustHave = mustHave
  }

  checked = () => empire.authority.includes(this)

  valid = () => {
    if (this.checked()) return true
    return (empire.authority.length == 0)
      && !this.cannotHave.some(x => nestedIncludes(empire, x))
      && this.mustHave.every(x => nestedIncludes(empire, x))
  }
}

const authority = {
  Democratic: new Authority('Democratic', [
    ethics.Authoritarian,
    ethics.FanaticAuthoritarian,
    ethics.Gestalt
  ], []),
  Oligarchic: new Authority('Oligarchic', [
    ethics.FanaticAuthoritarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  ], []),
  Dictatorial: new Authority('Dictatorial', [
    ethics.Egalitarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  ], []),
  Imperial: new Authority('Imperial', [
    ethics.Egalitarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  ], []),
  HiveMind: new Authority('Hive Mind', [ pop.Mechanical ], [ ethics.Gestalt ]),
  MachineIntelligence: new Authority('Machine Intelligence', [], [
    pop.Mechanical,
    ethics.Gestalt
  ]),
  Corporate: new Authority('Corporate', [
    ethics.FanaticAuthoritarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  ], []),
}
