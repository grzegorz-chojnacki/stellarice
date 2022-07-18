class Authority extends Item {
  constructor(rules) {
    super(rules)
  }

  generalRule = () => this.empireList.length < 1
}

const authority = Item.create(Authority, [
  {
    name: 'Imperial',
    rule: none('Egalitarian', 'FanaticEgalitarian', 'Gestalt'),
  },
  {
    name: 'Dictatorial',
    rule: none('Egalitarian', 'FanaticEgalitarian', 'Gestalt'),
  },
  {
    name: 'Oligarchic',
    rule: none('FanaticAuthoritarian', 'FanaticEgalitarian', 'Gestalt'),
  },
  {
    name: 'Democratic',
    rule: none('Authoritarian', 'FanaticAuthoritarian', 'Gestalt'),
  },
  {
    name: 'Corporate',
    rule: none('FanaticAuthoritarian', 'FanaticEgalitarian', 'Gestalt'),
  },
  {
    name: 'HiveMind',
    rule: every('Gestalt', none('Mechanical')),
  },
  {
    name: 'MachineIntelligence',
    rule: every('Mechanical', 'Gestalt'),
  },
])
