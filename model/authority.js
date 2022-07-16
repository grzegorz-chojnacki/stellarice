class Authority extends Item {
  constructor(rules) {
    super(rules)
  }

  genericConstraint = () => (this.empireList.length < 1)
}

const authority = nameItems({
  Democratic: new Authority(() => none(
    ethics.Authoritarian,
    ethics.FanaticAuthoritarian,
    ethics.Gestalt
  )),
  Oligarchic: new Authority(() => none(
    ethics.FanaticAuthoritarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  )),
  Dictatorial: new Authority(() => none(
    ethics.Egalitarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  )),
  Imperial: new Authority(() => none(
    ethics.Egalitarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  )),
  Corporate: new Authority(() => none(
    ethics.FanaticAuthoritarian,
    ethics.FanaticEgalitarian,
    ethics.Gestalt
  )),
  HiveMind: new Authority(() => every(
    ethics.Gestalt,
    none(pop.Mechanical),
  )),
  MachineIntelligence: new Authority(() => every(
    pop.Mechanical,
    ethics.Gestalt
  )),
})
