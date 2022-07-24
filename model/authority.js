// @ts-check
/// <reference path="../paths.js" />

class Authority extends Item {
  empireList = empire.authority

  generalRule = () => this.empireList.length === 1
  isAvailable = () => this.empireList.length === 0
}

const authority = [
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
]
  .map(addItemType(Authority))
  .map(cookItem)
