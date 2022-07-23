// @ts-check

class Authority extends Item {
  get empireList() {
    return empire.authority
  }

  generalRule = () => this.empireList.length === 1
  isAvailable = () => this.empireList.length === 0
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
