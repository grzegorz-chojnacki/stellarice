class Authority extends Item {
  constructor(item) {
    super(item)
  }

  generalRule = () => this.empireList.length < 1
}

const authority = Item.create(Authority, [
  {
    id: 'Imperial',
    rule: none('Egalitarian', 'FanaticEgalitarian', 'Gestalt'),
  },
  {
    id: 'Dictatorial',
    rule: none('Egalitarian', 'FanaticEgalitarian', 'Gestalt'),
  },
  {
    id: 'Oligarchic',
    rule: none('FanaticAuthoritarian', 'FanaticEgalitarian', 'Gestalt'),
  },
  {
    id: 'Democratic',
    rule: none('Authoritarian', 'FanaticAuthoritarian', 'Gestalt'),
  },
  {
    id: 'Corporate',
    rule: none('FanaticAuthoritarian', 'FanaticEgalitarian', 'Gestalt'),
  },
  {
    id: 'HiveMind',
    rule: every('Gestalt', none('Mechanical')),
  },
  {
    id: 'MachineIntelligence',
    rule: every('Mechanical', 'Gestalt'),
  },
])
