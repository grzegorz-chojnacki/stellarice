// @ts-check
/// <reference path="../paths.js" />

class Authority extends Item {
  empireList = empire.authority

  isAvailable = () => this.empireList.length === 0
}

// Source: https://stellaris.paradoxwikis.com/Government

const authority = [
  {
    id: 'Imperial',
    rule: none('Egalitarian', 'Fanatic Egalitarian', 'Gestalt'),
  },
  {
    id: 'Dictatorial',
    rule: none('Egalitarian', 'Fanatic Egalitarian', 'Gestalt'),
  },
  {
    id: 'Oligarchic',
    rule: none('Fanatic Authoritarian', 'Fanatic Egalitarian', 'Gestalt'),
  },
  {
    id: 'Democratic',
    rule: none('Authoritarian', 'Fanatic Authoritarian', 'Gestalt'),
  },
  {
    id: 'Corporate',
    rule: none('Fanatic Authoritarian', 'Fanatic Egalitarian', 'Gestalt'),
  },
  {
    id: 'Hive Mind',
    rule: every('Gestalt', none('Mechanical'), none(
        'Conformists', 'Deviants',
        'Conservationist', 'Wasteful',
        'Thrifty', 'Decadent',
      )),
  },
  {
    id: 'Machine Intelligence',
    rule: every('Mechanical', 'Gestalt'),
  },
].map(item => new Authority(item))
