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

const aDemocratic = new Authority('Democratic',
  [ eAuthoritarian, eFanaticAuthoritarian, eGestalt ],
  [])
const aOligarchic = new Authority('Oligarchic',
  [ eFanaticAuthoritarian, eFanaticEgalitarian, eGestalt ],
  [])
const aDictatorial = new Authority('Dictatorial',
  [ eEgalitarian, eFanaticEgalitarian, eGestalt ],
  [])
const aImperial = new Authority('Imperial',
  [ eEgalitarian, eFanaticEgalitarian, eGestalt ],
  [])
const aHiveMind = new Authority('Hive Mind',
  [ pMechanical ],
  [ eGestalt ])
const aMachineIntelligence = new Authority('Machine Intelligence',
  [],
  [ pMechanical, eGestalt ])
const aCorporate = new Authority('Corporate',
  [ eFanaticAuthoritarian, eFanaticEgalitarian, eGestalt ],
  [])

const authority = [
  aDemocratic,
  aOligarchic,
  aDictatorial,
  aImperial,
  aHiveMind,
  aMachineIntelligence,
  aCorporate,
]
